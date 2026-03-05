import { fieldTypeToTS } from "../../registry/fieldTypes";

/**
 * Maps Blueprint field types to Appwrite SDK attribute creation methods.
 */
const fieldTypeToMethod = {
  string: "createStringAttribute",
  integer: "createIntegerAttribute",
  float: "createFloatAttribute",
  boolean: "createBooleanAttribute",
  datetime: "createDatetimeAttribute",
  email: "createEmailAttribute",
  url: "createUrlAttribute",
  enum: "createEnumAttribute",
  ip: "createIpAttribute",
};

/**
 * Generates collection setup script.
 */
export function generateCollectionSetup(databaseIR) {
  if (!databaseIR || databaseIR.collections.length === 0) return [];

  const collections = databaseIR.collections;

  let script = `import { Client, Databases, ID } from "node-appwrite";

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);
const DATABASE_ID = "main";

async function setup() {
  // Create database
  try {
    await databases.create({ databaseId: DATABASE_ID, name: "Main Database" });
    console.log("Created database: Main Database");
  } catch (e: any) {
    if (e.code === 409) console.log("Database already exists");
    else throw e;
  }

`;

  for (const col of collections) {
    script += `  // Collection: ${col.name}\n`;
    script += `  try {\n`;
    script += `    await databases.createCollection({\n`;
    script += `      databaseId: DATABASE_ID,\n`;
    script += `      collectionId: "${col.id}",\n`;
    script += `      name: "${col.name}",\n`;
    script += `    });\n`;
    script += `    console.log("Created collection: ${col.name}");\n`;
    script += `  } catch (e: any) {\n`;
    script += `    if (e.code === 409) console.log("Collection ${col.name} already exists");\n`;
    script += `    else throw e;\n`;
    script += `  }\n\n`;

    for (const field of col.fields) {
      const method = fieldTypeToMethod[field.type] || "createStringAttribute";
      script += `  await databases.${method}({\n`;
      script += `    databaseId: DATABASE_ID,\n`;
      script += `    collectionId: "${col.id}",\n`;
      script += `    key: "${field.name}",\n`;
      script += `    required: ${field.required},\n`;
      if (field.type === "string") {
        script += `    size: 255,\n`;
      }
      script += `  });\n`;
      script += `  console.log("  Added field: ${field.name} (${field.type})");\n\n`;
    }
  }

  script += `  console.log("Setup complete!");\n}\n\nsetup().catch(console.error);\n`;

  return [
    {
      path: "scripts/setup-collections.ts",
      content: script,
      language: "typescript",
    },
  ];
}
