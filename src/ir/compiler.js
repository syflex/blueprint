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
              })),
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
