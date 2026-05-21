import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LoadingState, UnauthorizedState } from '../../../shared/components';
import { useAuth } from '../hooks/useAuth';

type AdminRouteProps = {
  children?: ReactNode;
};

export function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingState message="Verificando permisos..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return <UnauthorizedState />;
  }

  return children ?? <Outlet />;
}
