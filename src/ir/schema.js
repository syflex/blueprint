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
 *
 * @typedef {Object} DatabaseIR
 * @property {CollectionIR[]} collections
 *
 * @typedef {Object} CollectionIR
 * @property {string} name
 * @property {string} id - slugified from name
 * @property {FieldIR[]} fields
 *
 * @typedef {Object} FieldIR
 * @property {string} name
 * @property {string} type - one of fieldTypes values
 * @property {boolean} required
 *
 * @typedef {Object} StorageIR
 * @property {BucketIR[]} buckets
 *
 * @typedef {Object} BucketIR
 * @property {string} name
 * @property {string} id - slugified from name
 * @property {string[]} allowedTypes
 * @property {number|null} maxSize
 *
 * @typedef {Object} FunctionIR
 * @property {string} name
 * @property {string} id - slugified from name
 * @property {string} trigger - "http" | "schedule" | "event"
 * @property {string} runtime
 * @property {string} [schedule] - CRON string if trigger is "schedule"
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
