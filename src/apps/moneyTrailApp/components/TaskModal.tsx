import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { RecordItem } from '../data/mockData';

interface TaskModalProps {
  task: RecordItem | null;
  onClose: () => void;
}

export function TaskModal({ task, onClose }: TaskModalProps) {
  if (!task) return null;

  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // Close on ESC key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  // Example mock data for demonstration (replace with real data as needed)
  const bankTransaction = {
    date: '24/Feb/2025',
    description: 'NEFT CR-BOFA0MM6205-ACCENTURE SOLUTIONS PVT LTD -SIN...',
    fullDescription: 'NEFT CR-BOFA0MM6205-ACCENTURE SOLUTIONS PVT LTD -SINGH KISHAN-BOFAN52025022401533583',
    utr: 'BOFAN52025022401533583',
    recipient: 'SINGH KISHAN',
    location: 'Office',
    bank: 'HDFC',
    amount: 1000,
  };

  return (
    // Modal overlay - handles outside clicks
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center"
      onClick={handleOverlayClick}
    >
      {/* Modal content */}
      <div 
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl m-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with Close Button */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Review Bank Transaction
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Three Columns Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* Bank Transaction Column */}
          <div>
            <h3 className="text-base font-medium mb-3">Bank Transaction</h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="bg-white dark:bg-gray-800 rounded p-2 border border-gray-200 dark:border-gray-600 mb-2 text-center">
                    <div className="text-xs text-gray-500">Feb</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-gray-100">24</div>
                  </div>
                  <div className="w-10 h-10 flex items-center justify-center bg-red-100 rounded">
                    <img src="/hdfc-logo.png" alt="HDFC" className="w-8 h-8" />
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-900 dark:text-gray-100 font-medium">{bankTransaction.description}</div>
                  <div className="text-lg font-semibold text-green-500 mt-1">₹{bankTransaction.amount.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* PhonePe Transactions Column */}
          <div>
            <h3 className="text-base font-medium mb-3">PhonePe Transactions</h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 h-[120px] flex items-center justify-center">
              <span className="text-gray-500">No Transaction Identified.</span>
            </div>
          </div>

          {/* Draft Transactions Column */}
          <div>
            <h3 className="text-base font-medium mb-3">Draft Transactions</h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 h-[120px] flex items-center justify-center">
              <span className="text-gray-500">No Transaction Identified.</span>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="px-6 pb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">UTR / Transaction #</th>
                  <th className="px-4 py-3">Recipient</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Bank</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-4 text-sm">{bankTransaction.date}</td>
                  <td className="px-4 py-4 text-sm">{bankTransaction.fullDescription}</td>
                  <td className="px-4 py-4 text-sm">{bankTransaction.utr}</td>
                  <td className="px-4 py-4 text-sm">{bankTransaction.recipient}</td>
                  <td className="px-4 py-4 text-sm">{bankTransaction.location}</td>
                  <td className="px-4 py-4 text-sm">{bankTransaction.bank}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center">
                        <span className="text-gray-500">₹</span>
                        <input
                          type="text"
                          value={bankTransaction.amount}
                          className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-right"
                        />
                      </div>
                      <select className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm">
                        <option>Settlement</option>
                      </select>
                      <button className="px-4 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm font-medium">
                        Approve
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
