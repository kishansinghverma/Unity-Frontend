import { Bell, ChevronDown, LogIn, LogOut, Menu, Search, User } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppSelector } from '../../store/hooks';
import { selectCurrentApp } from '../../store/slices/appSlice';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const currentApp = useAppSelector(selectCurrentApp);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/', { replace: true });
  };

  const handleSignIn = () => {
    setProfileDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 mr-4 rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">{currentApp?.name ?? 'Unity Hub'}</h1>
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
        <div className="relative" ref={profileDropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen((previous) => !previous)}
            className="flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
              <User className="w-4 h-4" />
            </span>
            <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
          {profileDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-md border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-2 border-b border-gray-200 px-3 py-2 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Kishan Singh</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
              </div>
              <button
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={() => setProfileDropdownOpen(false)}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
              {isAuthenticated ? (
                <button
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              ) : (
                <button
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
                  onClick={handleSignIn}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign in</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;