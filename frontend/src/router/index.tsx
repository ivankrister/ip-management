import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "@/pages/auth/Login";
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import Dashboard from "@/pages/Dashboard";
import { ProtectedRoute, AuthGuard } from "@/components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/auth",
    element: <AuthGuard />,
    children: [
      {
        path: "",
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "",
            element: <Navigate to="/auth/login" replace />,
          },
        ],
      },
    ],
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <MainLayout />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
            handle: { title: "Dashboard" },
          },
          {
            path: "ip-management",
            element: <div>IP Management Page</div>,
            handle: { title: "IP Address Management" },
          },
          {
            path: "audit-logs",
            element: <div>Audit Logs Page</div>,
            handle: { title: "Audit Logs" },
          },
          {
            path: "settings",
            element: <div>Settings Page</div>,
            handle: { title: "Settings" },
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/auth/login" replace />,
  },
]);
