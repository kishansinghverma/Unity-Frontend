import React from 'react';
import { Link } from 'react-router-dom';
import DashboardStats from '../components/DashboardStats';
import RecentActivity from '../components/RecentActivity';
import Card from '../../../components/ui/Card';
import { BarChart3, TrendingUp, ClipboardList, UserSquare, ChevronRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <section>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1">Welcome Back!</h1>
        <p className="text-slate-500 dark:text-slate-400">Here's an overview of your business today.</p>
      </section>

      {/* Stats Section */}
      <section>
        <DashboardStats />
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Overview */}
        <div className="lg:col-span-2">
          <Card title="Revenue Overview" className="h-full">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-slate-800 dark:text-white">₹28,456</div>
                  <div className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>+14.5% from last month</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1.5 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                    Daily
                  </button>
                  <button className="px-3 py-1.5 text-sm font-medium bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md transition-colors">
                    Weekly
                  </button>
                  <button className="px-3 py-1.5 text-sm font-medium bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md transition-colors">
                    Monthly
                  </button>
                </div>
              </div>
              <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg">
                <BarChart3 className="h-12 w-12 text-slate-400" />
                <span className="ml-2 text-slate-500 dark:text-slate-400">Chart visualization goes here</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              to="/emandi/parties/new" 
              className="group flex items-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md dark:shadow-slate-700/50 hover:transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/40 transition-colors">
                <UserSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">New Party</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Add a new party to your database</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 dark:text-slate-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            
            <Link 
              to="/emandi/gatepasses/new" 
              className="group flex items-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md dark:shadow-slate-700/50 hover:transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="p-3 rounded-full bg-red-50 dark:bg-red-900/30 group-hover:bg-red-100 dark:group-hover:bg-red-800/40 transition-colors">
                <ClipboardList className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">New Gate Pass</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Create a new gate pass for vendors</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 dark:text-slate-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;
