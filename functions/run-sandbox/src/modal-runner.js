import { ModalClient } from "modal";

const SANDBOX_TIMEOUT_MS = 30_000;

export async function runInSandbox(code, { log, error }) {
  const modal = new ModalClient();

  const app = await modal.apps.fromName("blueprint-sandbox", {
    createIfMissing: true,
  });

  const image = modal.images.fromRegistry("oven/bun:latest");

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
