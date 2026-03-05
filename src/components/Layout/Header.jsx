import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useUiStore } from "../../store/uiStore";

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const setShowExportDialog = useUiStore((s) => s.setShowExportDialog);

  const isCanvas = location.pathname.startsWith("/canvas");

  return (
    <header className="flex items-center justify-between border-b border-[#EDEDF0] bg-white px-4 py-3">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <img src="/appwrite.svg" alt="Blueprint" className="h-6 w-6" />
          <span className="font-[Poppins] text-lg font-light text-[#2D2D31]">
            Blueprint
          </span>
        </Link>
        {isCanvas && (
          <>
            <span className="text-xs text-[#97979B]">Visual System Designer</span>
            <button
              onClick={() => setShowExportDialog(true)}
              className="cursor-pointer rounded-md border border-[#EDEDF0] bg-white px-2.5 py-1.5 text-xs text-[#2D2D31] hover:bg-[#F9F9FA]"
            >
              <span className="icon-download mr-1" />
              Export ZIP
            </button>
          </>
        )}
      </div>

      <nav className="flex items-center gap-2">
        {user ? (
          <>
            <Link
              to="/canvas"
              className={`rounded-md px-2.5 py-1.5 text-sm no-underline ${
                isCanvas
                  ? "bg-[#FD366E] text-white"
                  : "border border-[#EDEDF0] text-[#2D2D31] hover:bg-[#F9F9FA]"
              }`}
            >
              Canvas
            </Link>
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
              to="/canvas"
              className={`rounded-md px-2.5 py-1.5 text-sm no-underline ${
                isCanvas
                  ? "bg-[#FD366E] text-white"
                  : "border border-[#EDEDF0] text-[#2D2D31] hover:bg-[#F9F9FA]"
              }`}
            >
              Canvas
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
