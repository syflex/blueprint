import { createContext, useContext } from "react";
import { useAuth as useAuthHook } from "../hooks/useAuth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const auth = useAuthHook();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
