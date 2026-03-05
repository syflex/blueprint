/**
 * System Graph Intermediate Representation (IR) Schema
 *
 * This is the normalized data structure that sits between the canvas (visual)
 * and the generators (code output). The compiler transforms React Flow
 * nodes + edges into this format.
 *
 * @typedef {Object} SystemGraph
 * @property {string} version - IR schema version
 * @property {AuthIR|null} auth
 * @property {DatabaseIR|null} database
 * @property {StorageIR|null} storage
 * @property {FunctionIR[]} functions
 * @property {RealtimeIR|null} realtime
 * @property {MessagingIR|null} messaging
 * @property {ConnectionIR[]} connections
 *
 * @typedef {Object} AuthIR
 * @property {string[]} providers
 * @property {boolean} guestAccess
 * @property {number} [sessionDuration] - days
 * @property {{ minLength: number, uppercase: boolean, numbers: boolean, specialChars: boolean }} [passwordPolicy]
 *
 * @typedef {Object} DatabaseIR
 * @property {CollectionIR[]} collections
 *
 * @typedef {Object} CollectionIR
 * @property {string} name
 * @property {string} id - slugified from name
 * @property {FieldIR[]} fields
 * @property {IndexIR[]} [indexes]
 * @property {string} [permissionPreset] - "any" | "users" | "owner"
 *
 * @typedef {Object} FieldIR
 * @property {string} name
 * @property {string} type - one of fieldTypes values
 * @property {boolean} required
 * @property {string} [relatedCollection] - target collection ID for relationship fields
 * @property {string} [relationType] - "oneToOne" | "oneToMany" | "manyToOne" | "manyToMany"
 *
 * @typedef {Object} IndexIR
 * @property {string} type - "key" | "unique" | "fulltext"
 * @property {string[]} attributes
 *
 * @typedef {Object} StorageIR
 * @property {BucketIR[]} buckets
 *
 * @typedef {Object} BucketIR
 * @property {string} name
 * @property {string} id - slugified from name
 * @property {string[]} allowedTypes
 * @property {number|null} maxSize
 * @property {string} [permissionPreset] - "public_read" | "auth_read" | "admin_only"
 *
 * @typedef {Object} FunctionIR
 * @property {string} name
 * @property {string} id - slugified from name
 * @property {string} trigger - "http" | "schedule" | "event"
 * @property {string} runtime
 * @property {string} [schedule] - CRON string if trigger is "schedule"
 * @property {{ key: string, value: string }[]} [envVars]
 * @property {number} [timeout] - seconds (1-900)
 * @property {number} [memory] - MB (128/256/512/1024)
 * @property {string[]} [connectedCollections] - derived from function→database connections
 * @property {string[]} [connectedBuckets] - derived from function→storage connections
 *
 * @typedef {Object} RealtimeIR
 * @property {boolean} autoSubscribe
 * @property {string[]} subscribedCollections - derived from connections
 *
 * @typedef {Object} MessagingIR
 * @property {string[]} channels
 *
 * @typedef {Object} ConnectionIR
 * @property {string} sourceId - node ID
 * @property {string} sourceType - component type
 * @property {string} targetId - node ID
 * @property {string} targetType - component type
 * @property {string} semantic - connection semantic label
 * @property {string} meaning - human-readable meaning
 */

export const IR_VERSION = "1.0.0";
