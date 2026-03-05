import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { login, signup, loading, error, clearError } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    const success =
      mode === "login"
        ? await login(email, password)
        : await signup(email, password, name);
    if (success) navigate("/dashboard");
  }

  function switchMode() {
    setMode(mode === "login" ? "signup" : "login");
    clearError();
  }

  return (
    <main className="flex min-h-full items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <Link to="/" className="no-underline">
            <img src="/appwrite.svg" alt="Blueprint" className="mx-auto mb-3 h-8 w-8" />
          </Link>
          <h1 className="font-[Poppins] text-2xl font-light text-[#2D2D31]">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p className="mt-1 text-sm text-[#97979B]">
            {mode === "login"
              ? "Sign in to access your projects"
              : "Get started with Blueprint"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-[#EDEDF0] bg-white p-6"
        >
          <div className="flex flex-col gap-3">
            {mode === "signup" && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-[#56565C]">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="rounded-md border border-[#EDEDF0] px-3 py-2 text-sm outline-none focus:border-[#FD366E]"
                />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[#56565C]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="rounded-md border border-[#EDEDF0] px-3 py-2 text-sm outline-none focus:border-[#FD366E]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[#56565C]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                required
                minLength={8}
                className="rounded-md border border-[#EDEDF0] px-3 py-2 text-sm outline-none focus:border-[#FD366E]"
              />
            </div>

            {error && (
              <p className="rounded-md bg-[#FF453A1A] px-3 py-2 text-sm text-[#B31212]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 cursor-pointer rounded-md bg-[#FD366E] py-2.5 text-sm font-medium text-white disabled:opacity-60"
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Sign in"
                  : "Create account"}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-[#97979B]">
          {mode === "login" ? (
            <>
              No account?{" "}
              <button
                onClick={switchMode}
                className="cursor-pointer bg-transparent text-[#FD366E] hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={switchMode}
                className="cursor-pointer bg-transparent text-[#FD366E] hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </main>
  );
}
