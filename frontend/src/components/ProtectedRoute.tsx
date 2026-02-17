import { Navigate, Outlet } from "react-router-dom";
import { AuthService } from "@/services/auth.service";

interface ProtectedRouteProps {
  redirectTo?: string;
}

/**
 * Protected route wrapper that redirects to login if user is not authenticated
 */
export function ProtectedRoute({ redirectTo = "/auth/login" }: ProtectedRouteProps) {
  const isAuthenticated = AuthService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}

/**
 * Auth guard that redirects to dashboard if user is already authenticated
 */
export function AuthGuard({ redirectTo = "/dashboard" }: ProtectedRouteProps) {
  const isAuthenticated = AuthService.isAuthenticated();

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
