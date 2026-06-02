import { Bell, ChevronDown, LogIn, LogOut, Menu, User } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

interface HeaderProps {
  pageActions?: React.ReactNode;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ pageActions, sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
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
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4">
      <div className="flex min-w-0 flex-1 items-center">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 mr-4 rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Menu className="h-6 w-6 text-gray-600" />
        </button>
        <div className="min-w-0 flex-1">{pageActions}</div>
      </div>

      <div className="flex shrink-0 items-center space-x-3 pl-3">
        <button className="rounded-full bg-gray-100 p-2 transition-colors duration-200 hover:bg-gray-200">
          <Bell className="h-5 w-5 text-gray-600" />
        </button>
        <div className="relative" ref={profileDropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen((previous) => !previous)}
            className="flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-gray-100"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
              <User className="h-4 w-4" />
            </span>
            <ChevronDown className="h-4 w-4 text-gray-600" />
          </button>
          {profileDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-md border border-gray-200 bg-white p-2 shadow-lg">
              <div className="mb-2 border-b border-gray-200 px-3 py-2">
                <p className="text-sm font-medium text-gray-700">Kishan Singh</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <button
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setProfileDropdownOpen(false)}
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </button>
              {isAuthenticated ? (
                <button
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </button>
              ) : (
                <button
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-blue-600 hover:bg-blue-50"
                  onClick={handleSignIn}
                >
                  <LogIn className="h-4 w-4" />
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
