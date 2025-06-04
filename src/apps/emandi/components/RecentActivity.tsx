import React from 'react';
import { UserSquare, ClipboardList, Clock, ClipboardCheck } from 'lucide-react';
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
    icon: <UserSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
    title: 'New party added',
    description: 'Arjun Trading Company added',
    time: '5 minutes ago',
  },
  {
    id: '2',
    icon: <ClipboardList className="h-4 w-4 text-green-600 dark:text-green-400" />,
    title: 'New gate pass created',
    description: 'Gate pass #38294 for Yash Rawal',
    time: '1 hour ago',
  },
  {
    id: '3',
    icon: <ClipboardCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />,
    title: 'Gate pass processed',
    description: 'Gate pass #38291 marked as processed',
    time: '3 hours ago',
  },
  {
    id: '4',
    icon: <ClipboardList className="h-4 w-4 text-green-600 dark:text-green-400" />,
    title: 'New gate pass created',
    description: 'Gate pass #38293 for N.S',
    time: '5 hours ago',
  },
  {
    id: '5',
    icon: <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />,
    title: 'Status update',
    description: 'Gate pass #38288 changed to completed',
    time: '1 day ago',
  },
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
