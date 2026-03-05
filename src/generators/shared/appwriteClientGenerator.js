/**
 * Generates the base Appwrite client setup file.
 */
export function generateAppwriteClient(ir) {
  const imports = ["Client", "Account"];
  if (ir.database) imports.push("Databases");
  if (ir.storage) imports.push("Storage");
  if (ir.functions.length > 0) imports.push("Functions");

  return [
    {
      path: "src/lib/appwrite.ts",
      content: `import { ${imports.join(", ")} } from "appwrite";

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
${ir.database ? 'export const databases = new Databases(client);\nexport const DATABASE_ID = "main";' : ""}
${ir.storage ? "export const storage = new Storage(client);" : ""}
${ir.functions.length > 0 ? "export const functions = new Functions(client);" : ""}

export { client };
`,
      language: "typescript",
    },
  ];
}
