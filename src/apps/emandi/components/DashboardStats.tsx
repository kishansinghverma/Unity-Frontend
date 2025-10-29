import React from 'react';
import { UserSquare, ClipboardList, ClipboardCheck, DollarSign } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  positive?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, positive = true }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg dark:shadow-slate-700/50 hover:shadow-xl dark:hover:shadow-slate-600/60 transition-shadow duration-300 flex items-center space-x-4">
      <div className={`p-3 rounded-full bg-opacity-10 ${positive ? 'bg-blue-500' : 'bg-red-500'} dark:bg-opacity-30`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
        <p className={`text-xs font-medium ${positive ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
          {change}
        </p>
      </div>
    </div>
  );
};

const DashboardStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Parties"
        value="328"
        change="+12% from last month"
        icon={<UserSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
        positive={true}
      />
      <StatCard
        title="Gate Passes"
        value="843"
        change="+8% from last month"
        icon={<ClipboardList className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
        positive={true}
      />
      <StatCard
        title="Processed Records"
        value="524"
        change="-3% from last month"
        icon={<ClipboardCheck className="h-6 w-6 text-red-600 dark:text-red-400" />}
        positive={false}
      />
      <StatCard
        title="Revenue"
        value="₹94,256"
        change="+18% from last month"
        icon={<DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
        positive={true}
      />
    </div>
  );
};

export default DashboardStats;
