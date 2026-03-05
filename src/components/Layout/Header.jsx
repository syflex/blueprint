import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useUiStore } from "../../store/uiStore";
import { useProjectStore } from "../../store/projectStore";

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const setShowExportDialog = useUiStore((s) => s.setShowExportDialog);
  const currentProjectId = useProjectStore((s) => s.currentProjectId);
  const projects = useProjectStore((s) => s.projects);
  const renameProject = useProjectStore((s) => s.renameProject);

  const isCanvas =
    location.pathname === "/" || location.pathname.startsWith("/canvas");

  const currentProject = currentProjectId
    ? projects.find((p) => p.id === currentProjectId)
    : null;

  return (
    <header className="flex items-center justify-between border-b border-[#EDEDF0] bg-white px-4 py-2">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <img src="/appwrite.svg" alt="Blueprint" className="h-6 w-6" />
          <div className="flex flex-col">
            <span className="font-[Poppins] text-lg leading-tight font-light text-[#2D2D31]">
              Blueprint
            </span>
            <span className="text-[9px] tracking-wide text-[#97979B]">
              Visual System Designer
            </span>
          </div>
        </Link>
        {isCanvas && currentProject && (
          <>
            <span className="text-[#D8D8DB]">/</span>
            <input
              type="text"
              value={currentProject.name}
              onChange={(e) => renameProject(currentProjectId, e.target.value)}
              className="w-40 border-none bg-transparent text-sm font-medium text-[#2D2D31] outline-none placeholder:text-[#D8D8DB] focus:underline focus:decoration-[#FD366E] focus:underline-offset-4"
              placeholder="Project name"
            />
            <span className="text-[9px] text-[#97979B]">auto-saved</span>
          </>
        )}
        {isCanvas && (
          <button
            onClick={() => setShowExportDialog(true)}
            className="cursor-pointer rounded-md border border-[#EDEDF0] bg-white px-2.5 py-1.5 text-xs text-[#2D2D31] hover:bg-[#F9F9FA]"
          >
            <span className="icon-download mr-1" />
            Export Artifact
          </button>
        )}
      </div>

      <nav className="flex items-center gap-2">
        {user ? (
          <>
            <Link
              to="/dashboard"
              className={`rounded-md px-2.5 py-1.5 text-sm no-underline ${
                location.pathname === "/dashboard"
                  ? "bg-[#FD366E] text-white"
                  : "border border-[#EDEDF0] text-[#2D2D31] hover:bg-[#F9F9FA]"
              }`}
            >
              Dashboard
            </Link>
            <span className="ml-2 text-xs text-[#97979B]">
              {user.name || user.email}
            </span>
            <button
              onClick={logout}
              className="cursor-pointer rounded-md border border-[#EDEDF0] bg-white px-2.5 py-1.5 text-sm text-[#2D2D31] hover:bg-[#F9F9FA]"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/about"
              className="rounded-md px-2.5 py-1.5 text-sm text-[#97979B] no-underline hover:text-[#2D2D31]"
            >
              About
            </Link>
            <Link
              to="/login"
              className="rounded-md border border-[#EDEDF0] px-2.5 py-1.5 text-sm text-[#2D2D31] no-underline hover:bg-[#F9F9FA]"
            >
              Sign in
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
