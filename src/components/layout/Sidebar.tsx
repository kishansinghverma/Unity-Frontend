import { ArrowRightLeft, BarChart3, CandlestickChart, ChevronUp, ClipboardList, DollarSign, DollarSign as PriceIcon, FileCheck, FileUp, Home, LayoutDashboard, ListChecks, ListFilter, Package, PlusCircle, Settings, Thermometer, UserSquare, Wheat, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { APPS } from '../../constants/apps';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectCurrentApp, setCurrentApp } from '../../store/slices/appSlice';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentApp = useAppSelector(selectCurrentApp);
  const [appsDropdownOpen, setAppsDropdownOpen] = useState(false);
  const appDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (appDropdownRef.current && !appDropdownRef.current.contains(event.target as Node)) {
        setAppsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Define navigation items based on current app
  const getNavItems = () => {
    if (currentApp?.id === 'emandi') {
      return [
        { name: 'New Gate Pass', path: '/emandi/gatepasses/new', icon: <ClipboardList className="w-5 h-5" /> },
        { name: 'Queued', path: '/emandi/gatepasses/queued', icon: <ListChecks className="w-5 h-5" /> },
        { name: 'Processed', path: '/emandi/gatepasses/processed', icon: <FileCheck className="w-5 h-5" /> },
        { name: 'Parties', path: '/emandi/parties', icon: <UserSquare className="w-5 h-5" /> },
        { name: 'Dashboard', path: '/emandi/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'Settings', path: '/emandi/settings', icon: <Settings className="w-5 h-5" /> },
      ];
    } else if (currentApp?.id === 'moneytrail') {
      return [
        { name: 'Dashboard', path: '/moneytrail/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'Review', path: '/moneytrail/review', icon: <ListChecks className="w-5 h-5" /> },
        { name: 'Import', path: '/moneytrail/import', icon: <FileUp className="w-5 h-5" /> },
        { name: 'Settings', path: '/moneytrail/settings', icon: <Settings className="w-5 h-5" /> },
      ];
    } else if (currentApp?.id === 'smarthome') {
      return [
        { name: 'Dashboard', path: '/smarthome', icon: <Home className="w-5 h-5" /> },
        { name: 'Devices', path: '/smarthome/devices', icon: <Thermometer className="w-5 h-5" /> },
        { name: 'Settings', path: '/smarthome/settings', icon: <Settings className="w-5 h-5" /> },
      ];
    } else if (currentApp?.id === 'potatostock') {
      return [
        { name: 'Dashboard', path: '/potatostock', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'View Inventory', path: '/potatostock/inventory', icon: <ListFilter className="w-5 h-5" /> },
        { name: 'Add Stock', path: '/potatostock/inventory/new', icon: <PlusCircle className="w-5 h-5" /> },
        { name: 'Transfer Stock', path: '/potatostock/inventory/transfer', icon: <ArrowRightLeft className="w-5 h-5" /> },
        { name: 'Update Prices', path: '/potatostock/inventory/price-update', icon: <PriceIcon className="w-5 h-5" /> },
        { name: 'Settings', path: '/potatostock/settings', icon: <Settings className="w-5 h-5" /> },
      ];
    }
    return [];
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

  const getAppIcon = (icon: string) => {
    switch (icon) {
      case 'LayoutDashboard': return <LayoutDashboard className="h-5 w-5" />;
      case 'BarChart3': return <BarChart3 className="h-5 w-5" />;
      case 'Wheat': return <Wheat className="h-5 w-5" />;
      case 'DollarSign': return <DollarSign className="h-5 w-5" />;
      case 'ChartCandlestick': return <CandlestickChart className="h-5 w-5" />;
      case 'Home': return <Home className="h-5 w-5" />;
      case 'Package': return <Package className="h-5 w-5" />;
      default: return <LayoutDashboard className="h-5 w-5" />;
    }
  };

  const getAppIconBadgeClass = (icon: string) => {
    switch (icon) {
      case 'Wheat': return 'bg-green-600';
      case 'Home': return 'bg-rose-600';
      case 'ChartCandlestick': return 'bg-purple-800';
      case 'Package': return 'bg-amber-500/80';
      default: return 'bg-mist-700';
    }
  };

  const handleAppChange = (appId: string) => {
    const app = APPS.find((value) => value.id === appId);
    if (!app) return;

    dispatch(setCurrentApp(app));
    setAppsDropdownOpen(false);
    navigate(`/${app.id}`);
  };

  return (
    <aside className={`fixed inset-y-0 left-0 z-30 flex flex-col flex-shrink-0 w-64 max-h-screen overflow-visible transition-all transform bg-white border-r border-gray-200 lg:relative lg:z-30 lg:w-72 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 h-16">
        <div className="flex items-center space-x-2">
          <span className="h-8 w-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-md flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-xl drop-shadow-sm">U</span>
          </span>
          <span className="text-xl font-semibold text-gray-800">Unity Hub</span>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="p-1 rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="px-4 py-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase">Navigation</h3>
          <div className="mt-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isNavItemActive(item.path)
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>

      <div className="border-t border-gray-200 p-3">
        <div className="relative" ref={appDropdownRef}>
          <button
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-gray-100"
            onClick={() => setAppsDropdownOpen((previous) => !previous)}
          >
            <span className={`flex h-8 w-8 shrink-0 aspect-square items-center justify-center rounded-md text-white ${getAppIconBadgeClass(currentApp?.icon || 'LayoutDashboard')}`}>
              {getAppIcon(currentApp?.icon || 'LayoutDashboard')}
            </span>
            <span className="flex-1 min-w-0 truncate text-md text-gray-600 font-medium">{currentApp?.name ?? 'Select App'}</span>
            <ChevronUp className="h-4 w-4 text-gray-500" />
          </button>
          {appsDropdownOpen && (
            <div className="absolute bottom-full left-0 right-0 z-50 mb-2 rounded-md border border-gray-200 bg-white p-2 shadow-lg">
              <p className="px-3 py-2 text-xs font-semibold uppercase text-gray-500">Apps</p>
              <div className="mt-1 space-y-1">
                {APPS.map((app) => (
                  <button
                    key={app.id}
                    className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${currentApp?.id === app.id ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    onClick={() => handleAppChange(app.id)}
                  >
                    {getAppIcon(app.icon)}
                    <span className="ml-3">{app.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
