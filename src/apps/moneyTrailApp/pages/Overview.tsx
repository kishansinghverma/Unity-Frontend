import { useState } from 'react';
import { Archive, Star, Trash2, RefreshCw } from 'lucide-react';
import { SwipeableList } from '../components/SwipeableList';
import { TaskModal } from '../components/TaskModal';
import { mockRecords, RecordItem } from '../data/mockData';

function Overview() {
  const [upcomingTasks, setUpcomingTasks] = useState<RecordItem[]>(
    mockRecords.filter((_, index) => index < 2)
  );

  const [todaysEvents, setTodaysEvents] = useState<RecordItem[]>(
    mockRecords.filter((_, index) => index >= 2 && index < 5)
  );

  const [eveningPlans, setEveningPlans] = useState<RecordItem[]>(
    mockRecords.filter((_, index) => index >= 5)
  );

  const [selectedTask, setSelectedTask] = useState<RecordItem | null>(null);

  const handleDelete = (id: string, listType: 'upcoming' | 'today' | 'evening') => {
    switch (listType) {
      case 'upcoming':
        setUpcomingTasks(upcomingTasks.filter(record => record.id !== id));
        break;
      case 'today':
        setTodaysEvents(todaysEvents.filter(record => record.id !== id));
        break;
      case 'evening':
        setEveningPlans(eveningPlans.filter(record => record.id !== id));
        break;
    }
  };

  const handleAction = (id: string, action: string) => {
    console.log(`Performed ${action} on item ${id}`);
    // In a real app, you would handle the action here
  };

  const resetAllLists = () => {
    setUpcomingTasks(mockRecords.filter((_, index) => index < 2));
    setTodaysEvents(mockRecords.filter((_, index) => index >= 2 && index < 5));
    setEveningPlans(mockRecords.filter((_, index) => index >= 5));
  };

  const handleTaskClick = (task: RecordItem) => {
    setSelectedTask(task);
  };

  // Updated header style to match table header
  const headerStyle = "text-sm font-medium text-gray-700 dark:text-gray-300 px-4 py-3 bg-gray-200 dark:bg-gray-700";

  const renderSwipeableList = (items: RecordItem[], listType: 'upcoming' | 'today' | 'evening') => (
    <SwipeableList className="overflow-hidden divide-y divide-gray-200 dark:divide-gray-700">
      {items.map((record) => (
        <SwipeableList.Item
          key={record.id}
          id={record.id}
          className="group"
          actions={[
            {
              icon: Archive,
              color: 'blue',
              label: 'Archive',
              onClick: () => handleAction(record.id, 'archive'),
            },
            {
              icon: Star,
              color: 'orange',
              label: 'Star',
              onClick: () => handleAction(record.id, 'star'),
            },
            {
              icon: Trash2,
              color: 'red',
              label: 'Delete',
              onClick: () => handleDelete(record.id, listType),
            },
          ]}
        >
          <div 
            className="px-4 py-3 flex items-center bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            onClick={() => handleTaskClick(record)}
          >
            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-base mr-2">
              {record.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-300 truncate">{record.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{record.subtitle}</p>
            </div>
            <div className="ml-2 flex-shrink-0">
              <span className="text-xs text-gray-500 dark:text-gray-400">{record.date}</span>
            </div>
          </div>
        </SwipeableList.Item>
      ))}
      {items.length === 0 && (
        <li className="py-6 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
          <Archive size={24} className="mb-2" />
          <p className="text-sm text-center">No items</p>
        </li>
      )}
    </SwipeableList>
  );

  const renderListSection = (title: string, items: RecordItem[], listType: 'upcoming' | 'today' | 'evening') => (
    <>
      <h2 className={headerStyle}>{title}</h2>
      {renderSwipeableList(items, listType)}
    </>
  );

  const isAnyListEmpty = upcomingTasks.length === 0 || todaysEvents.length === 0 || eveningPlans.length === 0;

  return (
    <main className="max-w-full w-full px-2 py-4 bg-gray-50 dark:bg-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-auto">
        {/* Upcoming Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md dark:shadow-black/10 overflow-hidden self-start">
          {renderListSection("Upcoming Tasks", upcomingTasks, 'upcoming')}
        </div>

        {/* Today's Events */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md dark:shadow-black/10 overflow-hidden self-start">
          {renderListSection("Today's Events", todaysEvents, 'today')}
        </div>

        {/* Evening Plans */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md dark:shadow-black/10 overflow-hidden self-start">
          {renderListSection("Evening Plans", eveningPlans, 'evening')}
        </div>
      </div>

      {isAnyListEmpty && (
        <div className="mt-6 flex justify-center">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-full text-sm flex items-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors border border-gray-300 dark:border-gray-600"
            onClick={resetAllLists}
          >
            <RefreshCw size={14} />
            <span>Reset All Lists</span>
          </button>
        </div>
      )}

      {/* Task Modal */}
      <TaskModal 
        task={selectedTask} 
        onClose={() => setSelectedTask(null)} 
      />
    </main>
  );
}

export default Overview;