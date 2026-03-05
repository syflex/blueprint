/**
 * Generate webhook setup script.
 * @param {import('../../ir/schema').WebhooksIR} webhooksIR
 * @returns {{ path: string, content: string, language: string }[]}
 */
export function generateWebhooksFiles(webhooksIR) {
  if (!webhooksIR || webhooksIR.webhooks.length === 0) return [];

  const setupBlocks = webhooksIR.webhooks.map((wh) => {
    const eventsArray = wh.events.map((e) => `      "${e}"`).join(",\n");
    return `  // Webhook: ${wh.name}
  try {
    await fetch(\`\${endpoint}/projects/\${projectId}/webhooks\`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Key": apiKey,
      },
      body: JSON.stringify({
        name: "${wh.name}",
        url: "${wh.url}",
        events: [
${eventsArray}
        ],
        security: ${wh.signatureSecret ? "true" : "false"},
        enabled: true,
      }),
    });
    console.log("Created webhook: ${wh.name}");
  } catch (e) {
    console.error("Failed to create webhook ${wh.name}:", e);
  }`;
  });

  return [
    {
      path: "scripts/setup-webhooks.ts",
      content: `/**
 * Register webhooks via Appwrite REST API.
 * Run with: npx tsx scripts/setup-webhooks.ts
 */

const endpoint = process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const projectId = process.env.APPWRITE_PROJECT_ID || "";
const apiKey = process.env.APPWRITE_API_KEY || "";

async function setupWebhooks() {
${setupBlocks.join("\n\n")}
}

setupWebhooks().then(() => console.log("Webhook setup complete"));
`,
      language: "typescript",
    },
  ];
}
