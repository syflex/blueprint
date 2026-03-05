import { useMemo, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import ComponentLibrary from "../components/Canvas/ComponentLibrary";
import CanvasWorkspace from "../components/Canvas/CanvasWorkspace";
import ConfigPanel from "../components/Panels/ConfigPanel";
import CodePreviewPanel from "../components/CodePreview/CodePreviewPanel";
import ExportDialog from "../components/Export/ExportDialog";
import ValidationPanel from "../components/Panels/ValidationPanel";
import TemplatePicker from "../components/Canvas/TemplatePicker";
import { useUiStore } from "../store/uiStore";
import { useCanvasStore } from "../store/canvasStore";
import { useProjectStore } from "../store/projectStore";
import { useSystemGraph } from "../ir/useSystemGraph";
import { generateFiles } from "../generators";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";

export default function CanvasPage() {
  useKeyboardShortcuts();
  const { projectId } = useParams();
  const rightPanel = useUiStore((s) => s.rightPanel);
  const setRightPanel = useUiStore((s) => s.setRightPanel);
  const showExportDialog = useUiStore((s) => s.showExportDialog);
  const setShowExportDialog = useUiStore((s) => s.setShowExportDialog);
  const showTemplatePicker = useUiStore((s) => s.showTemplatePicker);
  const setShowTemplatePicker = useUiStore((s) => s.setShowTemplatePicker);
  const nodes = useCanvasStore((s) => s.nodes);
  const edges = useCanvasStore((s) => s.edges);
  const loadProject = useProjectStore((s) => s.loadProject);
  const saveProject = useProjectStore((s) => s.saveProject);
  const createProject = useProjectStore((s) => s.createProject);
  const currentProjectId = useProjectStore((s) => s.currentProjectId);
  const { ir } = useSystemGraph();
  const files = useMemo(() => generateFiles(ir), [ir]);

  // Load project from URL param
  const loadedRef = useRef(false);
  useEffect(() => {
    if (projectId && !loadedRef.current) {
      loadedRef.current = true;
      setShowTemplatePicker(false);
      const project = loadProject(projectId);
      if (project?.canvas) {
        const store = useCanvasStore.getState();
        store.loadCanvas(project.canvas.nodes, project.canvas.edges);
      }
    }
  }, [projectId, loadProject, setShowTemplatePicker]);

  // Auto-create project when nodes appear without one
  useEffect(() => {
    if (nodes.length > 0 && !currentProjectId && !projectId) {
      createProject("Untitled Project");
    }
  }, [nodes.length, currentProjectId, projectId, createProject]);

  // Auto-save (debounced 2s)
  const saveTimerRef = useRef(null);
  const autoSave = useCallback(() => {
    const pid = currentProjectId || projectId;
    if (!pid) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveProject(pid, { nodes, edges });
    }, 2000);
  }, [currentProjectId, projectId, nodes, edges, saveProject]);

  useEffect(() => {
    if (nodes.length > 0) autoSave();
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [nodes, edges, autoSave]);

  return (
    <div className="flex h-full bg-[#FAFAFB]">
      {/* Left sidebar — Component Library */}
      <ComponentLibrary />

      {/* Center — Canvas */}
      <div className="flex-1">
        <CanvasWorkspace />
      </div>

      {/* Right sidebar — Config/Code/Validate Panel */}
      <div className="flex w-72 flex-shrink-0 flex-col border-l border-[#EDEDF0] bg-white">
        <div className="flex border-b border-[#EDEDF0]">
          {["config", "code", "validate"].map((tab) => (
            <button
              key={tab}
              onClick={() => setRightPanel(tab)}
              className={`flex-1 cursor-pointer px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                rightPanel === tab
                  ? "border-b-2 border-[#FD366E] text-[#2D2D31]"
                  : "text-[#97979B] hover:text-[#2D2D31]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto">
          {rightPanel === "config" ? (
            <div className="p-4">
              <ConfigPanel />
            </div>
          ) : rightPanel === "code" ? (
            <CodePreviewPanel />
          ) : (
            <ValidationPanel />
          )}
        </div>
      </div>

      {/* Template Picker */}
      {showTemplatePicker && (
        <TemplatePicker />
      )}

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
