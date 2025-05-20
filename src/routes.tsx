import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

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
  // eMandi Portal Routes without authentication
  {
    path: '/emandi',
    element: <AppShell />,
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
  // MoneyTrail App Routes with authentication
  {
    path: '/moneytrail',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Overview /> },
      { path: 'reports', element: <div className="p-8 text-center">MoneyTrail Reports - Coming Soon</div> },
      { path: 'settings', element: <div className="p-8 text-center">MoneyTrail Settings - Coming Soon</div> },
    ],
  },
  // Catch all route - redirect to login
  { path: '*', element: <Navigate to="/" replace /> }
]);

const AppRoutes: React.FC = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default AppRoutes;