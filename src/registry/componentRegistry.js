/**
 * Central registry defining all Appwrite component types.
 * The canvas, sidebar, config panels, IR compiler, and generators all read from this.
 * Adding a new Appwrite service = adding one entry here.
 */
export const componentRegistry = {
  auth: {
    type: "auth",
    label: "Auth",
    icon: "icon-lock-closed",
    color: "#F02E65",
    description: "Authentication & user management",
    defaultConfig: {
      providers: ["email"],
      guestAccess: false,
    },
    portsIn: [],
    portsOut: ["database", "storage", "functions"],
    maxInstances: 1,
  },
  database: {
    type: "database",
    label: "Database",
    icon: "icon-database",
    color: "#6C5CE7",
    description: "Collections & documents",
    defaultConfig: {
      collections: [],
    },
    portsIn: ["auth"],
    portsOut: ["realtime", "functions"],
    maxInstances: null,
  },
  storage: {
    type: "storage",
    label: "Storage",
    icon: "icon-folder",
    color: "#00B894",
    description: "File storage & buckets",
    defaultConfig: {
      buckets: [],
    },
    portsIn: ["auth"],
    portsOut: ["functions"],
    maxInstances: null,
  },
  functions: {
    type: "functions",
    label: "Functions",
    icon: "icon-lightning-bolt",
    color: "#FDCB6E",
    description: "Serverless functions",
    defaultConfig: {
      functions: [],
    },
    portsIn: ["auth", "database", "storage", "messaging"],
    portsOut: ["messaging"],
    maxInstances: null,
  },
  realtime: {
    type: "realtime",
    label: "Realtime",
    icon: "icon-refresh",
    color: "#0984E3",
    description: "Real-time subscriptions",
    defaultConfig: {
      autoSubscribe: true,
    },
    portsIn: ["database"],
    portsOut: [],
    maxInstances: 1,
  },
  messaging: {
    type: "messaging",
    label: "Messaging",
    icon: "icon-send",
    color: "#E17055",
    description: "Push notifications & messaging",
    defaultConfig: {
      channels: [],
    },
    portsIn: ["functions"],
    portsOut: [],
    maxInstances: 1,
  },
};

export const componentTypes = Object.keys(componentRegistry);
