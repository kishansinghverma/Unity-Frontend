import React from 'react';
import { User, ShoppingCart, Clock, Package } from 'lucide-react';
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
    icon: <User className="h-4 w-4 text-blue-600" />,
    title: 'New customer registered',
    description: 'Jane Smith created an account',
    time: '5 minutes ago',
  },
  {
    id: '2',
    icon: <ShoppingCart className="h-4 w-4 text-green-600" />,
    title: 'New order placed',
    description: 'Order #38294 from Apple Inc.',
    time: '1 hour ago',
  },
  {
    id: '3',
    icon: <Package className="h-4 w-4 text-purple-600" />,
    title: 'Product updated',
    description: 'iPhone 13 Pro stock increased by 50',
    time: '3 hours ago',
  },
  {
    id: '4',
    icon: <ShoppingCart className="h-4 w-4 text-green-600" />,
    title: 'New order placed',
    description: 'Order #38293 from Microsoft Corp.',
    time: '5 hours ago',
  },
  {
    id: '5',
    icon: <Clock className="h-4 w-4 text-orange-600" />,
    title: 'Status update',
    description: 'Order #38288 changed to shipped',
    time: '1 day ago',
  },
];

const RecentActivity: React.FC = () => {
  return (
    <Card title="Recent Activity" className="h-full">
      <div className="space-y-4">
        {mockActivities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0 rounded-full p-2 bg-gray-100 dark:bg-gray-700">
              {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {activity.title}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {activity.description}
              </p>
            </div>
            <div className="flex-shrink-0">
              <p className="text-xs text-gray-500 dark:text-gray-400">
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