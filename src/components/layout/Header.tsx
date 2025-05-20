import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, User, ChevronDown, LayoutDashboard, BarChart3 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { APPS } from '../../constants/apps';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { currentApp, setCurrentApp } = useApp();
  const [appsDropdownOpen, setAppsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAppsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'LayoutDashboard': return <LayoutDashboard className="w-5 h-5" />;
      case 'BarChart3': return <BarChart3 className="w-5 h-5" />;
      default: return <LayoutDashboard className="w-5 h-5" />;
    }
  };

  const handleAppChange = (appId: string) => {
    const app = APPS.find(a => a.id === appId);
    if (app) {
      setCurrentApp(app);
      setAppsDropdownOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 mr-4 rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setAppsDropdownOpen(!appsDropdownOpen)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="flex items-center space-x-2">
              <span className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </span>
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                {currentApp?.name}
              </h1>
              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
          </button>
          
          {appsDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-20">
              <div className="p-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400 px-3 py-2">Apps</h3>
                <div className="mt-1 space-y-1">
                  {APPS.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => handleAppChange(app.id)}
                      className={`flex items-center px-3 py-2 w-full rounded-md text-sm font-medium transition-colors ${
                        currentApp?.id === app.id
                          ? 'bg-blue-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      {getIcon(app.icon)}
                      <span className="ml-3">{app.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Search..."
          />
        </div>
        
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        
        <div className="relative">
          <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">John Doe</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;