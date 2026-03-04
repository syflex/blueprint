import { runInSandbox, runDiagnostics } from "./modal-runner.js";

export default async ({ req, res, log, error }) => {
  if (req.method !== "POST") {
    return res.json({ error: "Method not allowed" }, 405);
  }

  const { code, action = "run" } = req.body;

  if (!code || typeof code !== "string") {
    return res.json({ error: "Missing 'code' field in request body" }, 400);
  }

  if (code.length > 10_000) {
    return res.json({ error: "Code exceeds 10,000 character limit" }, 400);
  }

  try {
    if (action === "diagnose") {
      log("Running diagnostics for code of length: " + code.length);
      const result = await runDiagnostics(code, { log, error });
      return res.json(result, 200);
    }

    log("Executing sandbox for code of length: " + code.length);
    const result = await runInSandbox(code, { log, error });
    return res.json(result, 200);
  } catch (err) {
    error("Sandbox execution failed: " + err.message);
    return res.json({ error: err.message, output: "", exitCode: 1 }, 500);
  }
};
