import { CandlestickChart, Home, LogOut, Package, Wheat } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { APPS } from '../constants/apps';
import { useAuth } from '../context/AuthContext';
import { useAppDispatch } from '../store/hooks';
import { setCurrentApp } from '../store/slices/appSlice';

const getAppIcon = (iconName: string) => {
  switch (iconName) {
    case 'Wheat':
      return <Wheat className="w-8 h-8" />;
    case 'ChartCandlestick':
      return <CandlestickChart className="w-8 h-8" />;
    case 'Home':
      return <Home className="w-8 h-8" />;
    case 'Package':
      return <Package className="w-8 h-8" />;
    default:
      return null;
  }
};

const getAppIconBadgeClass = (iconName: string) => {
  switch (iconName) {
    case 'Wheat':
      return 'bg-green-600';
    case 'Home':
      return 'bg-rose-600';
    case 'ChartCandlestick':
      return 'bg-purple-800';
    case 'Package':
      return 'bg-amber-500/80';
    default:
      return 'bg-gray-700';
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
    navigate(`/${app.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header with sign-out button */}
      <header className="w-full bg-white shadow-md">
        <div className="w-full px-4 py-4 flex items-center justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-600 hover:text-red-500 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
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
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-4xl drop-shadow-sm">U</span>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">Unity Hub</h1>
            <p className="mt-2 text-xl text-gray-500">Select an application to continue</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {APPS.map((app) => {
              const appIcon = getAppIcon(app.icon);

              return (
                <button
                  key={app.id}
                  onClick={() => handleAppSelect(app)}
                  className="bg-white shadow-lg rounded-lg py-4 px-6 hover:shadow-xl transition-shadow duration-300 text-left"
                >
                  <div className="flex items-start gap-5">
                    <div className={`h-14 w-14 shrink-0 aspect-square rounded-md flex items-center justify-center text-white ${getAppIconBadgeClass(app.icon)}`}>
                      {appIcon}
                    </div>
                    <div className="flex flex-col justify-center h-14">
                      <h2 className="text-xl font-semibold text-gray-900">{app.name}</h2>
                      <p className="text-sm text-gray-500 truncate w-80">{app.description}</p>
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
