import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, LayoutDashboard, Settings, BarChart3, User, ClipboardList, ListChecks, FileCheck, UserSquare, Wheat, LogIn, DollarSign, CandlestickChart } from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { selectCurrentApp } from '../../store/slices/appSlice';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const location = useLocation();
  const currentApp = useAppSelector(selectCurrentApp);
  const { isAuthenticated, logout } = useAuth();

  // Define navigation items based on current app
  const getNavItems = () => {
    if (currentApp?.id === 'crud-app') {
      return [
        { name: 'New Gate Pass', path: '/emandi/gatepasses/new', icon: <ClipboardList className="w-5 h-5" /> },
        { name: 'Queued', path: '/emandi/gatepasses/queued', icon: <ListChecks className="w-5 h-5" /> },
        { name: 'Processed', path: '/emandi/gatepasses/processed', icon: <FileCheck className="w-5 h-5" /> },
        { name: 'Parties', path: '/emandi/parties', icon: <UserSquare className="w-5 h-5" /> },
        { name: 'Dashboard', path: '/emandi/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'Settings', path: '/emandi/settings', icon: <Settings className="w-5 h-5" /> },
      ];
    } else {
      return [
        { name: 'Overview', path: '/moneytrail', icon: <CandlestickChart className="w-5 h-5" /> },
        { name: 'Reports', path: '/moneytrail/reports', icon: <BarChart3 className="w-5 h-5" /> },
        { name: 'Settings', path: '/moneytrail/settings', icon: <Settings className="w-5 h-5" /> },
      ];
    }
  };

  const navItems = getNavItems();

  // Helper function to determine if a nav item should be active
  const isNavItemActive = (itemPath: string) => {
    // Default route logic
    if (itemPath === '/emandi/gatepasses/new' && (location.pathname === '/emandi' || location.pathname === '/emandi/gatepasses/new')) {
      return true;
    }
    
    // Other specific route logic
    if (itemPath === '/emandi/gatepasses/queued' && location.pathname === '/emandi/gatepasses') {
      return true;
    }
    
    return location.pathname === itemPath;
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-20 flex flex-col flex-shrink-0 w-64 max-h-screen overflow-hidden transition-all transform bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 lg:z-auto lg:static lg:w-72 ${
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <span className="h-8 w-8 bg-green-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xl">U</span>
          </span>
          <span className="text-xl font-semibold text-gray-800 dark:text-white">Unity Hub</span>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="p-1 rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <nav className="px-4 py-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">Navigation</h3>
          <div className="mt-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isNavItemActive(item.path)
                    ? 'bg-blue-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {isAuthenticated ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">John Doe</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Link 
              to="/"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 px-3 py-2"
            >
              <LogIn className="w-5 h-5" />
              <span>Sign in</span>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;