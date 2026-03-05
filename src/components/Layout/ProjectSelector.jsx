import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectStore } from "../../store/projectStore";
import { useCanvasStore } from "../../store/canvasStore";
import { useUiStore } from "../../store/uiStore";

function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function ProjectSelector() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const projects = useProjectStore((s) => s.projects);
  const currentProjectId = useProjectStore((s) => s.currentProjectId);
  const loadProject = useProjectStore((s) => s.loadProject);
  const renameProject = useProjectStore((s) => s.renameProject);
  const setCurrentProject = useProjectStore((s) => s.setCurrentProject);

  const setShowTemplatePicker = useUiStore((s) => s.setShowTemplatePicker);

  const currentProject = currentProjectId
    ? projects.find((p) => p.id === currentProjectId)
    : null;

  const sorted = [...projects].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function switchTo(project) {
    // Save current canvas first
    const { nodes, edges } = useCanvasStore.getState();
    if (currentProjectId && nodes.length > 0) {
      useProjectStore.getState().saveProject(currentProjectId, { nodes, edges });
    }

    // Load new project
    const loaded = loadProject(project.id);
    if (loaded?.canvas) {
      useCanvasStore.getState().loadCanvas(loaded.canvas.nodes, loaded.canvas.edges);
    }
    navigate(project.id ? `/canvas/${project.id}` : "/");
    setOpen(false);
  }

  function handleNewProject() {
    // Save current first
    const { nodes, edges } = useCanvasStore.getState();
    if (currentProjectId && nodes.length > 0) {
      useProjectStore.getState().saveProject(currentProjectId, { nodes, edges });
    }

    useCanvasStore.getState().clearCanvas();
    setCurrentProject(null);
    setShowTemplatePicker(true);
    navigate("/");
    setOpen(false);
  }

  if (!currentProject) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger: project name + chevron */}
      <div className="flex items-center gap-1.5">
        <span className="text-[#D8D8DB]">/</span>
        <input
          type="text"
          value={currentProject.name}
          onChange={(e) => renameProject(currentProjectId, e.target.value)}
          className="w-36 border-none bg-transparent text-sm font-medium text-[#2D2D31] outline-none placeholder:text-[#D8D8DB] focus:underline focus:decoration-[#FD366E] focus:underline-offset-4"
          placeholder="Project name"
        />
        <button
          onClick={() => setOpen(!open)}
          className="flex h-5 w-5 cursor-pointer items-center justify-center rounded border-none bg-transparent text-[#97979B] transition-colors hover:text-[#2D2D31]"
          aria-label="Switch project"
        >
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          >
            <path
              d="M1 1L5 5L9 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span className="text-[9px] text-[#97979B]">auto-saved</span>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-lg border border-[#EDEDF0] bg-white shadow-lg">
          <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#97979B]">
            Projects ({sorted.length})
          </div>
          <div className="max-h-64 overflow-y-auto">
            {sorted.map((project) => (
              <button
                key={project.id}
                onClick={() => switchTo(project)}
                className={`flex w-full cursor-pointer items-center gap-3 border-none px-3 py-2.5 text-left transition-colors hover:bg-[#FAFAFB] ${
                  project.id === currentProjectId
                    ? "border-l-2 border-l-[#FD366E] bg-[#FFF5F7]"
                    : "border-l-2 border-l-transparent bg-white"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium text-[#2D2D31]">
                    {project.name}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[#97979B]">
                    <span>{project.componentCount || 0} components</span>
                    <span>&middot;</span>
                    <span>{timeAgo(project.updatedAt)}</span>
                  </div>
                </div>
                {project.id === currentProjectId && (
                  <span className="text-[10px] text-[#FD366E]">active</span>
                )}
              </button>
            ))}
          </div>
          <div className="border-t border-[#EDEDF0]">
            <button
              onClick={handleNewProject}
              className="flex w-full cursor-pointer items-center gap-2 border-none bg-white px-3 py-2.5 text-left text-sm text-[#FD366E] transition-colors hover:bg-[#FFF5F7]"
            >
              <span className="text-base leading-none">+</span>
              New Project
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
