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
    description: "Auth + Database + Realtime",
    icon: "icon-check",
    color: "#6C5CE7",
    nodes: [
      node("auth-1", "auth", "Auth", { providers: ["email"], guestAccess: false }, { x: 100, y: 200 }),
      node("database-2", "database", "Database", {
        collections: [{
          name: "tasks",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "completed", type: "boolean", required: false },
            { name: "userId", type: "string", required: true },
          ],
          permissionPreset: "owner",
        }],
      }, { x: 400, y: 100 }),
      node("realtime-3", "realtime", "Realtime", { autoSubscribe: true }, { x: 700, y: 100 }),
    ],
    edges: [
      edge("auth-1", "database-2", "auth_permissions", "Apply auth-based permissions to collections"),
      edge("database-2", "realtime-3", "collection_subscriptions", "Subscribe to document changes in real time"),
    ],
  },
  {
    id: "blog",
    name: "Blog Platform",
    description: "Auth + Database + Storage + Functions",
    icon: "icon-document",
    color: "#F02E65",
    nodes: [
      node("auth-1", "auth", "Auth", { providers: ["email"], guestAccess: false }, { x: 100, y: 250 }),
      node("database-2", "database", "Database", {
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
      }, { x: 400, y: 100 }),
      node("storage-3", "storage", "Storage", {
        buckets: [{ name: "media", allowedTypes: ["image/jpeg", "image/png", "image/webp"], maxSize: 10485760 }],
      }, { x: 400, y: 400 }),
      node("functions-4", "functions", "Functions", {
        functions: [{ name: "generate_slug", trigger: "event", runtime: "node-18.0" }],
      }, { x: 700, y: 250 }),
    ],
    edges: [
      edge("auth-1", "database-2", "auth_permissions", "Apply auth-based permissions to collections"),
      edge("auth-1", "storage-3", "auth_permissions", "Apply auth-based permissions to buckets"),
      edge("database-2", "functions-4", "event_trigger", "Trigger function on document create/update/delete"),
      edge("functions-4", "database-2", "crud_operations", "Function reads/writes documents in collections"),
    ],
  },
  {
    id: "chat",
    name: "Chat App",
    description: "Auth + Database + Realtime + Functions + Messaging",
    icon: "icon-chat",
    color: "#0984E3",
    nodes: [
      node("auth-1", "auth", "Auth", { providers: ["email"], guestAccess: false }, { x: 50, y: 250 }),
      node("database-2", "database", "Database", {
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
      }, { x: 350, y: 100 }),
      node("realtime-3", "realtime", "Realtime", { autoSubscribe: true }, { x: 650, y: 100 }),
      node("functions-4", "functions", "Functions", {
        functions: [{ name: "moderate", trigger: "event", runtime: "node-18.0" }],
      }, { x: 350, y: 400 }),
      node("messaging-5", "messaging", "Messaging", {
        channels: ["push"],
      }, { x: 650, y: 400 }),
    ],
    edges: [
      edge("auth-1", "database-2", "auth_permissions", "Apply auth-based permissions to collections"),
      edge("database-2", "realtime-3", "collection_subscriptions", "Subscribe to document changes in real time"),
      edge("database-2", "functions-4", "event_trigger", "Trigger function on document create/update/delete"),
      edge("functions-4", "messaging-5", "send_notification", "Function sends email/push/SMS via Messaging"),
    ],
  },
  {
    id: "filemanager",
    name: "File Manager",
    description: "Auth + Storage + Database + Functions",
    icon: "icon-folder",
    color: "#00B894",
    nodes: [
      node("auth-1", "auth", "Auth", { providers: ["email"], guestAccess: false }, { x: 100, y: 250 }),
      node("storage-2", "storage", "Storage", {
        buckets: [
          { name: "documents", allowedTypes: ["application/pdf", "text/plain"], maxSize: 52428800 },
          { name: "images", allowedTypes: ["image/jpeg", "image/png", "image/webp"], maxSize: 10485760 },
        ],
      }, { x: 400, y: 100 }),
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
      }, { x: 400, y: 400 }),
      node("functions-4", "functions", "Functions", {
        functions: [{ name: "process_upload", trigger: "event", runtime: "node-18.0" }],
      }, { x: 700, y: 250 }),
    ],
    edges: [
      edge("auth-1", "storage-2", "auth_permissions", "Apply auth-based permissions to buckets"),
      edge("auth-1", "database-3", "auth_permissions", "Apply auth-based permissions to collections"),
      edge("storage-2", "functions-4", "event_trigger", "Trigger function on file upload/delete"),
      edge("functions-4", "database-3", "crud_operations", "Function reads/writes documents in collections"),
      edge("functions-4", "storage-2", "file_operations", "Function reads/writes files in buckets"),
    ],
  },
];
