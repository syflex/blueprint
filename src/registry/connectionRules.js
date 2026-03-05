/**
 * Connection validation rules based on how Appwrite services actually interact.
 * Each entry maps a source type to its valid target types with semantic meaning.
 */
export const validConnections = {
  auth: {
    database: { semantic: "auth_permissions", meaning: "Apply auth-based permissions to collections" },
    storage: { semantic: "auth_permissions", meaning: "Apply auth-based permissions to buckets" },
    functions: { semantic: "auth_context", meaning: "Pass user context to function execution" },
  },
  database: {
    realtime: { semantic: "collection_subscriptions", meaning: "Subscribe to document changes in real time" },
    functions: { semantic: "event_trigger", meaning: "Trigger function on document create/update/delete" },
  },
  storage: {
    functions: { semantic: "event_trigger", meaning: "Trigger function on file upload/delete" },
  },
  functions: {
    messaging: { semantic: "send_notification", meaning: "Function sends email/push/SMS via Messaging" },
  },
  realtime: {},
  messaging: {},
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
    "storage->database": "No direct link — use Functions as a bridge",
    "storage->realtime": "No direct link — use Database events instead",
  };

  const key = `${sourceType}->${targetType}`;
  return errors[key] || `${sourceType} cannot connect to ${targetType}`;
}
