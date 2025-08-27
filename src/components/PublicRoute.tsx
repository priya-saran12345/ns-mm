import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux.hooks';

const PublicRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAppSelector((s) => s.auth);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading…</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    const backTo = (location.state as any)?.from?.pathname || "/dashboard";
    return <Navigate to={backTo} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
