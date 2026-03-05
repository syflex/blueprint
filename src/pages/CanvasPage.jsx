import { useMemo } from "react";
import ComponentLibrary from "../components/Canvas/ComponentLibrary";
import CanvasWorkspace from "../components/Canvas/CanvasWorkspace";
import ConfigPanel from "../components/Panels/ConfigPanel";
import CodePreviewPanel from "../components/CodePreview/CodePreviewPanel";
import ExportDialog from "../components/Export/ExportDialog";
import { useUiStore } from "../store/uiStore";
import { useSystemGraph } from "../ir/useSystemGraph";
import { generateFiles } from "../generators";

export default function CanvasPage() {
  const rightPanel = useUiStore((s) => s.rightPanel);
  const setRightPanel = useUiStore((s) => s.setRightPanel);
  const showExportDialog = useUiStore((s) => s.showExportDialog);
  const setShowExportDialog = useUiStore((s) => s.setShowExportDialog);
  const { ir } = useSystemGraph();
  const files = useMemo(() => generateFiles(ir), [ir]);

  return (
    <div className="flex h-full bg-[#FAFAFB]">
      {/* Left sidebar — Component Library */}
      <ComponentLibrary />

      {/* Center — Canvas */}
      <div className="flex-1">
        <CanvasWorkspace />
      </div>

      {/* Right sidebar — Config/Code Panel */}
      <div className="flex w-72 flex-shrink-0 flex-col border-l border-[#EDEDF0] bg-white">
        <div className="flex border-b border-[#EDEDF0]">
          <button
            onClick={() => setRightPanel("config")}
            className={`flex-1 cursor-pointer px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
              rightPanel === "config"
                ? "border-b-2 border-[#FD366E] text-[#2D2D31]"
                : "text-[#97979B] hover:text-[#2D2D31]"
            }`}
          >
            Config
          </button>
          <button
            onClick={() => setRightPanel("code")}
            className={`flex-1 cursor-pointer px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
              rightPanel === "code"
                ? "border-b-2 border-[#FD366E] text-[#2D2D31]"
                : "text-[#97979B] hover:text-[#2D2D31]"
            }`}
          >
            Code
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {rightPanel === "config" ? (
            <div className="p-4">
              <ConfigPanel />
            </div>
          ) : (
            <CodePreviewPanel />
          )}
        </div>
      </div>

      {/* Export Dialog */}
      {showExportDialog && (
        <ExportDialog
          files={files}
          onClose={() => setShowExportDialog(false)}
        />
      )}
    </div>
  );
}
