import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/Loader";
import type { Role } from "@/types/api";

interface ProtectedRouteProps {
  /** Разрешённые роли; если не указаны — любой аутентифицированный */
  roles?: Role[];
  children?: ReactNode;
}

export function ProtectedRoute({ roles, children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const location = useLocation();

  if (isLoading) return <Loader text="Проверка сессии…" />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !hasRole(...roles)) {
    // Доступ запрещён → на главную защищённую страницу пользователя
    return <Navigate to="/schedule" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
