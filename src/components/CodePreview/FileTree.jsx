import { useState, useMemo } from "react";

/**
 * Build a tree structure from flat file paths.
 */
function buildTree(files) {
  const root = { name: "", children: {}, files: [] };

  for (const file of files) {
    const parts = file.path.split("/");
    let current = root;

    for (let i = 0; i < parts.length - 1; i++) {
      const dir = parts[i];
      if (!current.children[dir]) {
        current.children[dir] = { name: dir, children: {}, files: [] };
      }
      current = current.children[dir];
    }

    current.files.push(file);
  }

  return root;
}

function TreeNode({ node, depth, selectedPath, onSelect }) {
  const [expanded, setExpanded] = useState(true);
  const dirNames = Object.keys(node.children).sort();
  const hasContent = dirNames.length > 0 || node.files.length > 0;

  if (!hasContent) return null;

  return (
    <div>
      {node.name && (
        <div
          className="flex cursor-pointer items-center gap-1 rounded px-1 py-0.5 text-xs hover:bg-[#FAFAFB]"
          style={{ paddingLeft: `${depth * 12}px` }}
          onClick={() => setExpanded(!expanded)}
        >
          <span className="text-[10px] text-[#97979B]">
            {expanded ? "▼" : "▶"}
          </span>
          <span className="icon-folder text-[10px] text-[#FDCB6E]" />
          <span className="text-[#2D2D31]">{node.name}</span>
        </div>
      )}

      {expanded && (
        <>
          {dirNames.map((dir) => (
            <TreeNode
              key={dir}
              node={node.children[dir]}
              depth={node.name ? depth + 1 : depth}
              selectedPath={selectedPath}
              onSelect={onSelect}
            />
          ))}
          {node.files.map((file) => {
            const fileName = file.path.split("/").pop();
            const isSelected = selectedPath === file.path;

            return (
              <div
                key={file.path}
                className={`flex cursor-pointer items-center gap-1 rounded px-1 py-0.5 text-xs ${
                  isSelected
                    ? "bg-[#FD366E]/10 text-[#FD366E]"
                    : "text-[#56565C] hover:bg-[#FAFAFB]"
                }`}
                style={{ paddingLeft: `${(node.name ? depth + 1 : depth) * 12}px` }}
                onClick={() => onSelect(file.path)}
              >
                <span className="icon-document text-[10px]" />
                <span className="truncate">{fileName}</span>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export default function FileTree({ files, selectedPath, onSelect }) {
  const tree = useMemo(() => buildTree(files), [files]);

  if (files.length === 0) {
    return (
      <p className="px-2 py-4 text-center text-xs text-[#97979B]">
        No files generated yet. Add components to the canvas and configure them.
      </p>
    );
  }

  return (
    <div className="flex flex-col py-1">
      <TreeNode
        node={tree}
        depth={0}
        selectedPath={selectedPath}
        onSelect={onSelect}
      />
    </div>
  );
}
