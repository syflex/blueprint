import { useState, useMemo } from "react";
import { Functions } from "appwrite";
import { client } from "../../lib/appwrite";
import { useSystemGraph } from "../../ir/useSystemGraph";
import { generateFiles } from "../../generators";
import { useAuth } from "../../contexts/AuthContext";

const functions = new Functions(client);
const FUNCTION_ID = import.meta.env.VITE_APPWRITE_SANDBOX_FUNCTION_ID;

export default function ValidationPanel() {
  const { user } = useAuth();
  const { ir, issues } = useSystemGraph();
  const files = useMemo(() => generateFiles(ir), [ir]);
  const [validating, setValidating] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const irIssues = issues || [];

  async function handleValidate() {
    if (validating) return;
    setValidating(true);
    setError("");
    setResults(null);

    try {
      // Bundle generated files into a single string for validation
      const tsFiles = files
        .filter((f) => f.path.endsWith(".ts") || f.path.endsWith(".tsx"))
        .map((f) => f.content)
        .join("\n\n// --- next file ---\n\n");

      if (!tsFiles.trim()) {
        setError("No TypeScript files to validate. Add components to the canvas first.");
        return;
      }

      if (!FUNCTION_ID) {
        setError(
          "Sandbox function not configured. Set VITE_APPWRITE_SANDBOX_FUNCTION_ID in your .env file."
        );
        return;
      }

      const execution = await functions.createExecution(
        FUNCTION_ID,
        JSON.stringify({ code: tsFiles, action: "diagnose" }),
        false,
        "/",
        "POST",
        { "Content-Type": "application/json" }
      );

      const response = JSON.parse(execution.responseBody);
      setResults(response);
    } catch (err) {
      setError(err.message || "Validation failed");
    } finally {
      setValidating(false);
    }
  }

  const diagnostics = results?.diagnostics || [];
  const errorCount = diagnostics.filter((d) => d.severity === "error").length;
  const warningCount = diagnostics.filter((d) => d.severity === "warning").length;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#97979B]">
          Validation
        </h3>
        <p className="mt-1 text-xs text-[#97979B]">
          Check your generated code for TypeScript errors
        </p>
      </div>

      {/* IR-level issues */}
      {irIssues.length > 0 && (
        <div className="rounded-md border border-[#EDEDF0] bg-[#FAFAFB] p-3">
          <span className="mb-1 block text-xs font-medium text-[#56565C]">
            Design Issues ({irIssues.length})
          </span>
          {irIssues.map((issue, i) => (
            <div
              key={i}
              className={`mt-1 text-xs ${
                issue.level === "error"
                  ? "text-[#B31212]"
                  : issue.level === "warning"
                    ? "text-[#B8860B]"
                    : "text-[#56565C]"
              }`}
            >
              <span className="mr-1 font-medium">
                {issue.level === "error" ? "!" : issue.level === "warning" ? "?" : "i"}
              </span>
              {issue.message}
            </div>
          ))}
        </div>
      )}

      {/* Validate button */}
      {!user ? (
        <div className="rounded-md border border-dashed border-[#D8D8DB] p-4 text-center">
          <span className="icon-lock-closed mb-2 block text-lg text-[#97979B]" />
          <p className="text-xs font-medium text-[#56565C]">Pro Feature</p>
          <p className="mt-1 text-xs text-[#97979B]">
            Sign in to validate generated code in the cloud sandbox
          </p>
        </div>
      ) : (
        <button
          onClick={handleValidate}
          disabled={validating || files.length === 0}
          className="cursor-pointer rounded-md bg-[#6C5CE7] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {validating ? "Validating..." : "Run Validation"}
        </button>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-md bg-[#FF453A1A] px-3 py-2 text-xs text-[#B31212]">
          {error}
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 rounded-md border border-[#EDEDF0] p-3">
            {errorCount === 0 ? (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#00B894]/15 text-xs text-[#00B894]">
                ✓
              </span>
            ) : (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#B31212]/15 text-xs text-[#B31212]">
                !
              </span>
            )}
            <div>
              <span className="text-xs font-medium text-[#2D2D31]">
                {errorCount === 0 ? "All checks passed" : `${errorCount} error(s) found`}
              </span>
              {warningCount > 0 && (
                <span className="ml-2 text-xs text-[#B8860B]">
                  {warningCount} warning(s)
                </span>
              )}
            </div>
          </div>

          {diagnostics.length > 0 && (
            <div className="max-h-64 overflow-y-auto rounded-md border border-[#EDEDF0] bg-[#FAFAFB] p-3">
              {diagnostics.map((d, i) => (
                <div
                  key={i}
                  className={`mb-1 font-[Fira_Code] text-[10px] leading-relaxed ${
                    d.severity === "error"
                      ? "text-[#B31212]"
                      : d.severity === "warning"
                        ? "text-[#B8860B]"
                        : "text-[#56565C]"
                  }`}
                >
                  L{d.line}:{d.col} [{d.severity}] {d.message}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* File summary */}
      <div className="border-t border-[#EDEDF0] pt-3">
        <span className="text-xs text-[#97979B]">
          {files.length} file{files.length !== 1 ? "s" : ""} generated
        </span>
      </div>
    </div>
  );
}
