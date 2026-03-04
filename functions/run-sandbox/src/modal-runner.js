import { ModalClient } from "modal";

const SANDBOX_TIMEOUT_MS = 30_000;

function getModalClient() {
  const modal = new ModalClient();
  return modal;
}

async function getApp(modal) {
  return modal.apps.fromName("blueprint-sandbox", { createIfMissing: true });
}

const getBunImage = (modal) => modal.images.fromRegistry("oven/bun:latest");

const getTsImage = (modal) =>
  getBunImage(modal).dockerfileCommands(["RUN bun add -g typescript"]);

export async function runInSandbox(code, { log, error }) {
  const modal = getModalClient();
  const app = await getApp(modal);
  const image = getBunImage(modal);

  const sb = await modal.sandboxes.create(app, image, {
    command: ["bun", "run", "-"],
    timeoutMs: SANDBOX_TIMEOUT_MS,
  });

  log("Sandbox created: " + sb.sandboxId);

  await sb.stdin.writeText(code);
  await sb.stdin.close();

  const stdout = await sb.stdout.readText();
  const stderr = await sb.stderr.readText();

  await sb.terminate();

  log("Sandbox terminated, stdout length: " + stdout.length);

  return {
    output: stdout,
    error: stderr,
    exitCode: stderr ? 1 : 0,
  };
}

export async function runDiagnostics(code, { log, error }) {
  const modal = getModalClient();
  const app = await getApp(modal);
  const image = getTsImage(modal);

  const sb = await modal.sandboxes.create(app, image, {
    command: ["bun", "run", "-"],
    timeoutMs: SANDBOX_TIMEOUT_MS,
  });

  log("Diagnostics sandbox created: " + sb.sandboxId);

  // The diagnostics script reads user code from stdin
  // We wrap it: first the script, then a separator, but actually
  // the script itself reads from stdin — so we need a different approach.
  // We'll inline the user code into the script as a variable.
  const script = `
const __USER_CODE__ = ${JSON.stringify(code)};
import ts from "typescript";

const code = __USER_CODE__;
const fileName = "input.ts";
const sourceFile = ts.createSourceFile(fileName, code, ts.ScriptTarget.Latest, true);

const compilerHost = ts.createCompilerHost({});
const originalGetSourceFile = compilerHost.getSourceFile;
compilerHost.getSourceFile = (name, target) =>
  name === fileName ? sourceFile : originalGetSourceFile(name, target);
compilerHost.fileExists = (name) => name === fileName || ts.sys.fileExists(name);
compilerHost.readFile = (name) => name === fileName ? code : ts.sys.readFile(name);

const program = ts.createProgram([fileName], {
  target: ts.ScriptTarget.Latest,
  module: ts.ModuleKind.ESNext,
  strict: true,
  noEmit: true,
}, compilerHost);

const diagnostics = ts.getPreEmitDiagnostics(program);

const result = diagnostics.map(d => ({
  line: d.file ? ts.getLineAndCharacterOfPosition(d.file, d.start).line + 1 : 0,
  col: d.file ? ts.getLineAndCharacterOfPosition(d.file, d.start).character + 1 : 0,
  severity: d.category === 0 ? "warning" : d.category === 1 ? "error" : "info",
  message: ts.flattenDiagnosticMessageText(d.messageText, "\\n"),
  code: d.code,
}));

console.log(JSON.stringify(result));
`;

  await sb.stdin.writeText(script);
  await sb.stdin.close();

  const stdout = await sb.stdout.readText();
  const stderr = await sb.stderr.readText();

  await sb.terminate();

  log("Diagnostics sandbox terminated, stdout length: " + stdout.length);

  try {
    const diagnostics = JSON.parse(stdout);
    return { diagnostics };
  } catch {
    return {
      diagnostics: [],
      error: stderr || "Failed to parse diagnostics output",
    };
  }
}
