import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/store';

const PublicRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAppSelector((s) => s.auth);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          {/* Loader Circle */}
          {/* <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div> */}
          {/* Text */}          <div className="loader"></div>

          {/* <p className="text-blue-600 mt-4 text-sm font-medium">Loading…</p> */}
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    const backTo = (location.state )?.from?.pathname || "/dashboard";
    return <Navigate to={backTo} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
