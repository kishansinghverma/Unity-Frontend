import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppSelector } from '../store/hooks';
import { selectCurrentApp } from '../store/slices/appSlice';

interface ProtectedRouteProps {
  redirectPath?: string;
  children: ReactNode;
  appId?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = '/',
  children,
  appId,
}) => {
  const { isAuthenticated } = useAuth();
  const currentApp = useAppSelector(selectCurrentApp);

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (appId && (!currentApp || currentApp.id !== appId)) {
    return <Navigate to="/app-selection" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
