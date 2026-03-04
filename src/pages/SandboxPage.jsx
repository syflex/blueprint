import { useState } from "react";
import { Functions } from "appwrite";
import { client } from "../lib/appwrite";

const functions = new Functions(client);
const FUNCTION_ID = import.meta.env.VITE_APPWRITE_SANDBOX_FUNCTION_ID;

const DEFAULT_CODE = `const greeting: string = "Hello from the sandbox!";
console.log(greeting);
`;

export default function SandboxPage({ onNavigate, onLogout }) {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [diagnostics, setDiagnostics] = useState([]);
  const [running, setRunning] = useState(false);
  const [checking, setChecking] = useState(false);

  async function callFunction(action) {
    const execution = await functions.createExecution(
      FUNCTION_ID,
      JSON.stringify({ code, action }),
      false,
      "/",
      "POST",
      { "Content-Type": "application/json" }
    );
    return JSON.parse(execution.responseBody);
  }

  async function handleCheck() {
    if (checking || running) return;
    setChecking(true);
    setDiagnostics([]);
    setErrorMsg("");

    try {
      const response = await callFunction("diagnose");
      setDiagnostics(response.diagnostics || []);
      if (response.error) setErrorMsg(response.error);
    } catch (err) {
      setErrorMsg(err.message || "Diagnostics failed");
    } finally {
      setChecking(false);
    }
  }

  async function handleRun() {
    if (running || checking) return;
    setRunning(true);
    setOutput("");
    setErrorMsg("");
    setDiagnostics([]);

    try {
      // Run diagnostics first, then execute
      const diagResponse = await callFunction("diagnose");
      setDiagnostics(diagResponse.diagnostics || []);

      const response = await callFunction("run");
      setOutput(response.output || "");
      if (response.error) setErrorMsg(response.error);
    } catch (err) {
      setErrorMsg(err.message || "Execution failed");
    } finally {
      setRunning(false);
    }
  }

  const busy = running || checking;

  return (
    <main className="checker-background flex min-h-screen flex-col items-center p-5">
      <div className="mt-25 w-full max-w-2xl lg:mt-34">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-[Poppins] text-2xl font-light text-[#2D2D31]">
            Sandbox
          </h1>
          <button
            onClick={() => onNavigate("index")}
            className="cursor-pointer text-sm text-[#97979B] hover:text-[#2D2D31]"
          >
            Back to home
          </button>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="h-64 w-full resize-y rounded-md border border-[#EDEDF0] bg-white p-4 font-[Fira_Code] text-sm text-[#2D2D31] outline-none focus:border-[#FD366E]"
          placeholder="Paste your TypeScript code here..."
          spellCheck={false}
        />

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleRun}
            disabled={busy || !code.trim()}
            className="cursor-pointer rounded-md bg-[#FD366E] px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            {running ? "Running..." : "Run"}
          </button>
          <button
            onClick={handleCheck}
            disabled={busy || !code.trim()}
            className="cursor-pointer rounded-md border border-[#EDEDF0] bg-white px-4 py-2 text-sm text-[#2D2D31] disabled:opacity-60"
          >
            {checking ? "Checking..." : "Check"}
          </button>
        </div>

        {diagnostics.length > 0 && (
          <div className="mt-4 rounded-md border border-[#EDEDF0] bg-white p-4">
            <span className="mb-2 block text-xs font-semibold text-[#97979B]">
              Diagnostics
            </span>
            {diagnostics.map((d, i) => (
              <div
                key={i}
                className={`font-[Fira_Code] text-sm ${d.severity === "error" ? "text-[#B31212]" : d.severity === "warning" ? "text-[#B8860B]" : "text-[#2D2D31]"}`}
              >
                Line {d.line}:{d.col} — [{d.severity}] {d.message} (TS{d.code})
              </div>
            ))}
          </div>
        )}

        {(output || errorMsg) && (
          <div className="mt-4 rounded-md border border-[#EDEDF0] bg-white p-4">
            {output && (
              <pre className="whitespace-pre-wrap font-[Fira_Code] text-sm text-[#2D2D31]">
                {output}
              </pre>
            )}
            {errorMsg && (
              <pre className="mt-2 whitespace-pre-wrap font-[Fira_Code] text-sm text-[#B31212]">
                {errorMsg}
              </pre>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
