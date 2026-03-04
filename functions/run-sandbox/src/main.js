// import { runInSandbox } from "./modal-runner.js";

export default async ({ req, res, log, error }) => {
  log("Function invoked, method: " + req.method);
  log("Body: " + JSON.stringify(req.body));

  if (req.method !== "POST") {
    return res.json({ error: "Method not allowed" }, 405);
  }

  const { code } = req.body;

  if (!code || typeof code !== "string") {
    return res.json({ error: "Missing 'code' field in request body" }, 400);
  }

  // TODO: re-enable Modal sandbox once basic function works
  return res.json({
    output: "Echo: function received " + code.length + " chars",
    error: "",
    exitCode: 0,
  }, 200);
};
