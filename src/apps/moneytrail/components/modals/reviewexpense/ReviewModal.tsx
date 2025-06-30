import { useState, useEffect } from 'react';
import { X, CreditCard, Smartphone, FileText, Check } from 'lucide-react';
import { TransactionItem } from './PhonePeListItem';
import TransactionCard from './TransactionCard';
import { LocationHistoryData, LocationHistoryItem } from './DraftListItem';
import React from 'react';
import { ReviewModalProps } from '../../../commons/types';
import { getDraftMatches, getPhonePeMatches } from '../../../commons/utils';
import { useAppSelector } from '../../../../../store/hooks';


export function ReviewModal({ itemId, onClose }: ReviewModalProps) {
  if (!itemId) return null;

  const bankEntries = useAppSelector(state => state.moneytrail.bankEntries).contents;
  const phonepeEntries = useAppSelector(state => state.moneytrail.phonepeEntries).contents;
  const draftEntries = useAppSelector(state => state.moneytrail.draftEntries).contents;

  const [location, setLocation] = useState('Settlement');
  const [amount, setAmount] = useState('1000');
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

  useEffect(() => {
    const updateHeight = () => {
      const firstColumn = document.querySelector('[data-first-column]');
      if (firstColumn) {
        const height = firstColumn.clientHeight;
        document.documentElement.style.setProperty('--first-col-height', `${height}px`);
      }
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    const firstColumn = document.querySelector('[data-first-column]');
    if (firstColumn) {
      observer.observe(firstColumn);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const bankEntry = bankEntries.find(entry => entry._id === itemId) ?? bankEntries[0];
  const phonepeMatches = getPhonePeMatches(bankEntry, phonepeEntries);
  const draftMatches = getDraftMatches(phonepeMatches[0], draftEntries);

  const handleSelectTransaction = (id: string) => {
    setSelectedTransactionId(prevId => prevId === id ? null : id);
  };

  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(null);

  return (
    // Modal overlay - handles outside clicks
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Modal Container */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Review Bank Transaction</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Review and approve your transactions</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="max-w-7xl mx-auto p-6">
            {/* Three Column Layout */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {/* Bank Transaction Column */}
              <div data-first-column className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Bank Transaction</h2>
                  </div>
                </div>
                <div className="p-4 flex-1 overflow-y-auto">
                  <TransactionCard {...bankEntry} />
                </div>
              </div>

              {/* PhonePe Transaction Column */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-[var(--first-col-height,auto)]">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">PhonePe Transactions</h2>
                  </div>
                </div>

                {phonepeMatches.length === 0 && (
                  <div className="p-4 flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">No Transaction Identified.</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PhonePe transactions will appear here</p>
                    </div>
                  </div>
                )}

                {phonepeMatches.length > 0 && (
                  <div className="p-4 flex-1 overflow-y-auto">
                    {phonepeMatches.map((transaction) => (
                      <TransactionItem
                        isSelected={selectedTransactionId === transaction._id}
                        onSelect={handleSelectTransaction}
                        {...transaction}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Draft Transactions Column */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-[var(--first-col-height,auto)]">
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Draft Transactions</h2>
                  </div>
                </div>

                {draftMatches.length === 0 ? (<div className="p-4 flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">No Transaction Identified.</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Draft transactions will appear here</p>
                  </div>
                </div>) : (
                  <div className="p-4 flex-1 overflow-y-auto">
                    {draftMatches.map((item) => (
                      <LocationHistoryItem
                        key={item._id}
                        id={item._id}
                        dateTime={item.dateTime}
                        location={item.location}
                        isSelected={selectedItemId === item._id}
                        onSelect={(id: string) => {
                          setSelectedItemId(prevId => prevId === id ? null : id);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Transaction Details Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Transaction Details</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">UTR / Transaction #</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recipient</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bank</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      {/* <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {transactionDetails.date}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white max-w-xs">
                        {transactionDetails.description}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {transactionDetails.utr || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {transactionDetails.recipient || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <select
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="Settlement">Settlement</option>
                          <option value="Branch">Branch</option>
                          <option value="ATM">ATM</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {transactionDetails.bank}
                      </td> */}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Amount and Action Row */}
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-700 dark:text-gray-300">₹</span>
                      <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-lg font-bold text-green-600 dark:text-green-400 w-20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={onClose}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors font-medium text-sm"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        // Handle approval logic here
                        alert('Transaction Approved!');
                        onClose();
                      }}
                      className="flex items-center gap-2 px-6 py-2 bg-green-600 dark:bg-green-500 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600 transition-colors font-medium shadow-sm text-sm"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    </div >
  );
}
