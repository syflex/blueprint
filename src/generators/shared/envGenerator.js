/**
 * Generates .env.example file.
 */
export function generateEnv() {
  return [
    {
      path: ".env.example",
      content: `VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
`,
      language: "env",
    },
  ];
}
