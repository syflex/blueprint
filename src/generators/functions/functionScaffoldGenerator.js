/**
 * Generates function scaffold files for each defined function.
 */
export function generateFunctionScaffolds(functionsIR) {
  if (!functionsIR || functionsIR.length === 0) return [];

  const files = [];

  for (const fn of functionsIR) {
    // Main entry point
    files.push({
      path: `functions/${fn.id}/src/main.ts`,
      content: `import { Client } from "node-appwrite";

// ${fn.name} — ${fn.trigger} trigger
// Runtime: ${fn.runtime}

export default async function handler({ req, res, log, error }: any) {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT ?? "")
    .setProject(process.env.APPWRITE_PROJECT_ID ?? "")
    .setKey(process.env.APPWRITE_API_KEY ?? "");

  try {
    ${fn.trigger === "http" ? `// Handle HTTP request
    if (req.method === "GET") {
      return res.json({ message: "Hello from ${fn.name}!" });
    }

    const body = JSON.parse(req.body || "{}");
    log("Received:", body);

    // Your logic here

    return res.json({ success: true });` : fn.trigger === "schedule" ? `// Scheduled function${fn.schedule ? ` — runs on: ${fn.schedule}` : ""}
    log("Running scheduled task: ${fn.name}");

    // Your scheduled logic here

    return res.json({ success: true });` : `// Event-triggered function
    log("Event triggered: ${fn.name}");
    log("Event data:", req.body);

    // Your event handling logic here

    return res.json({ success: true });`}
  } catch (err: any) {
    error("Function error:", err.message);
    return res.json({ error: err.message }, 500);
  }
}
`,
      language: "typescript",
    });

    // package.json for the function
    files.push({
      path: `functions/${fn.id}/package.json`,
      content: JSON.stringify(
        {
          name: fn.id,
          version: "1.0.0",
          type: "module",
          dependencies: {
            "node-appwrite": "^14.0.0",
          },
        },
        null,
        2
      ) + "\n",
      language: "json",
    });
  }

  return files;
}
