/**
 * Generates storage-related hooks and setup.
 */
export function generateStorageFiles(storageIR) {
  if (!storageIR || storageIR.buckets.length === 0) return [];

  const files = [];

  // useStorage hook
  files.push({
    path: "src/hooks/useStorage.ts",
    content: `import { useState, useCallback } from "react";
import { storage } from "../lib/appwrite";
import { ID } from "appwrite";

export function useStorage(bucketId: string) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const result = await storage.createFile(bucketId, ID.unique(), file);
      return result;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setUploading(false);
    }
  }, [bucketId]);

  const getFileUrl = useCallback((fileId: string) => {
    return storage.getFileView(bucketId, fileId);
  }, [bucketId]);

  const getFileDownload = useCallback((fileId: string) => {
    return storage.getFileDownload(bucketId, fileId);
  }, [bucketId]);

  const deleteFile = useCallback(async (fileId: string) => {
    await storage.deleteFile(bucketId, fileId);
  }, [bucketId]);

  const listFiles = useCallback(async () => {
    const result = await storage.listFiles(bucketId);
    return result.files;
  }, [bucketId]);

  return { upload, getFileUrl, getFileDownload, deleteFile, listFiles, uploading, error };
}
`,
    language: "typescript",
  });

  // Bucket setup script
  let setupScript = `import { Client, Storage } from "node-appwrite";

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const storage = new Storage(client);

async function setup() {
`;

  for (const bucket of storageIR.buckets) {
    setupScript += `  try {\n`;
    setupScript += `    await storage.createBucket({\n`;
    setupScript += `      bucketId: "${bucket.id}",\n`;
    setupScript += `      name: "${bucket.name}",\n`;
    if (bucket.allowedTypes.length > 0) {
      setupScript += `      allowedFileExtensions: ${JSON.stringify(bucket.allowedTypes)},\n`;
    }
    if (bucket.maxSize) {
      setupScript += `      maximumFileSize: ${bucket.maxSize},\n`;
    }
    setupScript += `    });\n`;
    setupScript += `    console.log("Created bucket: ${bucket.name}");\n`;
    setupScript += `  } catch (e: any) {\n`;
    setupScript += `    if (e.code === 409) console.log("Bucket ${bucket.name} already exists");\n`;
    setupScript += `    else throw e;\n`;
    setupScript += `  }\n\n`;
  }

  setupScript += `  console.log("Storage setup complete!");\n}\n\nsetup().catch(console.error);\n`;

  files.push({
    path: "scripts/setup-storage.ts",
    content: setupScript,
    language: "typescript",
  });

  return files;
}
