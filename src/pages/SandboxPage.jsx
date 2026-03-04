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
  const [running, setRunning] = useState(false);

  async function handleRun() {
    if (running) return;
    setRunning(true);
    setOutput("");
    setErrorMsg("");

    try {
      const execution = await functions.createExecution(
        FUNCTION_ID,
        JSON.stringify({ code }),
        false,
        "/",
        "POST",
        { "Content-Type": "application/json" }
      );

      const response = JSON.parse(execution.responseBody);
      setOutput(response.output || "");
      if (response.error) {
        setErrorMsg(response.error);
      }
    } catch (err) {
      setErrorMsg(err.message || "Execution failed");
    } finally {
      setRunning(false);
    }
  }

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

        <button
          onClick={handleRun}
          disabled={running || !code.trim()}
          className="mt-4 cursor-pointer rounded-md bg-[#FD366E] px-4 py-2 text-sm text-white disabled:opacity-60"
        >
          {running ? "Running..." : "Run"}
        </button>

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
