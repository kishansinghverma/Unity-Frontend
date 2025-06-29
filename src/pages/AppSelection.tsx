import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wheat, CandlestickChart, LogOut, Home, Package } from 'lucide-react';
import { APPS } from '../constants/apps';
import { useAuth } from '../context/AuthContext';
import { useAppDispatch } from '../store/hooks';
import { setCurrentApp } from '../store/slices/appSlice';

const getAppIcon = (iconName: string) => {
  switch (iconName) {
    case 'Wheat':
      return <Wheat className="w-8 h-8 text-yellow-600" />;
    case 'ChartCandlestick':
      return <CandlestickChart className="w-8 h-8 text-purple-600" />;
    case 'Home':
      return <Home className="w-8 h-8 text-blue-600" />;
    case 'Package':
      return <Package className="w-8 h-8 text-amber-700" />;
    default:
      return null;
  }
};

const AppSelection: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAppSelect = (app: typeof APPS[0]) => {
    // Set the current app in Redux store
    dispatch(setCurrentApp(app));
    
    // Navigate to the appropriate app path
    let appPath = '/';
    switch (app.id) {
      case 'emandi':
        appPath = '/emandi';
        break;
      case 'moneytrail':
        appPath = '/moneytrail';
        break;
      case 'smarthome':
        appPath = '/smarthome';
        break;
      case 'potatostock':
        appPath = '/potatostock';
        break;
    }
    navigate(appPath);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header with sign-out button */}
      <header className="w-full bg-white dark:bg-gray-800 shadow-md">
        <div className="w-full px-4 py-4 flex items-center justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-600 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign out</span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-start justify-center p-4 pt-24">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <div className="mx-auto h-20 w-20 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-4xl">U</span>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Unity Hub</h1>
            <p className="mt-2 text-xl text-gray-500 dark:text-gray-400">Select an application to continue</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {APPS.map((app) => {
              const appIcon = getAppIcon(app.icon);

              return (
                <button
                  key={app.id}
                  onClick={() => handleAppSelect(app)}
                  className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 text-left"
                >
                  <div className="flex items-center space-x-6">
                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      {appIcon}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{app.name}</h2>
                      <p className="mt-1 text-gray-500 dark:text-gray-400">{app.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSelection;
