/**
 * Central registry defining all component types.
 * The canvas, sidebar, config panels, IR compiler, and generators all read from this.
 * Adding a new service = adding one entry here.
 *
 * Categories:
 *   - Appwrite core: auth, database, storage, functions, realtime, messaging
 *   - Appwrite extended: teams, oauth, webhooks
 *   - Third-party: clientApp, externalApi, paymentGateway
 */
export const componentRegistry = {
  // ── Appwrite Core ──────────────────────────────────────────
  auth: {
    type: "auth",
    label: "Auth",
    icon: "icon-lock-closed",
    color: "#F02E65",
    category: "appwrite",
    description: "Authentication & user management",
    defaultConfig: {
      providers: ["email"],
      guestAccess: false,
      sessionDuration: 365,
      passwordPolicy: { minLength: 8, uppercase: false, numbers: false, specialChars: false },
    },
    portsIn: ["oauth", "clientApp"],
    portsOut: ["database", "storage", "functions", "teams"],
    maxInstances: 1,
  },
  database: {
    type: "database",
    label: "Database",
    icon: "icon-database",
    color: "#6C5CE7",
    category: "appwrite",
    description: "Collections & documents",
    defaultConfig: {
      collections: [],
    },
    portsIn: ["auth", "functions", "teams", "clientApp"],
    portsOut: ["realtime", "functions", "storage", "webhooks"],
    maxInstances: null,
  },
  storage: {
    type: "storage",
    label: "Storage",
    icon: "icon-folder",
    color: "#00B894",
    category: "appwrite",
    description: "File storage & buckets",
    defaultConfig: {
      buckets: [],
    },
    portsIn: ["auth", "database", "functions", "teams", "clientApp"],
    portsOut: ["functions", "webhooks"],
    maxInstances: null,
  },
  functions: {
    type: "functions",
    label: "Functions",
    icon: "icon-lightning-bolt",
    color: "#FDCB6E",
    category: "appwrite",
    description: "Serverless functions",
    defaultConfig: {
      functions: [],
      timeout: 15,
      memory: 128,
    },
    portsIn: ["auth", "database", "storage", "messaging", "externalApi", "paymentGateway", "clientApp"],
    portsOut: ["messaging", "database", "storage", "externalApi", "paymentGateway", "webhooks"],
    maxInstances: null,
  },
  realtime: {
    type: "realtime",
    label: "Realtime",
    icon: "icon-refresh",
    color: "#0984E3",
    category: "appwrite",
    description: "Real-time subscriptions",
    defaultConfig: {
      autoSubscribe: true,
    },
    portsIn: ["database", "clientApp"],
    portsOut: [],
    maxInstances: 1,
  },
  messaging: {
    type: "messaging",
    label: "Messaging",
    icon: "icon-send",
    color: "#E17055",
    category: "appwrite",
    description: "Push notifications & messaging",
    defaultConfig: {
      channels: [],
    },
    portsIn: ["functions"],
    portsOut: [],
    maxInstances: 1,
  },

  // ── Appwrite Extended ──────────────────────────────────────
  teams: {
    type: "teams",
    label: "Teams",
    icon: "icon-user-group",
    color: "#8B5CF6",
    category: "appwrite",
    description: "Team-based access control",
    defaultConfig: {
      teams: [{ name: "", roles: ["owner", "admin", "member"] }],
    },
    portsIn: ["auth"],
    portsOut: ["database", "storage", "functions"],
    maxInstances: 1,
  },
  oauth: {
    type: "oauth",
    label: "OAuth",
    icon: "icon-globe",
    color: "#3B82F6",
    category: "appwrite",
    description: "Social login providers",
    defaultConfig: {
      providers: [],
      redirectUrl: "http://localhost:3000/auth/callback",
    },
    portsIn: [],
    portsOut: ["auth"],
    maxInstances: 1,
  },
  webhooks: {
    type: "webhooks",
    label: "Webhooks",
    icon: "icon-arrow-right",
    color: "#EF4444",
    category: "appwrite",
    description: "Event-driven HTTP callbacks",
    defaultConfig: {
      webhooks: [],
    },
    portsIn: ["database", "storage", "auth", "functions"],
    portsOut: [],
    maxInstances: 1,
  },

  // ── Third-Party ────────────────────────────────────────────
  clientApp: {
    type: "clientApp",
    label: "Client App",
    icon: "icon-device-mobile",
    color: "#14B8A6",
    category: "thirdParty",
    description: "Frontend application",
    defaultConfig: {
      framework: "react",
      name: "web-app",
    },
    portsIn: ["auth", "database", "storage", "realtime"],
    portsOut: ["auth", "functions"],
    maxInstances: null,
  },
  externalApi: {
    type: "externalApi",
    label: "External API",
    icon: "icon-cloud",
    color: "#F59E0B",
    category: "thirdParty",
    description: "Third-party REST API",
    defaultConfig: {
      apis: [{ name: "", baseUrl: "", authMethod: "api_key", headers: [] }],
    },
    portsIn: ["functions"],
    portsOut: ["functions"],
    maxInstances: null,
  },
  paymentGateway: {
    type: "paymentGateway",
    label: "Payments",
    icon: "icon-credit-card",
    color: "#10B981",
    category: "thirdParty",
    description: "Payment processing",
    defaultConfig: {
      provider: "stripe",
      webhookEvents: ["checkout.session.completed", "payment_intent.succeeded"],
      currency: "usd",
    },
    portsIn: ["functions"],
    portsOut: ["functions", "database"],
    maxInstances: 1,
  },
};

export const componentTypes = Object.keys(componentRegistry);
