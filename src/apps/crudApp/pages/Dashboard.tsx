import React from 'react';
import { Link } from 'react-router-dom';
import DashboardStats from '../components/DashboardStats';
import RecentActivity from '../components/RecentActivity';
import Card from '../../../components/ui/Card';
import { BarChart3, TrendingUp, ClipboardList } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Welcome back! Here's an overview of your business.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <div className="inline-flex rounded-md shadow-sm">
            <button className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
              This Week
            </button>
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 -ml-px">
              This Month
            </button>
            <button className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 -ml-px">
              This Year
            </button>
          </div>
        </div>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Revenue Overview" className="h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-3xl font-bold text-gray-800 dark:text-white">$28,456</div>
                <div className="text-sm text-green-600 dark:text-green-400 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>+14.5% from last month</span>
                </div>
              </div>
              <div className="inline-flex shadow-sm rounded-md">
                <button className="px-3 py-1 text-xs font-medium rounded-l-md bg-blue-600 text-white hover:bg-blue-700">Daily</button>
                <button className="px-3 py-1 text-xs font-medium bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 border-t border-b border-gray-300 dark:border-gray-600">Weekly</button>
                <button className="px-3 py-1 text-xs font-medium rounded-r-md bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600">Monthly</button>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-md">
              <BarChart3 className="h-12 w-12 text-gray-400" />
              <span className="ml-2 text-gray-500 dark:text-gray-400">Chart visualization goes here</span>
            </div>
          </Card>
        </div>

        <div>
          <RecentActivity />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Quick Actions">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/emandi/parties/new" 
              className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-md">
                <ClipboardList className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">New Party</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Add a new party to your database</p>
              </div>
            </Link>
            
            <Link 
              to="/emandi/gatepass/new" 
              className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-md">
                <ClipboardList className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">नया गेटपास</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Create a new gate pass for vendors</p>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;