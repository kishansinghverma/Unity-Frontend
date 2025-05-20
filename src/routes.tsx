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
      // Root redirect to default app
      { index: true, element: <Navigate to="/emandi" replace /> },
      
      // eMandi Portal App Routes
      { path: 'emandi', element: <GatePassForm /> },
      { path: 'emandi/dashboard', element: <Dashboard /> },
      { path: 'emandi/gatepass/new', element: <GatePassForm /> },
      { path: 'emandi/gatepass/list', element: <GatePassList /> },
      { path: 'emandi/processed/list', element: <ProcessedRecordsList /> },
      { path: 'emandi/parties', element: <PartyList /> },
      { path: 'emandi/parties/new', element: <PartyForm /> },
      { path: 'emandi/parties/:id', element: <PartyForm /> },
      { path: 'emandi/parties/edit/:id', element: <PartyForm /> },
      { path: 'emandi/settings', element: <div className="p-8 text-center">eMandi Settings - Coming Soon</div> },
      
      // Analytics App Routes
      { path: 'analytics', element: <div className="p-8 text-center">Analytics Dashboard - Coming Soon</div> },
      { path: 'analytics/reports', element: <div className="p-8 text-center">Reports - Coming Soon</div> },
      { path: 'analytics/settings', element: <div className="p-8 text-center">Analytics Settings - Coming Soon</div> },
      
      // Catch all route
      { path: '*', element: <Navigate to="/emandi" replace /> }
    ],
  },
]);

const AppRoutes: React.FC = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default AppRoutes;