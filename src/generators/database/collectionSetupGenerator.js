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

  let script = `import { Client, Databases, ID, Permission, Role } from "node-appwrite";

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
    // Build permissions based on preset
    const permPreset = col.permissionPreset || "users";
    let permissionsCode;
    if (permPreset === "any") {
      permissionsCode = `[Permission.read(Role.any()), Permission.write(Role.any())]`;
    } else if (permPreset === "owner") {
      permissionsCode = `[Permission.read(Role.users()), Permission.create(Role.users()), Permission.update(Role.user("OWNER")), Permission.delete(Role.user("OWNER"))]`;
    } else {
      permissionsCode = `[Permission.read(Role.users()), Permission.write(Role.users())]`;
    }

    script += `    await databases.createCollection({\n`;
    script += `      databaseId: DATABASE_ID,\n`;
    script += `      collectionId: "${col.id}",\n`;
    script += `      name: "${col.name}",\n`;
    script += `      permissions: ${permissionsCode},\n`;
    if (permPreset === "owner") {
      script += `      documentSecurity: true,\n`;
    }
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

    // Generate indexes
    if (col.indexes && col.indexes.length > 0) {
      for (let idx = 0; idx < col.indexes.length; idx++) {
        const index = col.indexes[idx];
        if (index.attributes.length > 0) {
          script += `  await databases.createIndex({\n`;
          script += `    databaseId: DATABASE_ID,\n`;
          script += `    collectionId: "${col.id}",\n`;
          script += `    key: "idx_${col.id}_${idx}",\n`;
          script += `    type: "${index.type}",\n`;
          script += `    attributes: ${JSON.stringify(index.attributes)},\n`;
          script += `  });\n`;
          script += `  console.log("  Created ${index.type} index on: ${index.attributes.join(", ")}");\n\n`;
        }
      }
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
