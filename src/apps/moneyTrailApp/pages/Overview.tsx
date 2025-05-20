import React, { useState } from 'react';
import { Calendar, ShoppingCart, Phone, Users, Dumbbell, Coffee, Book } from 'lucide-react';

interface ListItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
}

// Sample data for three different list sections
const upcomingTasks: ListItem[] = [
  {
    id: '1',
    icon: <Calendar className="w-6 h-6 text-red-500" />,
    title: 'Meeting with Alex',
    description: 'Discuss project timeline',
    time: '9:30 AM'
  },
  {
    id: '2',
    icon: <ShoppingCart className="w-6 h-6 text-green-500" />,
    title: 'Grocery shopping',
    description: 'Vegetables, fruits, and milk',
    time: '11:00 AM'
  },
  {
    id: '3',
    icon: <Phone className="w-6 h-6 text-blue-500" />,
    title: 'Call Mom',
    description: 'Birthday wishes',
    time: '1:30 PM'
  },
];

const todayEvents: ListItem[] = [
  {
    id: '4',
    icon: <Users className="w-6 h-6 text-purple-500" />,
    title: 'Team standup',
    description: 'Daily progress update',
    time: '2:15 PM'
  },
  {
    id: '5',
    icon: <Dumbbell className="w-6 h-6 text-yellow-500" />,
    title: 'Gym workout',
    description: 'Chest and triceps day',
    time: '5:00 PM'
  },
];

const eveningPlans: ListItem[] = [
  {
    id: '6',
    icon: <Coffee className="w-6 h-6 text-orange-500" />,
    title: 'Dinner with Sarah',
    description: 'At Italian Bistro',
    time: '7:30 PM'
  },
  {
    id: '7',
    icon: <Book className="w-6 h-6 text-indigo-500" />,
    title: 'Read book',
    description: 'Chapter 5-7',
    time: '9:00 PM'
  },
];

const Overview: React.FC = () => {
  const [swipedItemId, setSwipedItemId] = useState<string | null>(null);

  const handleSwipe = (id: string) => {
    if (swipedItemId === id) {
      setSwipedItemId(null);
    } else {
      setSwipedItemId(id);
    }
  };

  const handleArchive = (id: string) => {
    console.log(`Archive item ${id}`);
    setSwipedItemId(null);
  };

  const handleStar = (id: string) => {
    console.log(`Star item ${id}`);
    setSwipedItemId(null);
  };

  const handleDelete = (id: string) => {
    console.log(`Delete item ${id}`);
    setSwipedItemId(null);
  };

  // Component for rendering a single list item with swipe actions
  const ListItemComponent: React.FC<{ item: ListItem }> = ({ item }) => {
    const isActive = swipedItemId === item.id;
    
    return (
      <div className="relative overflow-hidden border-b border-gray-100">
        <div
          className={`flex items-center p-4 bg-white transition-transform ${isActive ? 'transform -translate-x-40' : ''}`}
          onClick={() => handleSwipe(item.id)}
        >
          <div className="flex-shrink-0 w-12 h-12 mr-4 bg-gray-100 rounded-full flex items-center justify-center">
            {item.icon}
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-medium text-gray-800">{item.title}</h3>
            <p className="text-gray-500">{item.description}</p>
          </div>
          <div className="flex-shrink-0 ml-4 text-gray-400">{item.time}</div>
        </div>
        {isActive && (
          <div className="absolute inset-y-0 right-0 flex">
            <button 
              onClick={() => handleArchive(item.id)}
              className="w-20 h-full bg-blue-500 flex flex-col items-center justify-center text-white"
            >
              <div className="text-2xl mb-1">📨</div>
              <span className="text-sm">Archive</span>
            </button>
            <button 
              onClick={() => handleStar(item.id)}
              className="w-20 h-full bg-orange-500 flex flex-col items-center justify-center text-white"
            >
              <div className="text-2xl mb-1">⭐</div>
              <span className="text-sm">Star</span>
            </button>
            <button 
              onClick={() => handleDelete(item.id)}
              className="w-20 h-full bg-red-500 flex flex-col items-center justify-center text-white"
            >
              <div className="text-2xl mb-1">🗑️</div>
              <span className="text-sm">Delete</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  // Component for rendering a list section with title
  const ListSection: React.FC<{ title: string; items: ListItem[] }> = ({ title, items }) => {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-bold px-4 py-2 bg-purple-800 text-white">{title}</h2>
        <div className="bg-white rounded-md shadow">
          {items.length > 0 ? (
            items.map(item => <ListItemComponent key={item.id} item={item} />)
          ) : (
            <div className="p-6 text-center text-gray-500">No items in this section</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">MoneyTrail Dashboard</h1>
      
      <div className="bg-gray-50 p-2 text-center text-gray-500 mb-4 rounded">
        Swipe right on an item to see actions
      </div>
      
      <ListSection title="Upcoming Tasks" items={upcomingTasks} />
      <ListSection title="Today's Events" items={todayEvents} />
      <ListSection title="Evening Plans" items={eveningPlans} />
    </div>
  );
};

export default Overview; 