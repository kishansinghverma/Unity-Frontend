import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { ReviewModal } from '../components/modals/bankReview/ReviewModal';
import { RecordItem } from '../engine/models/types';

function Dashboard() {
  const [selectedTransaction, setSelectedTransaction] = useState<RecordItem | null>(null);

  const mockRecords: any[] = []
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

      <div className="mt-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {mockRecords.map((record) => (
                <tr
                  key={record.id}
                  onClick={() => setSelectedTransaction(record)}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        {record.icon}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{record.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{record.subtitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-green-500 font-semibold">₹1000.00</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {record.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-full text-sm flex items-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors border border-gray-300 dark:border-gray-600">
          <RefreshCw size={14} />
          <span>Refresh Dashboard</span>
        </button>
      </div>

      {/* {selectedTransaction && (
        <ReviewModal
          item={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )} */}
    </main>
  );
}

export default Dashboard;
