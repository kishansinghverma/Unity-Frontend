import React from 'react';
import { Menu, Search, Bell, User, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { currentApp } = useApp();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 mr-4 rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>
        
        <div className="hidden md:flex items-center">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            {currentApp?.name}
          </h1>
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