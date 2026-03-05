import { IR_VERSION } from "./schema";
import { getConnectionSemantic } from "../registry/connectionRules";

/**
 * Slugify a name for use as an ID.
 */
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

/**
 * Compile React Flow nodes + edges into a SystemGraph IR.
 *
 * @param {import('@xyflow/react').Node[]} nodes
 * @param {import('@xyflow/react').Edge[]} edges
 * @returns {import('./schema').SystemGraph}
 */
export function compileToIR(nodes, edges) {
  const ir = {
    version: IR_VERSION,
    auth: null,
    database: null,
    storage: null,
    functions: [],
    realtime: null,
    messaging: null,
    teams: null,
    oauth: null,
    webhooks: null,
    clientApps: [],
    externalApis: [],
    paymentGateway: null,
    connections: [],
  };

  // Build node lookup
  const nodeMap = new Map();
  for (const node of nodes) {
    nodeMap.set(node.id, node);
  }

  // Process nodes by type
  for (const node of nodes) {
    const type = node.data.componentType;
    const config = node.data.config;

    switch (type) {
      case "auth":
        ir.auth = {
          providers: config.providers || [],
          guestAccess: config.guestAccess || false,
          sessionDuration: config.sessionDuration || 365,
          passwordPolicy: config.passwordPolicy || { minLength: 8, uppercase: false, numbers: false, specialChars: false },
        };
        break;

      case "database": {
        // Merge collections from all database nodes
        const collections = (config.collections || [])
          .filter((c) => c.name)
          .map((c) => ({
            name: c.name,
            id: slugify(c.name),
            fields: (c.fields || [])
              .filter((f) => f.name)
              .map((f) => ({
                name: f.name,
                type: f.type || "string",
                required: f.required || false,
                ...(f.relatedCollection ? { relatedCollection: f.relatedCollection } : {}),
                ...(f.relationType ? { relationType: f.relationType } : {}),
              })),
            indexes: (c.indexes || []).map((idx) => ({
              type: idx.type || "key",
              attributes: idx.attributes || [],
            })),
            permissionPreset: c.permissionPreset || "users",
          }));

        if (ir.database) {
          ir.database.collections.push(...collections);
        } else {
          ir.database = { collections };
        }
        break;
      }

      case "storage": {
        const buckets = (config.buckets || [])
          .filter((b) => b.name)
          .map((b) => ({
            name: b.name,
            id: slugify(b.name),
            allowedTypes: b.allowedTypes || [],
            maxSize: b.maxSize || null,
            permissionPreset: b.permissionPreset || "auth_read",
          }));

        if (ir.storage) {
          ir.storage.buckets.push(...buckets);
        } else {
          ir.storage = { buckets };
        }
        break;
      }

      case "functions": {
        const fns = (config.functions || [])
          .filter((f) => f.name)
          .map((f) => ({
            name: f.name,
            id: slugify(f.name),
            trigger: f.trigger || "http",
            runtime: f.runtime || "node-18.0",
            schedule: f.schedule || undefined,
            envVars: (f.envVars || []).filter((e) => e.key),
            timeout: f.timeout || 15,
            memory: f.memory || 128,
            connectedCollections: [],
            connectedBuckets: [],
          }));
        ir.functions.push(...fns);
        break;
      }

      case "realtime":
        ir.realtime = {
          autoSubscribe: config.autoSubscribe ?? true,
          subscribedCollections: [],
        };
        break;

      case "messaging":
        ir.messaging = {
          channels: config.channels || [],
        };
        break;

      case "teams":
        ir.teams = {
          teams: (config.teams || [])
            .filter((t) => t.name)
            .map((t) => ({
              name: t.name,
              id: slugify(t.name),
              roles: t.roles || ["owner", "admin", "member"],
              customRoles: t.customRoles || [],
            })),
        };
        break;

      case "oauth":
        ir.oauth = {
          providers: config.providers || [],
          redirectUrl: config.redirectUrl || "http://localhost:3000/auth/callback",
        };
        break;

      case "webhooks":
        ir.webhooks = {
          webhooks: (config.webhooks || [])
            .filter((w) => w.name)
            .map((w) => ({
              name: w.name,
              id: slugify(w.name),
              url: w.url || "",
              events: w.events || [],
              signatureSecret: w.signatureSecret || false,
            })),
        };
        break;

      case "clientApp":
        ir.clientApps.push({
          name: config.name || "web-app",
          id: slugify(config.name || "web-app"),
          framework: config.framework || "react",
        });
        break;

      case "externalApi": {
        const apis = (config.apis || [])
          .filter((a) => a.name)
          .map((a) => ({
            name: a.name,
            id: slugify(a.name),
            baseUrl: a.baseUrl || "",
            authMethod: a.authMethod || "api_key",
            headers: (a.headers || []).filter((h) => h.key),
          }));
        ir.externalApis.push(...apis);
        break;
      }

      case "paymentGateway":
        ir.paymentGateway = {
          provider: config.provider || "stripe",
          webhookEvents: config.webhookEvents || [],
          currency: config.currency || "usd",
        };
        break;
    }
  }

  // Process edges into connections with semantic meaning
  for (const edge of edges) {
    const sourceNode = nodeMap.get(edge.source);
    const targetNode = nodeMap.get(edge.target);

    if (!sourceNode || !targetNode) continue;

    const sourceType = sourceNode.data.componentType;
    const targetType = targetNode.data.componentType;
    const semantic = getConnectionSemantic(sourceType, targetType);

    if (semantic) {
      ir.connections.push({
        sourceId: edge.source,
        sourceType,
        targetId: edge.target,
        targetType,
        semantic: semantic.semantic,
        meaning: semantic.meaning,
      });
    }
  }

  // Derive function→database and function→storage connections
  if (ir.functions.length > 0) {
    const fnToDB = ir.connections.filter(
      (c) => c.sourceType === "functions" && c.targetType === "database"
    );
    const fnToStorage = ir.connections.filter(
      (c) => c.sourceType === "functions" && c.targetType === "storage"
    );
    if (fnToDB.length > 0 && ir.database) {
      for (const fn of ir.functions) {
        fn.connectedCollections = ir.database.collections.map((c) => c.id);
      }
    }
    if (fnToStorage.length > 0 && ir.storage) {
      for (const fn of ir.functions) {
        fn.connectedBuckets = ir.storage.buckets.map((b) => b.id);
      }
    }
  }

  // Derive realtime subscribed collections from connections
  if (ir.realtime && ir.database) {
    const dbToRtConnections = ir.connections.filter(
      (c) => c.sourceType === "database" && c.targetType === "realtime"
    );
    if (dbToRtConnections.length > 0) {
      ir.realtime.subscribedCollections = ir.database.collections.map((c) => c.name);
    }
  }

  return ir;
}
