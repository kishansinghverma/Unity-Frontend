import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

// Layout
import AppShell from './components/layout/AppShell';

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
    element: <AppShell />,
    children: [
      { index: true, element: <GatePassForm /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'gatepass/new', element: <GatePassForm /> },
      { path: 'gatepass/list', element: <GatePassList /> },
      { path: 'processed/list', element: <ProcessedRecordsList /> },
      { path: 'parties', element: <PartyList /> },
      { path: 'parties/new', element: <PartyForm /> },
      { path: 'parties/:id', element: <PartyForm /> },
      { path: 'parties/edit/:id', element: <PartyForm /> },
      
      // Placeholder routes for second app (to be built later)
      { path: 'analytics', element: <div className="p-8 text-center">Analytics App - Coming Soon</div> },
      { path: 'reports', element: <div className="p-8 text-center">Reports - Coming Soon</div> },
      { path: 'analytics-settings', element: <div className="p-8 text-center">Analytics Settings - Coming Soon</div> },
      
      // Settings
      { path: 'settings', element: <div className="p-8 text-center">Settings - Coming Soon</div> },
      
      // Catch all route
      { path: '*', element: <Navigate to="/" replace /> }
    ],
  },
]);

const AppRoutes: React.FC = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default AppRoutes;