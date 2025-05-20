import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAppSelector } from '../../store/hooks';
import { selectCurrentApp } from '../../store/slices/appSlice';

const AppShell: React.FC = () => {
  const currentApp = useAppSelector(selectCurrentApp);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  if (!currentApp) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
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