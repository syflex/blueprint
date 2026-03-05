import { fieldTypeToTS } from "../../registry/fieldTypes";

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function camelCase(str) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

/**
 * Generates TypeScript interfaces for each collection.
 */
export function generateTypes(databaseIR) {
  if (!databaseIR || databaseIR.collections.length === 0) return [];

  return databaseIR.collections.map((col) => {
    const name = capitalize(camelCase(col.name));
    const fields = col.fields
      .map((f) => {
        const tsType = fieldTypeToTS[f.type] || "string";
        const optional = f.required ? "" : "?";
        return `  ${f.name}${optional}: ${tsType};`;
      })
      .join("\n");

    return {
      path: `src/types/${col.id}.ts`,
      content: `export interface ${name} {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
${fields}
}
`,
      language: "typescript",
    };
  });
}
