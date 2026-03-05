/**
 * Generates a CRUD hook for each collection.
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function camelCase(str) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

export function generateCrudHooks(databaseIR) {
  if (!databaseIR || databaseIR.collections.length === 0) return [];

  return databaseIR.collections.map((col) => {
    const name = capitalize(camelCase(col.name));
    const typeName = name;

    return {
      path: `src/hooks/use${name}.ts`,
      content: `import { useState, useEffect, useCallback } from "react";
import { databases, DATABASE_ID } from "../lib/appwrite";
import { ID, Query, type Models } from "appwrite";
import type { ${typeName} } from "../types/${col.id}";

const COLLECTION_ID = "${col.id}";

export function use${name}() {
  const [documents, setDocuments] = useState<${typeName}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const list = useCallback(async (queries: string[] = []) => {
    setLoading(true);
    setError(null);
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        queries
      );
      setDocuments(response.documents as unknown as ${typeName}[]);
      return response.documents;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback(async (documentId: string) => {
    const doc = await databases.getDocument(DATABASE_ID, COLLECTION_ID, documentId);
    return doc as unknown as ${typeName};
  }, []);

  const create = useCallback(async (data: Omit<${typeName}, "$id" | "$createdAt" | "$updatedAt">) => {
    const doc = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      data
    );
    setDocuments((prev) => [...prev, doc as unknown as ${typeName}]);
    return doc;
  }, []);

  const update = useCallback(async (documentId: string, data: Partial<${typeName}>) => {
    const doc = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      documentId,
      data
    );
    setDocuments((prev) =>
      prev.map((d) => (d.$id === documentId ? (doc as unknown as ${typeName}) : d))
    );
    return doc;
  }, []);

  const remove = useCallback(async (documentId: string) => {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, documentId);
    setDocuments((prev) => prev.filter((d) => d.$id !== documentId));
  }, []);

  useEffect(() => {
    list();
  }, [list]);

  return { documents, loading, error, list, get, create, update, remove };
}
`,
      language: "typescript",
    };
  });
}
