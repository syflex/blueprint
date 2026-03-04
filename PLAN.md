# Phase 1: Modal Sandbox REPL via Appwrite Function

## Context
Build a simple remote REPL — a page with a textarea where you paste TypeScript code, hit "Run," and it executes in a Modal sandbox via an Appwrite Function. The goal is to learn the Modal sandbox lifecycle, the TypeScript SDK, and how to shuttle code + results back and forth. The Appwrite Function cleanly separates server-side Modal logic from the React frontend.

## Architecture

```
SandboxPage (React)
  → Appwrite SDK functions.createExecution()
    → Appwrite Function "run-sandbox" (Node.js)
      → modal-runner.js (Modal SDK)
        → Modal Sandbox (Bun image, runs TypeScript natively)
      ← stdout + stderr collected
    ← JSON { output, error }
  ← Displayed in output panel
```

## Files to Create

### 1. `functions/run-sandbox/package.json`
Function dependencies — `modal` (^0.7.2) and `node-appwrite` (^14.0.0). Uses `"type": "module"`.

### 2. `functions/run-sandbox/src/main.js` — Appwrite Function entry point
- Accepts POST with `{ code }` body
- Validates input (non-empty string, max 10K chars)
- Delegates to `modal-runner.js`, returns JSON `{ output, error }`
- No Modal logic here — purely HTTP handling

### 3. `functions/run-sandbox/src/modal-runner.js` — Modal sandbox logic (isolated)
- Creates `ModalClient`, gets/creates app `"blueprint-sandbox"`
- Uses `oven/bun:latest` image (Bun runs TypeScript natively, no ts-node needed)
- Creates sandbox with `["bun", "run", "-"]` command (reads script from stdin)
- Writes user code to `sb.stdin`, closes stdin, reads `sb.stdout` + `sb.stderr`
- Terminates sandbox, returns `{ output, error }`
- Follows the exact pattern from `src/modal/sandbox.ts` reference

### 4. `src/pages/SandboxPage.jsx` — Frontend REPL page
- Textarea (monospace `font-[Fira_Code]`) with default example code
- "Run" button → calls `functions.createExecution()` synchronously
- Output panel: stdout in normal text, stderr in red
- "Running..." loading state
- "Back to home" nav link (same pattern as DashboardPage)
- Styling matches existing pages (same Tailwind tokens/colors)

### 5. `appwrite.json` — Appwrite CLI deployment config (project root)
- Defines `run-sandbox` function: runtime `node-22.0`, entrypoint `src/main.js`, timeout 60s
- `execute: ["users"]` — only authenticated users can invoke

## Files to Modify

### 6. `src/App.jsx`
- Import `SandboxPage`
- Add `if (page === "sandbox" && auth.user)` route before existing dashboard check

### 7. `src/components/AuthButtons.jsx`
- Add `onShowSandbox` prop
- Add "Sandbox" button next to "Dashboard" in the logged-in branch

### 8. `src/pages/IndexPage.jsx`
- Thread `onShowSandbox` callback through to `AuthButtons`

### 9. `.env` / `.env.example`
- Add `VITE_APPWRITE_SANDBOX_FUNCTION_ID=`

## Environment Variables (Appwrite Console, not in code)
| Variable | Purpose |
|----------|---------|
| `MODAL_TOKEN_ID` | Modal API token ID (read automatically by ModalClient) |
| `MODAL_TOKEN_SECRET` | Modal API token secret |

## Verification
1. Deploy function: `appwrite deploy function`
2. Set Modal credentials in Appwrite Console on the function
3. Copy function ID to `.env`
4. Run `npm run dev`, log in, click "Sandbox"
5. Paste TypeScript code, hit Run, confirm output appears
6. Test error case (syntax error) — stderr should display in red
