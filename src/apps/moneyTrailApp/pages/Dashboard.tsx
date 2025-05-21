import { RefreshCw } from 'lucide-react';
import { mockRecords } from '../data/mockData';

function Dashboard() {
  const totalTasks = mockRecords.length;
  const completedTasks = Math.floor(totalTasks * 0.6); // Example: 60% completed
  const pendingTasks = totalTasks - completedTasks;

  const stats = [
    { label: 'Total Tasks', value: totalTasks },
    { label: 'Completed Tasks', value: completedTasks },
    { label: 'Pending Tasks', value: pendingTasks },
  ];

  return (
    <main className="max-w-full w-full px-2 py-4 bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md dark:shadow-black/10 overflow-hidden p-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex flex-col items-center justify-center"
            >
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{stat.label}</h2>
              <p className="text-2xl font-bold text-blue-500 dark:text-blue-400">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-full text-sm flex items-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors border border-gray-300 dark:border-gray-600"
        >
          <RefreshCw size={14} />
          <span>Refresh Dashboard</span>
        </button>
      </div>
    </main>
  );
}

export default Dashboard;
