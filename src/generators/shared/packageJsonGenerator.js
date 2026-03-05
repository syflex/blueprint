/**
 * Generates package.json with required dependencies.
 */
export function generatePackageJson(ir) {
  const deps = {
    appwrite: "^16.0.0",
    react: "^19.0.0",
    "react-dom": "^19.0.0",
  };

  // Add zod for validation schemas when database has collections
  if (ir.database && ir.database.collections.length > 0) {
    deps.zod = "^3.23.0";
  }

  const pkg = {
    name: "blueprint-project",
    private: true,
    version: "0.0.1",
    type: "module",
    scripts: {
      dev: "vite",
      build: "tsc && vite build",
      preview: "vite preview",
    },
    dependencies: deps,
    devDependencies: {
      "@types/react": "^19.0.0",
      "@types/react-dom": "^19.0.0",
      "@vitejs/plugin-react": "^4.0.0",
      typescript: "^5.6.0",
      vite: "^6.0.0",
    },
  };

  return [
    {
      path: "package.json",
      content: JSON.stringify(pkg, null, 2) + "\n",
      language: "json",
    },
  ];
}
