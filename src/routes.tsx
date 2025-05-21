import React, { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from './store/hooks';
import { setCurrentApp } from './store/slices/appSlice';
import { APPS } from './constants/apps';

// Layout
import AppShell from './components/layout/AppShell';
import ProtectedRoute from './components/ProtectedRoute';

// Auth pages
import Login from './pages/Login';
import AppSelection from './pages/AppSelection';

// CRUD App
import Dashboard from './apps/crudApp/pages/Dashboard';
import GatePassForm from './apps/crudApp/pages/GatePassForm';
import GatePassList from './apps/crudApp/pages/GatePassList';
import ProcessedRecordsList from './apps/crudApp/pages/ProcessedRecordsList';
import PartyList from './apps/crudApp/pages/PartyList';
import PartyForm from './apps/crudApp/pages/PartyForm';

// MoneyTrail App
import Overview from './apps/moneyTrailApp/pages/Overview';
import MoneyTrailDashboard from './apps/moneyTrailApp/pages/Dashboard';

const PersistLastVisitedPage: React.FC = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Persist the last visited page in localStorage
    localStorage.setItem('lastVisitedPage', location.pathname);
  }, [location]);

  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/app-selection',
    element: (
      <ProtectedRoute>
        <AppSelection />
      </ProtectedRoute>
    ),
  },
  {
    path: '/emandi',
    element: (
      <PersistLastVisitedPage>
        <AppShell />
      </PersistLastVisitedPage>
    ),
    children: [
      { index: true, element: <GatePassForm /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'gatepasses', element: <Navigate to="/emandi/gatepasses/queued" replace /> },
      { path: 'gatepasses/new', element: <GatePassForm /> },
      { path: 'gatepasses/queued', element: <GatePassList /> },
      { path: 'gatepasses/processed', element: <ProcessedRecordsList /> },
      { path: 'parties', element: <PartyList /> },
      { path: 'parties/new', element: <PartyForm /> },
      { path: 'parties/:id', element: <PartyForm /> },
      { path: 'parties/edit/:id', element: <PartyForm /> },
      { path: 'settings', element: <div className="p-8 text-center">eMandi Settings - Coming Soon</div> },
    ],
  },
  {
    path: '/moneytrail',
    element: (
      <ProtectedRoute>
        <PersistLastVisitedPage>
          <AppShell />
        </PersistLastVisitedPage>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Overview /> },
      { path: 'dashboard', element: <MoneyTrailDashboard /> },
      { path: 'reports', element: <div className="p-8 text-center">MoneyTrail Reports - Coming Soon</div> },
      { path: 'settings', element: <div className="p-8 text-center">MoneyTrail Settings - Coming Soon</div> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> }
]);

const AppRoutes: React.FC = () => {
  const [isRedirecting, setIsRedirecting] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Redirect to last visited page if available
    const lastVisitedPage = localStorage.getItem('lastVisitedPage');
    if (lastVisitedPage && window.location.pathname === '/') {
      window.location.replace(lastVisitedPage);
    } else {
      setIsRedirecting(false);
    }

    // Update currentApp based on last visited page
    if (lastVisitedPage) {
      const matchingApp = APPS.find(app => lastVisitedPage.startsWith(`/${app.id}`));
      if (matchingApp) {
        dispatch(setCurrentApp(matchingApp));
      }
    }
  }, [dispatch]);

  if (isRedirecting) {
    // Show a loading spinner or placeholder while redirecting
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return <RouterProvider router={router} />;
};

export default AppRoutes;
