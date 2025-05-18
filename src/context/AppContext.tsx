import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { AppInfo } from '../types';
import { APPS } from '../constants/apps';

interface AppContextType {
  currentApp: AppInfo | null;
  setCurrentApp: (app: AppInfo) => void;
  availableApps: AppInfo[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentApp, setCurrentApp] = useState<AppInfo | null>(APPS[0] || null);
  const availableApps = useMemo(() => APPS, []);

  const value = useMemo(() => ({
    currentApp,
    setCurrentApp,
    availableApps,
  }), [currentApp, availableApps]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};