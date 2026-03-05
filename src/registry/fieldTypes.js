/**
 * Available field types for database collections.
 * Used by the DatabaseConfig panel and type generators.
 */
export const fieldTypes = [
  { value: "string", label: "String" },
  { value: "integer", label: "Integer" },
  { value: "float", label: "Float" },
  { value: "boolean", label: "Boolean" },
  { value: "datetime", label: "DateTime" },
  { value: "email", label: "Email" },
  { value: "url", label: "URL" },
  { value: "enum", label: "Enum" },
  { value: "ip", label: "IP Address" },
  { value: "relationship", label: "Relationship" },
];

/**
 * Map field type to TypeScript type for the type generator.
 */
export const fieldTypeToTS = {
  string: "string",
  integer: "number",
  float: "number",
  boolean: "boolean",
  datetime: "string",
  email: "string",
  url: "string",
  enum: "string",
  ip: "string",
  relationship: "string",
};
