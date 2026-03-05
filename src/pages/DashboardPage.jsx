import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useProjectStore } from "../store/projectStore";

export default function DashboardPage() {
  const { user } = useAuth();
  const projects = useProjectStore((s) => s.projects);
  const deleteProject = useProjectStore((s) => s.deleteProject);

  return (
    <main className="flex flex-col px-6 py-8">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-[Poppins] text-2xl font-light text-[#2D2D31]">
              My Projects
            </h1>
            <p className="mt-1 text-sm text-[#97979B]">
              Welcome back, {user.name || user.email}
            </p>
          </div>
          <Link
            to="/canvas"
            className="rounded-md bg-[#FD366E] px-4 py-2 text-sm font-medium text-white no-underline hover:opacity-90"
          >
            + New Project
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center rounded-lg border border-dashed border-[#D8D8DB] py-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#FD366E]/10">
              <span className="icon-plus text-lg text-[#FD366E]" />
            </div>
            <h3 className="text-sm font-medium text-[#2D2D31]">
              No projects yet
            </h3>
            <p className="mt-1 text-xs text-[#97979B]">
              Create your first project to start designing
            </p>
            <Link
              to="/canvas"
              className="mt-4 rounded-md bg-[#FD366E] px-4 py-2 text-sm text-white no-underline hover:opacity-90"
            >
              Create Project
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group flex flex-col rounded-lg border border-[#EDEDF0] bg-white p-4 transition-shadow hover:shadow-sm"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-[#2D2D31]">
                      {project.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#97979B]">
                      {project.componentCount || 0} components
                    </p>
                  </div>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="cursor-pointer rounded p-1 text-[#97979B] opacity-0 transition-opacity hover:bg-[#FAFAFB] hover:text-[#B31212] group-hover:opacity-100"
                    title="Delete project"
                  >
                    <span className="icon-trash text-xs" />
                  </button>
                </div>
                <p className="mb-3 text-xs text-[#97979B]">
                  Updated {new Date(project.updatedAt).toLocaleDateString()}
                </p>
                <Link
                  to={`/canvas/${project.id}`}
                  className="mt-auto rounded-md border border-[#EDEDF0] py-1.5 text-center text-xs text-[#2D2D31] no-underline hover:bg-[#F9F9FA]"
                >
                  Open
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
