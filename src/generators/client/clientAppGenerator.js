/**
 * Generate client app setup files.
 * @param {import('../../ir/schema').ClientAppIR[]} clientApps
 * @returns {{ path: string, content: string, language: string }[]}
 */
export function generateClientAppFiles(clientApps) {
  if (!clientApps || clientApps.length === 0) return [];

  const files = [];

  for (const app of clientApps) {
    const fw = app.framework;
    const prefix = clientApps.length > 1 ? `${app.id}/` : "";

    if (fw === "react" || fw === "nextjs" || fw === "vue") {
      files.push({
        path: `${prefix}src/lib/client-setup.ts`,
        content: generateWebClientSetup(app),
        language: "typescript",
      });
    } else if (fw === "flutter") {
      files.push({
        path: `${prefix}lib/appwrite_client.dart`,
        content: generateFlutterClientSetup(app),
        language: "typescript", // closest available
      });
    } else if (fw === "reactNative") {
      files.push({
        path: `${prefix}src/lib/client-setup.ts`,
        content: generateReactNativeClientSetup(app),
        language: "typescript",
      });
    }
  }

  return files;
}

function generateWebClientSetup(app) {
  const isNextjs = app.framework === "nextjs";
  return `import { Client, Account, Databases, Storage } from "appwrite";

/**
 * Appwrite client setup for ${app.name} (${app.framework})
 */
const client = new Client()
  .setEndpoint(${isNextjs ? "process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!" : 'import.meta.env.VITE_APPWRITE_ENDPOINT'})
  .setProject(${isNextjs ? "process.env.NEXT_PUBLIC_APPWRITE_PROJECT!" : 'import.meta.env.VITE_APPWRITE_PROJECT'});

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export { client };
`;
}

function generateFlutterClientSetup(app) {
  return `import 'package:appwrite/appwrite.dart';

/// Appwrite client setup for ${app.name} (Flutter)
class AppwriteService {
  static final Client client = Client()
    .setEndpoint(const String.fromEnvironment('APPWRITE_ENDPOINT'))
    .setProject(const String.fromEnvironment('APPWRITE_PROJECT'));

  static final Account account = Account(client);
  static final Databases databases = Databases(client);
  static final Storage storage = Storage(client);
}
`;
}

function generateReactNativeClientSetup(app) {
  return `import { Client, Account, Databases, Storage } from "react-native-appwrite";

/**
 * Appwrite client setup for ${app.name} (React Native)
 */
const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || "")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT || "")
  .setPlatform("com.example.${app.id}");

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export { client };
`;
}
