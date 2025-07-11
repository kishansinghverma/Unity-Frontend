import { FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, CreditCard, Smartphone, FileText, Check } from 'lucide-react';
import TransactionCard from './TransactionCard';
import { DraftItem } from './DraftItem';
import { getDraftMatches, getPhonePeMatches } from '../../../engine/utils';
import { TransactionContainer } from './TransactionContainer';
import { Nullable, WithId } from '../../../../../engine/models/types';
import { BankEntry, DraftEntry, PhonepeEntry } from '../../../engine/models/types';
import { PhonePeItem } from './PhonepeItem';
import dayjs from 'dayjs';

export const ReviewModal: FC<{
  bankItemId: string;
  bankEntries: WithId<BankEntry>[];
  phonepeEntries: WithId<PhonepeEntry>[];
  draftEntries: WithId<DraftEntry>[];
  setBankItemId: React.Dispatch<React.SetStateAction<Nullable<string>>>
}> = ({
  bankItemId,
  bankEntries,
  phonepeEntries,
  draftEntries,
  setBankItemId
}) => {
    const setColumnHeight = () => {
      const firstColumn: HTMLElement | null = document.querySelector('[data-first-column]');
      if (firstColumn) {
        const style = document.documentElement.style;
        style.setProperty('--first-col-height', '0px');
        style.setProperty('--first-col-height', `${firstColumn.offsetHeight}px`);
      }
    };

    const handleKeyDown = ({ key }: KeyboardEvent) => {
      if (key === 'Escape') onModalClose();
    };

    const onModalClose = () => setBankItemId(null);

    useEffect(() => {
      setColumnHeight();
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const [selectedPhonepe, setSelectedPhonePe] = useState<Nullable<WithId<PhonepeEntry>>>(null);
    const [selectedDraft, setSelectedDraft] = useState<Nullable<WithId<DraftEntry>>>(null);

    const bankEntry = bankEntries.find(entry => entry._id === bankItemId)!;
    const phonepeMatches = getPhonePeMatches(bankEntry, phonepeEntries);
    const draftMatches = getDraftMatches(selectedPhonepe, draftEntries);

    return (
      <motion.div
        onClick={onModalClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur backdrop-saturate-[0.8]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Modal Container */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 15, stiffness: 350 } },
            exit: { opacity: 0, scale: 0.8, transition: { duration: 0.15 } },
          }}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Review Bank Transaction</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Review and approve your transactions</p>
            </div>
            <button
              onClick={onModalClose}
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
                <TransactionContainer
                  isFirst
                  icon={CreditCard}
                  type="Bank"
                  headerStyle="from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
                  iconStyle="text-blue-600 dark:text-blue-400"
                >
                  <TransactionCard {...bankEntry} />
                </TransactionContainer>

                <TransactionContainer
                  icon={Smartphone}
                  type="PhonePe"
                  headerStyle="from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
                  iconStyle="text-purple-600 dark:text-purple-400"
                >
                  {phonepeMatches.map((item) => (
                    <PhonePeItem {...{
                      item,
                      key: item._id,
                      isSelected: selectedPhonepe?._id === item._id,
                      setSelected: setSelectedPhonePe
                    }} />
                  ))}
                </TransactionContainer>

                <TransactionContainer
                  icon={FileText}
                  type="Draft"
                  headerStyle="from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20"
                  iconStyle="text-orange-600 dark:text-orange-400"
                >
                  {draftMatches.map((item) => (
                    <DraftItem {...{
                      item,
                      key: item._id,
                      isSelected: selectedDraft?._id === item._id,
                      setSelected: setSelectedDraft
                    }} />
                  ))}
                </TransactionContainer>
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
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bank</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">UTR / Transaction #</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">UTR / Transaction #</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recipient</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {dayjs(bankEntry.date).format('DD-MM-YYYY')}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {bankEntry.bank}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {bankEntry.description}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {selectedPhonepe?.utr || '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {selectedPhonepe?.recipient || '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {selectedDraft?.location}
                        </td>
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
                          // value={amount}
                          // onChange={(e) => setAmount(e.target.value)}
                          className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-lg font-bold text-green-600 dark:text-green-400 w-20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        // onClick={onClose}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors font-medium text-sm"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                      <button
                        onClick={() => {
                          // Handle approval logic here
                          alert('Transaction Approved!');
                          // onClose();
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
        </motion.div>
      </motion.div>
    );
  }