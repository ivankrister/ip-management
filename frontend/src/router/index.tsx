import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "@/pages/auth/Login";
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import Dashboard from "@/pages/Dashboard";
import { ProtectedRoute, AuthGuard, RoleBasedRoute } from "@/components/ProtectedRoute";
import IpManagementIndexPage from "@/pages/ip-management";
import AuditLogsIndexPage from "@/pages/audit-logs";
import UserManagementIndexPage from "@/pages/user-management";

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
            path: "ip-management",
            element: <IpManagementIndexPage />,
            handle: { title: "IP Address Management" },
          },
        ],
      },
    ],
  },
  {
    path: "/",
    element: <RoleBasedRoute allowedRoles={["super_admin"]} />,
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
            path: "user-management",
            element: <UserManagementIndexPage />,
            handle: { title: "User Management" },
          },
          {
            path: "audit-logs",
            element: <AuditLogsIndexPage />,
            handle: { title: "Audit Logs" },
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
