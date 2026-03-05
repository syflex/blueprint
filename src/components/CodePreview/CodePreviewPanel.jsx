import { useState, useMemo } from "react";
import { useSystemGraph } from "../../ir/useSystemGraph";
import { generateFiles } from "../../generators";
import FileTree from "./FileTree";
import CodeBlock from "./CodeBlock";

export default function CodePreviewPanel() {
  const { ir, issues } = useSystemGraph();
  const files = useMemo(() => generateFiles(ir), [ir]);
  const [selectedPath, setSelectedPath] = useState(null);

  const selectedFile = files.find((f) => f.path === selectedPath);

  // Auto-select first file if none selected
  if (!selectedFile && files.length > 0 && !selectedPath) {
    // Don't set state during render, just use the first file
  }

  const displayFile = selectedFile || files[0] || null;

  return (
    <div className="flex h-full flex-col">
      {/* Validation issues */}
      {issues.length > 0 && (
        <div className="border-b border-[#EDEDF0] px-3 py-2">
          {issues.map((issue, i) => (
            <div
              key={i}
              className={`text-[10px] ${
                issue.level === "error" ? "text-[#B31212]" : "text-[#B8860B]"
              }`}
            >
              {issue.level === "error" ? "✗" : "⚠"} {issue.message}
            </div>
          ))}
        </div>
      )}

      {/* File tree */}
      <div className="border-b border-[#EDEDF0] px-1 py-1">
        <div className="mb-1 px-2 pt-1 text-[10px] font-semibold uppercase tracking-wider text-[#97979B]">
          Files ({files.length})
        </div>
        <div className="max-h-48 overflow-y-auto">
          <FileTree
            files={files}
            selectedPath={displayFile?.path || null}
            onSelect={setSelectedPath}
          />
        </div>
      </div>

      {/* Code display */}
      <div className="flex-1 overflow-auto">
        {displayFile ? (
          <div>
            <div className="sticky top-0 z-10 border-b border-[#EDEDF0] bg-white px-3 py-1.5">
              <span className="font-[Fira_Code] text-[10px] text-[#97979B]">
                {displayFile.path}
              </span>
            </div>
            <CodeBlock
              code={displayFile.content}
              language={displayFile.language}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center py-12 text-center">
            <p className="text-xs text-[#97979B]">
              Add components to see generated code
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
