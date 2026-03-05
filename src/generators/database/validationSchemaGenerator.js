/**
 * Generates Zod validation schemas for each collection.
 */
const fieldTypeToZod = {
  string: "z.string()",
  integer: "z.number().int()",
  float: "z.number()",
  boolean: "z.boolean()",
  datetime: "z.string().datetime()",
  email: "z.string().email()",
  url: "z.string().url()",
  enum: "z.string()",
  ip: "z.string().ip()",
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function camelCase(str) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

export function generateValidationSchemas(databaseIR) {
  if (!databaseIR || databaseIR.collections.length === 0) return [];

  return databaseIR.collections.map((col) => {
    const name = capitalize(camelCase(col.name));

    const fields = col.fields
      .map((f) => {
        let zodType = fieldTypeToZod[f.type] || "z.string()";
        if (!f.required) {
          zodType += ".optional()";
        }
        return `  ${f.name}: ${zodType},`;
      })
      .join("\n");

    return {
      path: `src/schemas/${col.id}.ts`,
      content: `import { z } from "zod";

export const ${name}Schema = z.object({
${fields}
});

export const Create${name}Schema = ${name}Schema;
export const Update${name}Schema = ${name}Schema.partial();

export type ${name}Input = z.infer<typeof ${name}Schema>;
`,
      language: "typescript",
    };
  });
}
