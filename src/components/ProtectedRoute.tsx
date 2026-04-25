import React, { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectCurrentApp, setCurrentApp } from '../store/slices/appSlice';
import { APPS } from '../constants/apps';

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
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (appId && (!currentApp || currentApp.id !== appId)) {
      const app = APPS.find(a => a.id === appId);
      if (app) {
        dispatch(setCurrentApp(app));
      }
    }
  }, [appId, currentApp, dispatch]);

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (appId && (!currentApp || currentApp.id !== appId)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
