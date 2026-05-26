import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { selectCurrentApp } from '../../store/slices/appSlice';
import Header from './Header';
import { HeaderSlotContext } from './headerSlot';
import Sidebar from './Sidebar';

const AppShell: React.FC = () => {
  const currentApp = useAppSelector(selectCurrentApp);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [headerActions, setHeaderActions] = React.useState<React.ReactNode | null>(null);
  const headerOwnerRef = React.useRef<symbol | null>(null);

  const headerSlotValue = React.useMemo(() => ({
    setContent: (owner: symbol, content: React.ReactNode | null) => {
      headerOwnerRef.current = owner;
      setHeaderActions(content);
    },
    clearContent: (owner: symbol) => {
      if (headerOwnerRef.current === owner) {
        headerOwnerRef.current = null;
        setHeaderActions(null);
      }
    },
  }), []);

  // Display a loading state until the app is set
  if (!currentApp) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <HeaderSlotContext.Provider value={headerSlotValue}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <div className="flex flex-col flex-1 overflow-hidden">
          <Header pageActions={headerActions} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </HeaderSlotContext.Provider>
  );
};

export default AppShell;
