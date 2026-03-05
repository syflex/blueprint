/**
 * Generate OAuth helper utilities.
 * @param {import('../../ir/schema').OAuthIR} oauthIR
 * @returns {{ path: string, content: string, language: string }[]}
 */
export function generateOAuthFiles(oauthIR) {
  if (!oauthIR || oauthIR.providers.length === 0) return [];

  const providerMap = oauthIR.providers
    .map((p) => `  "${p}": OAuthProvider.${capitalize(p)},`)
    .join("\n");

  const providerButtons = oauthIR.providers
    .map(
      (p) => `  // ${capitalize(p)} login
  export async function loginWith${capitalize(p)}() {
    account.createOAuth2Session(
      OAuthProvider.${capitalize(p)},
      "${oauthIR.redirectUrl}",
      "${oauthIR.redirectUrl}?error=true"
    );
  }`
    )
    .join("\n\n");

  return [
    {
      path: "src/lib/oauth.ts",
      content: `import { account } from "./appwrite";
import { OAuthProvider } from "appwrite";

/**
 * Available OAuth providers for this project.
 */
export const enabledProviders = [
${oauthIR.providers.map((p) => `  "${p}",`).join("\n")}
];

${providerButtons}

/**
 * Generic OAuth login by provider name.
 */
export function loginWithProvider(provider: string) {
  account.createOAuth2Session(
    provider as OAuthProvider,
    "${oauthIR.redirectUrl}",
    "${oauthIR.redirectUrl}?error=true"
  );
}
`,
      language: "typescript",
    },
  ];
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
