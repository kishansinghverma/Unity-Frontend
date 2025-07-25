import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectCurrentApp } from '../../store/slices/appSlice';

const AppShell: React.FC = () => {
  const currentApp = useAppSelector(selectCurrentApp);
  const dispatch = useAppDispatch();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);


  // Display a loading state until the app is set
  if (!currentApp) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
