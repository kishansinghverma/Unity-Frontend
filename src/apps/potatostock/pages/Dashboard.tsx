import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp, Warehouse, Scale, Tags, Package } from 'lucide-react';
import Card from '../../../components/ui/Card';
import StockStats from '../components/StockStats';
import RecentActivity from '../components/RecentActivity';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 p-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
      {/* Header Section */}
      <section>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1">Potato Stock Manager</h1>
        <p className="text-slate-500 dark:text-slate-400">Track and manage your potato inventory efficiently</p>
      </section>

      {/* Stats Section */}
      <section>
        <StockStats />
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Overview */}
        <div className="lg:col-span-2">
          <Card title="Inventory Overview" className="h-full">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-slate-800 dark:text-white">125,000 kg</div>
                  <div className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>+5.2% from last month</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1.5 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                    Weekly
                  </button>
                  <button className="px-3 py-1.5 text-sm font-medium bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md transition-colors">
                    Monthly
                  </button>
                  <button className="px-3 py-1.5 text-sm font-medium bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md transition-colors">
                    Yearly
                  </button>
                </div>
              </div>
              <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg">
                <BarChart3 className="h-12 w-12 text-slate-400" />
                <span className="ml-2 text-slate-500 dark:text-slate-400">Stock trend visualization</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <RecentActivity />
        </div>
      </div>
      
      {/* Quick Actions */}
      <section>
        <Card title="Quick Actions">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              to="/potatostock/stock/new" 
              className="group flex items-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md dark:shadow-slate-700/50 hover:transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="p-3 rounded-full bg-green-50 dark:bg-green-900/30 group-hover:bg-green-100 dark:group-hover:bg-green-800/40 transition-colors">
                <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Add Stock</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Record new inventory</p>
              </div>
            </Link>

            <Link 
              to="/potatostock/stock/transfer" 
              className="group flex items-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md dark:shadow-slate-700/50 hover:transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/40 transition-colors">
                <Warehouse className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Transfer</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Move between locations</p>
              </div>
            </Link>

            <Link 
              to="/potatostock/stock/price" 
              className="group flex items-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md dark:shadow-slate-700/50 hover:transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="p-3 rounded-full bg-purple-50 dark:bg-purple-900/30 group-hover:bg-purple-100 dark:group-hover:bg-purple-800/40 transition-colors">
                <Tags className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Update Price</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage pricing</p>
              </div>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;
