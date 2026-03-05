/**
 * Generate HTTP client wrappers for external APIs.
 * @param {import('../../ir/schema').ExternalApiIR[]} apis
 * @returns {{ path: string, content: string, language: string }[]}
 */
export function generateExternalApiFiles(apis) {
  if (!apis || apis.length === 0) return [];

  return apis.map((api) => ({
    path: `src/lib/${api.id}.client.ts`,
    content: generateApiClient(api),
    language: "typescript",
  }));
}

function generateApiClient(api) {
  const headersObj = (api.headers || [])
    .map((h) => `    "${h.key}": "${h.value}",`)
    .join("\n");

  let authHeader = "";
  switch (api.authMethod) {
    case "api_key":
      authHeader = `    "X-API-Key": process.env.${envKey(api.name)}_API_KEY || "",`;
      break;
    case "bearer":
      authHeader = `    "Authorization": \`Bearer \${process.env.${envKey(api.name)}_TOKEN || ""}\`,`;
      break;
    case "oauth":
      authHeader = `    // OAuth token should be set dynamically
    // "Authorization": \`Bearer \${accessToken}\`,`;
      break;
    default:
      authHeader = "";
  }

  return `/**
 * HTTP client for ${api.name}
 * Base URL: ${api.baseUrl}
 * Auth: ${api.authMethod}
 */

const BASE_URL = process.env.${envKey(api.name)}_BASE_URL || "${api.baseUrl}";

const defaultHeaders: Record<string, string> = {
  "Content-Type": "application/json",
${authHeader}
${headersObj}
};

export async function ${camelCase(api.name)}Get<T = any>(path: string): Promise<T> {
  const response = await fetch(\`\${BASE_URL}\${path}\`, {
    method: "GET",
    headers: defaultHeaders,
  });
  if (!response.ok) throw new Error(\`${api.name} GET \${path}: \${response.status}\`);
  return response.json();
}

export async function ${camelCase(api.name)}Post<T = any>(path: string, body: unknown): Promise<T> {
  const response = await fetch(\`\${BASE_URL}\${path}\`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(\`${api.name} POST \${path}: \${response.status}\`);
  return response.json();
}

export async function ${camelCase(api.name)}Put<T = any>(path: string, body: unknown): Promise<T> {
  const response = await fetch(\`\${BASE_URL}\${path}\`, {
    method: "PUT",
    headers: defaultHeaders,
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(\`${api.name} PUT \${path}: \${response.status}\`);
  return response.json();
}

export async function ${camelCase(api.name)}Delete(path: string): Promise<void> {
  const response = await fetch(\`\${BASE_URL}\${path}\`, {
    method: "DELETE",
    headers: defaultHeaders,
  });
  if (!response.ok) throw new Error(\`${api.name} DELETE \${path}: \${response.status}\`);
}
`;
}

function envKey(name) {
  return name.toUpperCase().replace(/[^A-Z0-9]+/g, "_");
}

function camelCase(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+(.)/g, (_, c) => c.toUpperCase());
}
