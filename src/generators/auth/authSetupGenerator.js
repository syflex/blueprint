/**
 * Generates auth-related setup and utilities.
 */
export function generateAuthFiles(authIR) {
  if (!authIR) return [];

  const files = [];

  // useAuth hook
  files.push({
    path: "src/hooks/useAuth.ts",
    content: `import { useState, useEffect } from "react";
import { account } from "../lib/appwrite";
import { ID, type Models } from "appwrite";

export function useAuth() {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    account.get()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    await account.createEmailPasswordSession({ email, password });
    const me = await account.get();
    setUser(me);
    return me;
  }

  async function signup(email: string, password: string, name: string) {
    await account.create({ userId: ID.unique(), email, password, name });
    await account.createEmailPasswordSession({ email, password });
    const me = await account.get();
    setUser(me);
    return me;
  }

  async function logout() {
    await account.deleteSession({ sessionId: "current" });
    setUser(null);
  }

  return { user, loading, login, signup, logout };
}
`,
    language: "typescript",
  });

  // AuthProvider context
  files.push({
    path: "src/contexts/AuthContext.tsx",
    content: `import { createContext, useContext, type ReactNode } from "react";
import { useAuth as useAuthHook } from "../hooks/useAuth";

type AuthContextType = ReturnType<typeof useAuthHook>;

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthHook();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
`,
    language: "typescript",
  });

  return files;
}
