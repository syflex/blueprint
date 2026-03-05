import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <main className="checker-background flex min-h-screen flex-col items-center justify-center p-5">
        <p className="text-[#97979B]">Please sign in to view your dashboard.</p>
        <Link to="/" className="mt-2 text-sm text-[#FD366E] hover:underline">
          Go to home
        </Link>
      </main>
    );
  }

  return (
    <main className="checker-background flex min-h-screen flex-col items-center p-5">
      <div className="mt-12 w-full max-w-md">
        <div className="mb-6">
          <h1 className="font-[Poppins] text-2xl font-light text-[#2D2D31]">Dashboard</h1>
        </div>
        <div className="flex flex-col gap-4">
          <div className="rounded-md border border-[#EDEDF0] bg-white p-4">
            <p className="text-xs text-[#97979B]">Name</p>
            <p className="mt-0.5 font-medium text-[#2D2D31]">{user.name || "—"}</p>
          </div>
          <div className="rounded-md border border-[#EDEDF0] bg-white p-4">
            <p className="text-xs text-[#97979B]">Email</p>
            <p className="mt-0.5 font-medium text-[#2D2D31]">{user.email}</p>
          </div>
          <div className="rounded-md border border-[#EDEDF0] bg-white p-4">
            <p className="text-xs text-[#97979B]">User ID</p>
            <p className="mt-0.5 font-[Fira_Code] text-sm text-[#2D2D31]">{user.$id}</p>
          </div>
        </div>
        <Link
          to="/canvas"
          className="mt-6 block w-full rounded-md bg-[#FD366E] py-2 text-center text-sm text-white no-underline hover:opacity-90"
        >
          Open Canvas
        </Link>
        <button
          onClick={logout}
          className="mt-3 w-full cursor-pointer rounded-md border border-[#EDEDF0] bg-white py-2 text-sm text-[#2D2D31] hover:bg-[#F9F9FA]"
        >
          Log out
        </button>
      </div>
    </main>
  );
}
