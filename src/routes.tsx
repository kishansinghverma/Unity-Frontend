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

// eMandi App
import Dashboard from './apps/emandi/pages/Dashboard';
import GatePassForm from './apps/emandi/pages/GatePassForm';
import GatePassList from './apps/emandi/pages/GatePassList';
import ProcessedRecordsList from './apps/emandi/pages/ProcessedRecordsList';
import PartyList from './apps/emandi/pages/PartyList';
import PartyForm from './apps/emandi/pages/PartyForm';

// Money Trail App
import MoneyTrailDashboard from './apps/moneytrail/pages/Dashboard';
import ReviewExpense from './apps/moneytrail/pages/Review';
import Splitwise from './apps/moneytrail/pages/Splitwise';

// Smart Home App
import SmartHomeDashboard from './apps/smarthome/pages/Dashboard';
import DevicesPage from './apps/smarthome/pages/DevicesPage';

// Potato Stock App
import PotatoStockDashboard from './apps/potatostock/pages/Dashboard';
import StockList from './apps/potatostock/pages/StockList';
import StockForm from './apps/potatostock/pages/StockForm';
import TransferPage from './apps/potatostock/pages/TransferPage';
import PriceUpdatePage from './apps/potatostock/pages/PriceUpdatePage';

const PersistLastVisitedPage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
      <ProtectedRoute appId="emandi">
        <PersistLastVisitedPage>
          <AppShell />
        </PersistLastVisitedPage>
      </ProtectedRoute>
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
      <ProtectedRoute appId="moneytrail">
        <PersistLastVisitedPage>
          <AppShell />
        </PersistLastVisitedPage>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <MoneyTrailDashboard /> },
      { path: 'splitwise-groups', element: <Splitwise /> },
      { path: 'review', element: <ReviewExpense /> },
      { path: 'reports', element: <div className="p-8 text-center">Money Trail Reports - Coming Soon</div> },
      { path: 'settings', element: <div className="p-8 text-center">Money Trail Settings - Coming Soon</div> },
    ],
  },
  {
    path: '/smarthome',
    element: (
      <ProtectedRoute appId="smarthome">
        <PersistLastVisitedPage>
          <AppShell />
        </PersistLastVisitedPage>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <SmartHomeDashboard /> },
      { path: 'dashboard', element: <SmartHomeDashboard /> },
      { path: 'devices', element: <DevicesPage /> },
      { path: 'settings', element: <div className="p-8 text-center">Smart Home Settings - Coming Soon</div> },
    ],
  },
  {
    path: '/potatostock',
    element: (
      <ProtectedRoute appId="potatostock">
        <PersistLastVisitedPage>
          <AppShell />
        </PersistLastVisitedPage>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <PotatoStockDashboard /> },
      { path: 'dashboard', element: <PotatoStockDashboard /> },
      { path: 'inventory', element: <StockList /> },
      { path: 'inventory/new', element: <StockForm /> },
      { path: 'inventory/:id', element: <StockForm /> },
      { path: 'inventory/edit/:id', element: <StockForm /> },
      { path: 'inventory/transfer', element: <TransferPage /> },
      { path: 'inventory/price-update', element: <PriceUpdatePage /> },
      { path: 'settings', element: <div className="p-8 text-center">Potato Stock Settings - Coming Soon</div> },
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
