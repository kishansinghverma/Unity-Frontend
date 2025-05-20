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
  // Analytics App Routes with authentication
  {
    path: '/analytics',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <div className="p-8 text-center">Analytics Dashboard - Coming Soon</div> },
      { path: 'reports', element: <div className="p-8 text-center">Reports - Coming Soon</div> },
      { path: 'settings', element: <div className="p-8 text-center">Analytics Settings - Coming Soon</div> },
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