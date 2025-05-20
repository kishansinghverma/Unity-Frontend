import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

// Layout
import AppShell from './components/layout/AppShell';

// CRUD App
import Dashboard from './apps/crudApp/pages/Dashboard';
import CustomerList from './apps/crudApp/pages/CustomerList';
import CustomerDetail from './apps/crudApp/pages/CustomerDetail';
import CustomerNew from './apps/crudApp/pages/CustomerNew';
import CustomerEdit from './apps/crudApp/pages/CustomerEdit';
import NewForm from './apps/crudApp/pages/NewForm';

// Context Provider
import { AppProvider } from './context/AppContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'new', element: <NewForm /> },
      { path: 'customers', element: <CustomerList /> },
      { path: 'customers/:id', element: <CustomerDetail /> },
      { path: 'customers/new', element: <CustomerNew /> },
      { path: 'customers/edit/:id', element: <CustomerEdit /> },
      
      // Placeholder routes for second app (to be built later)
      { path: 'analytics', element: <div className="p-8 text-center">Analytics App - Coming Soon</div> },
      { path: 'reports', element: <div className="p-8 text-center">Reports - Coming Soon</div> },
      { path: 'analytics-settings', element: <div className="p-8 text-center">Analytics Settings - Coming Soon</div> },
      
      // Orders and Products (to be built later)
      { path: 'orders', element: <div className="p-8 text-center">Orders - Coming Soon</div> },
      { path: 'products', element: <div className="p-8 text-center">Products - Coming Soon</div> },
      { path: 'settings', element: <div className="p-8 text-center">Settings - Coming Soon</div> },
      
      // Catch all route
      { path: '*', element: <Navigate to="/" replace /> }
    ],
  },
]);

const AppRoutes: React.FC = () => {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
};

export default AppRoutes;