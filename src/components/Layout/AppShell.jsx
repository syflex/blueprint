import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function AppShell() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
