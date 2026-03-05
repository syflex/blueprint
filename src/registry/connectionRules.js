/**
 * Connection validation rules based on how Appwrite services actually interact.
 * Each entry maps a source type to its valid target types with semantic meaning.
 */
export const validConnections = {
  // ── Appwrite Core ──────────────────────────────────────────
  auth: {
    database: { semantic: "auth_permissions", meaning: "Apply auth-based permissions to collections" },
    storage: { semantic: "auth_permissions", meaning: "Apply auth-based permissions to buckets" },
    functions: { semantic: "auth_context", meaning: "Pass user context to function execution" },
    teams: { semantic: "team_membership", meaning: "Users join and manage teams" },
  },
  storage: {
    functions: { semantic: "event_trigger", meaning: "Trigger function on file upload/delete" },
    webhooks: { semantic: "event_trigger", meaning: "Fire webhook on file events" },
  },
  functions: {
    messaging: { semantic: "send_notification", meaning: "Function sends email/push/SMS via Messaging" },
    database: { semantic: "crud_operations", meaning: "Function reads/writes documents in collections" },
    storage: { semantic: "file_operations", meaning: "Function reads/writes files in buckets" },
    externalApi: { semantic: "api_call", meaning: "Function calls external API" },
    paymentGateway: { semantic: "payment_process", meaning: "Function processes payments" },
    webhooks: { semantic: "event_trigger", meaning: "Fire webhook on function events" },
  },
  database: {
    realtime: { semantic: "collection_subscriptions", meaning: "Subscribe to document changes in real time" },
    functions: { semantic: "event_trigger", meaning: "Trigger function on document create/update/delete" },
    storage: { semantic: "file_references", meaning: "Collection fields reference files in buckets" },
    webhooks: { semantic: "event_trigger", meaning: "Fire webhook on document events" },
  },
  realtime: {},
  messaging: {},

  // ── Appwrite Extended ──────────────────────────────────────
  teams: {
    database: { semantic: "team_permissions", meaning: "Apply team-based permissions to collections" },
    storage: { semantic: "team_permissions", meaning: "Apply team-based permissions to buckets" },
    functions: { semantic: "team_permissions", meaning: "Scope function access by team" },
  },
  oauth: {
    auth: { semantic: "oauth_session", meaning: "Create auth session via OAuth provider" },
  },
  webhooks: {},

  // ── Third-Party ────────────────────────────────────────────
  clientApp: {
    auth: { semantic: "client_auth", meaning: "Client handles authentication flow" },
    functions: { semantic: "client_invoke", meaning: "Client invokes serverless functions" },
  },
  externalApi: {
    functions: { semantic: "api_response", meaning: "API returns data to function" },
  },
  paymentGateway: {
    functions: { semantic: "payment_webhook", meaning: "Payment provider triggers function via webhook" },
    database: { semantic: "payment_records", meaning: "Store transaction records in database" },
  },
};

/**
 * Check if a connection from sourceType to targetType is valid.
 * @param {string} sourceType - Component type of the source node
 * @param {string} targetType - Component type of the target node
 * @returns {boolean}
 */
export function isConnectionValid(sourceType, targetType) {
  return !!(validConnections[sourceType] && validConnections[sourceType][targetType]);
}

/**
 * Get the semantic meaning of a connection.
 * @param {string} sourceType
 * @param {string} targetType
 * @returns {{ semantic: string, meaning: string } | null}
 */
export function getConnectionSemantic(sourceType, targetType) {
  if (!validConnections[sourceType]) return null;
  return validConnections[sourceType][targetType] || null;
}

/**
 * Get a user-friendly error message for an invalid connection.
 * @param {string} sourceType
 * @param {string} targetType
 * @returns {string}
 */
export function getConnectionError(sourceType, targetType) {
  const errors = {
    "realtime->auth": "Realtime consumes events, it doesn't produce auth",
    "realtime->database": "Realtime reads from Database, it doesn't write to it",
    "messaging->database": "Messaging is an output — it doesn't feed data back",
    "storage->auth": "Storage doesn't manage authentication",
    "storage->realtime": "No direct link — use Database events instead",
  };

  const key = `${sourceType}->${targetType}`;
  return errors[key] || `${sourceType} cannot connect to ${targetType}`;
}
