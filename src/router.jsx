import { createBrowserRouter } from "react-router-dom";
import AppShell from "./components/Layout/AppShell";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import SandboxPage from "./pages/SandboxPage";
import CanvasPage from "./pages/CanvasPage";

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: "/", element: <CanvasPage /> },
      { path: "/about", element: <LandingPage /> },
      { path: "/login", element: <AuthPage /> },
      { path: "/canvas/:projectId", element: <CanvasPage /> },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      { path: "/sandbox", element: <SandboxPage /> },
    ],
  },
]);
