import { createBrowserRouter } from "react-router-dom";
import AppShell from "./components/Layout/AppShell";
import IndexPage from "./pages/IndexPage";
import DashboardPage from "./pages/DashboardPage";
import SandboxPage from "./pages/SandboxPage";
import CanvasPage from "./pages/CanvasPage";

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: "/", element: <IndexPage /> },
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/sandbox", element: <SandboxPage /> },
      { path: "/canvas", element: <CanvasPage /> },
    ],
  },
]);
