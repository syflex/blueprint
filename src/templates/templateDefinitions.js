/**
 * Pre-built project templates.
 * Each returns { nodes, edges } ready for canvasStore.loadCanvas().
 */

function node(id, type, label, config, position) {
  return {
    id,
    type,
    position,
    data: { componentType: type, label, config },
  };
}

function edge(source, target, semantic, meaning) {
  return {
    id: `${source}->${target}`,
    source,
    target,
    type: "labeled",
    animated: true,
    data: { semantic, meaning },
  };
}

export const templates = [
  {
    id: "blank",
    name: "Blank Canvas",
    description: "Start from scratch",
    icon: "icon-plus",
    color: "#97979B",
    nodes: [],
    edges: [],
  },
  {
    id: "todo",
    name: "Todo App",
    description: "Client App + Auth + Database + Realtime",
    icon: "icon-check",
    color: "#6C5CE7",
    nodes: [
      node("client-1", "clientApp", "Client App", { framework: "react", name: "todo-app" }, { x: 50, y: 200 }),
      node("auth-2", "auth", "Auth", { providers: ["email"], guestAccess: false }, { x: 350, y: 200 }),
      node("database-3", "database", "Database", {
        collections: [{
          name: "tasks",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "completed", type: "boolean", required: false },
            { name: "userId", type: "string", required: true },
          ],
          permissionPreset: "owner",
        }],
      }, { x: 650, y: 100 }),
      node("realtime-4", "realtime", "Realtime", { autoSubscribe: true }, { x: 950, y: 100 }),
    ],
    edges: [
      edge("client-1", "auth-2", "client_auth", "Client handles authentication flow"),
      edge("auth-2", "database-3", "auth_permissions", "Apply auth-based permissions to collections"),
      edge("database-3", "realtime-4", "collection_subscriptions", "Subscribe to document changes in real time"),
    ],
  },
  {
    id: "blog",
    name: "Blog Platform",
    description: "OAuth + Auth + Database + Storage + Functions + Client App",
    icon: "icon-document",
    color: "#F02E65",
    nodes: [
      node("oauth-1", "oauth", "OAuth", {
        providers: ["google", "github"],
        redirectUrl: "http://localhost:3000/auth/callback",
      }, { x: 50, y: 100 }),
      node("client-2", "clientApp", "Client App", { framework: "nextjs", name: "blog-app" }, { x: 50, y: 350 }),
      node("auth-3", "auth", "Auth", { providers: ["email"], guestAccess: false }, { x: 350, y: 220 }),
      node("database-4", "database", "Database", {
        collections: [
          {
            name: "posts",
            fields: [
              { name: "title", type: "string", required: true },
              { name: "slug", type: "string", required: true },
              { name: "content", type: "string", required: true },
              { name: "authorId", type: "string", required: true },
              { name: "publishedAt", type: "datetime", required: false },
            ],
            permissionPreset: "users",
          },
          {
            name: "comments",
            fields: [
              { name: "body", type: "string", required: true },
              { name: "postId", type: "string", required: true },
              { name: "authorId", type: "string", required: true },
            ],
            permissionPreset: "users",
          },
        ],
      }, { x: 650, y: 100 }),
      node("storage-5", "storage", "Storage", {
        buckets: [{ name: "media", allowedTypes: ["image/jpeg", "image/png", "image/webp"], maxSize: 10485760 }],
      }, { x: 650, y: 380 }),
      node("functions-6", "functions", "Functions", {
        functions: [{ name: "generate_slug", trigger: "event", runtime: "node-18.0" }],
      }, { x: 950, y: 220 }),
    ],
    edges: [
      edge("oauth-1", "auth-3", "oauth_session", "Create auth session via OAuth provider"),
      edge("client-2", "auth-3", "client_auth", "Client handles authentication flow"),
      edge("auth-3", "database-4", "auth_permissions", "Apply auth-based permissions to collections"),
      edge("auth-3", "storage-5", "auth_permissions", "Apply auth-based permissions to buckets"),
      edge("database-4", "functions-6", "event_trigger", "Trigger function on document create/update/delete"),
      edge("functions-6", "database-4", "crud_operations", "Function reads/writes documents in collections"),
    ],
  },
  {
    id: "chat",
    name: "Chat App",
    description: "Auth + Teams + Database + Realtime + Functions + Messaging",
    icon: "icon-chat",
    color: "#0984E3",
    nodes: [
      node("auth-1", "auth", "Auth", { providers: ["email"], guestAccess: false }, { x: 50, y: 250 }),
      node("teams-2", "teams", "Teams", {
        teams: [
          { name: "general", roles: ["owner", "admin", "member"] },
          { name: "moderators", roles: ["owner", "admin"] },
        ],
      }, { x: 350, y: 80 }),
      node("database-3", "database", "Database", {
        collections: [
          {
            name: "messages",
            fields: [
              { name: "body", type: "string", required: true },
              { name: "channelId", type: "string", required: true },
              { name: "senderId", type: "string", required: true },
            ],
            permissionPreset: "users",
          },
          {
            name: "channels",
            fields: [
              { name: "name", type: "string", required: true },
              { name: "description", type: "string", required: false },
            ],
            permissionPreset: "users",
          },
        ],
      }, { x: 650, y: 80 }),
      node("realtime-4", "realtime", "Realtime", { autoSubscribe: true }, { x: 950, y: 80 }),
      node("functions-5", "functions", "Functions", {
        functions: [{ name: "moderate", trigger: "event", runtime: "node-18.0" }],
      }, { x: 650, y: 400 }),
      node("messaging-6", "messaging", "Messaging", {
        channels: ["push"],
      }, { x: 950, y: 400 }),
    ],
    edges: [
      edge("auth-1", "database-3", "auth_permissions", "Apply auth-based permissions to collections"),
      edge("auth-1", "teams-2", "team_membership", "Users join and manage teams"),
      edge("teams-2", "database-3", "team_permissions", "Apply team-based permissions to collections"),
      edge("database-3", "realtime-4", "collection_subscriptions", "Subscribe to document changes in real time"),
      edge("database-3", "functions-5", "event_trigger", "Trigger function on document create/update/delete"),
      edge("functions-5", "messaging-6", "send_notification", "Function sends email/push/SMS via Messaging"),
    ],
  },
  {
    id: "filemanager",
    name: "File Manager",
    description: "Auth + Storage + Database + Functions + Webhooks",
    icon: "icon-folder",
    color: "#00B894",
    nodes: [
      node("auth-1", "auth", "Auth", { providers: ["email"], guestAccess: false }, { x: 50, y: 250 }),
      node("storage-2", "storage", "Storage", {
        buckets: [
          { name: "documents", allowedTypes: ["application/pdf", "text/plain"], maxSize: 52428800 },
          { name: "images", allowedTypes: ["image/jpeg", "image/png", "image/webp"], maxSize: 10485760 },
        ],
      }, { x: 350, y: 100 }),
      node("database-3", "database", "Database", {
        collections: [{
          name: "file_metadata",
          fields: [
            { name: "fileName", type: "string", required: true },
            { name: "bucketId", type: "string", required: true },
            { name: "fileId", type: "string", required: true },
            { name: "ownerId", type: "string", required: true },
            { name: "size", type: "integer", required: false },
          ],
          permissionPreset: "owner",
        }],
      }, { x: 350, y: 400 }),
      node("functions-4", "functions", "Functions", {
        functions: [{ name: "process_upload", trigger: "event", runtime: "node-18.0" }],
      }, { x: 650, y: 250 }),
      node("webhooks-5", "webhooks", "Webhooks", {
        webhooks: [
          {
            name: "file-sync",
            url: "https://example.com/hooks/file-events",
            events: ["storage.files.create", "storage.files.delete"],
            signatureSecret: true,
          },
        ],
      }, { x: 950, y: 250 }),
    ],
    edges: [
      edge("auth-1", "storage-2", "auth_permissions", "Apply auth-based permissions to buckets"),
      edge("auth-1", "database-3", "auth_permissions", "Apply auth-based permissions to collections"),
      edge("storage-2", "functions-4", "event_trigger", "Trigger function on file upload/delete"),
      edge("functions-4", "database-3", "crud_operations", "Function reads/writes documents in collections"),
      edge("functions-4", "storage-2", "file_operations", "Function reads/writes files in buckets"),
      edge("storage-2", "webhooks-5", "event_trigger", "Fire webhook on file events"),
    ],
  },
  {
    id: "saas",
    name: "SaaS Starter",
    description: "OAuth + Auth + Database + Functions + Payments + Client App",
    icon: "icon-credit-card",
    color: "#10B981",
    nodes: [
      node("client-1", "clientApp", "Client App", { framework: "nextjs", name: "saas-app" }, { x: 50, y: 80 }),
      node("oauth-2", "oauth", "OAuth", {
        providers: ["google", "github"],
        redirectUrl: "http://localhost:3000/auth/callback",
      }, { x: 50, y: 350 }),
      node("auth-3", "auth", "Auth", { providers: ["email"], guestAccess: false }, { x: 350, y: 210 }),
      node("database-4", "database", "Database", {
        collections: [
          {
            name: "profiles",
            fields: [
              { name: "userId", type: "string", required: true },
              { name: "plan", type: "string", required: true },
              { name: "stripeCustomerId", type: "string", required: false },
            ],
            permissionPreset: "owner",
          },
          {
            name: "subscriptions",
            fields: [
              { name: "userId", type: "string", required: true },
              { name: "status", type: "string", required: true },
              { name: "priceId", type: "string", required: true },
              { name: "currentPeriodEnd", type: "datetime", required: false },
            ],
            permissionPreset: "owner",
          },
        ],
      }, { x: 650, y: 80 }),
      node("functions-5", "functions", "Functions", {
        functions: [
          { name: "create_checkout", trigger: "http", runtime: "node-18.0" },
          { name: "payment_webhook", trigger: "http", runtime: "node-18.0" },
        ],
      }, { x: 650, y: 380 }),
      node("payment-6", "paymentGateway", "Payments", {
        provider: "stripe",
        webhookEvents: ["checkout.session.completed", "customer.subscription.updated", "customer.subscription.deleted"],
        currency: "usd",
      }, { x: 950, y: 220 }),
    ],
    edges: [
      edge("client-1", "auth-3", "client_auth", "Client handles authentication flow"),
      edge("client-1", "functions-5", "client_invoke", "Client invokes serverless functions"),
      edge("oauth-2", "auth-3", "oauth_session", "Create auth session via OAuth provider"),
      edge("auth-3", "database-4", "auth_permissions", "Apply auth-based permissions to collections"),
      edge("functions-5", "database-4", "crud_operations", "Function reads/writes documents in collections"),
      edge("functions-5", "payment-6", "payment_process", "Function processes payments"),
      edge("payment-6", "functions-5", "payment_webhook", "Payment provider triggers function via webhook"),
      edge("payment-6", "database-4", "payment_records", "Store transaction records in database"),
    ],
  },
  {
    id: "apibackend",
    name: "API Backend",
    description: "Auth + Database + Functions + External API + Webhooks",
    icon: "icon-cloud",
    color: "#F59E0B",
    nodes: [
      node("auth-1", "auth", "Auth", { providers: ["email"], guestAccess: false }, { x: 50, y: 220 }),
      node("database-2", "database", "Database", {
        collections: [
          {
            name: "records",
            fields: [
              { name: "externalId", type: "string", required: true },
              { name: "data", type: "string", required: true },
              { name: "syncedAt", type: "datetime", required: false },
            ],
            permissionPreset: "users",
          },
        ],
      }, { x: 350, y: 80 }),
      node("functions-3", "functions", "Functions", {
        functions: [
          { name: "sync_external", trigger: "schedule", runtime: "node-18.0" },
          { name: "handle_event", trigger: "event", runtime: "node-18.0" },
        ],
      }, { x: 350, y: 380 }),
      node("external-4", "externalApi", "External API", {
        apis: [{
          name: "data-provider",
          baseUrl: "https://api.example.com/v1",
          authMethod: "api_key",
          headers: [],
        }],
      }, { x: 650, y: 220 }),
      node("webhooks-5", "webhooks", "Webhooks", {
        webhooks: [
          {
            name: "data-sync",
            url: "https://example.com/hooks/sync",
            events: ["databases.*.documents.*.create", "databases.*.documents.*.update"],
            signatureSecret: true,
          },
        ],
      }, { x: 950, y: 220 }),
    ],
    edges: [
      edge("auth-1", "database-2", "auth_permissions", "Apply auth-based permissions to collections"),
      edge("auth-1", "functions-3", "auth_context", "Pass user context to function execution"),
      edge("database-2", "functions-3", "event_trigger", "Trigger function on document create/update/delete"),
      edge("functions-3", "external-4", "api_call", "Function calls external API"),
      edge("external-4", "functions-3", "api_response", "API returns data to function"),
      edge("functions-3", "database-2", "crud_operations", "Function reads/writes documents in collections"),
      edge("database-2", "webhooks-5", "event_trigger", "Fire webhook on document events"),
    ],
  },
];
