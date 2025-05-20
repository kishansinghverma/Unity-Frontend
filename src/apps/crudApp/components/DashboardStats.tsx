import React from 'react';
import { UserSquare, ClipboardList, ClipboardCheck, DollarSign } from 'lucide-react';
import Card from '../../../components/ui/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  positive?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, positive = true }) => {
  return (
    <Card className="flex items-center">
      <div className="mr-4 p-3 rounded-full bg-blue-100 dark:bg-blue-900">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-semibold text-gray-800 dark:text-white">{value}</p>
        <p className={`text-xs ${positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {change}
        </p>
      </div>
    </Card>
  );
};

const DashboardStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Parties"
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
        icon={<ClipboardCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
        positive={false}
      />
      <StatCard
        title="Revenue"
        value="$94,256"
        change="+18% from last month"
        icon={<DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
        positive={true}
      />
    </div>
  );
};

export default DashboardStats;