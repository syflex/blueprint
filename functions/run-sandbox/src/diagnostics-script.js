export const DIAGNOSTICS_SCRIPT = `
import ts from "typescript";

const code = await Bun.stdin.text();

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
