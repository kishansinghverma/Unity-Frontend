import React from 'react';
import { Package, ArrowDownUp, Clock, Truck } from 'lucide-react';
import Card from '../../../components/ui/Card';

interface ActivityItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    icon: <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
    title: 'New stock added',
    description: '2000 kg Red Potato received',
    time: '5 minutes ago',
  },
  {
    id: '2',
    icon: <ArrowDownUp className="h-4 w-4 text-green-600 dark:text-green-400" />,
    title: 'Stock transferred',
    description: '500 kg moved to Warehouse B',
    time: '1 hour ago',
  },
  {
    id: '3',
    icon: <Truck className="h-4 w-4 text-purple-600 dark:text-purple-400" />,
    title: 'Dispatch completed',
    description: '1000 kg shipped to client',
    time: '3 hours ago',
  },
  {
    id: '4',
    icon: <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />,
    title: 'Price updated',
    description: 'White Potato price updated to ₹22/kg',
    time: '1 day ago',
  }
];

const RecentActivity: React.FC = () => {
  return (
    <Card title="Recent Activity" className="h-full">
      <div className="space-y-4">
        {mockActivities.map((activity) => (
          <div 
            key={activity.id} 
            className="group flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200"
          >
            <div className="flex-shrink-0 p-2 rounded-full bg-slate-100 dark:bg-slate-700 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
              {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                {activity.title}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {activity.description}
              </p>
            </div>
            <div className="flex-shrink-0">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentActivity;
