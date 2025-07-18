import React, { useState } from 'react';
import { ReviewModal } from '../components/modals/reviewExpense/ReviewModal';
import { BankList } from '../components/BankList';
import { AnimatePresence } from 'framer-motion';
import { Nullable } from '../../../engine/models/types';
import { useBankEntryQuery, useDraftEntryQuery, usePhonepeEntryQuery } from '../store/reviewSlice';
import { getArrayOrDefault } from '../../../engine/helpers/rtkHelper';
import PhonepeList from '../components/PhonePeList';
import { DraftList } from '../components/DraftList';
import dayjs from 'dayjs';
import { CalendarArrowUp, CircleArrowUp, ClockArrowUp, PlusCircle } from 'lucide-react';

const ReviewExpense: React.FC = () => {
  const bankEntries = useBankEntryQuery();
  const phonepeEntries = usePhonepeEntryQuery();
  const draftEntries = useDraftEntryQuery();

  const [bankItemId, setBankItemId] = useState<Nullable<string>>(null);

  return (
    <>
      <div className="px-8">
        <div className="flex px-4 py-3 mb-6 justify-between items-center text-sm font-medium text-gray-600 dark:text-gray-300 duration-200 rounded-xl bg-white dark:bg-gray-800 shadow-md dark:shadow-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex gap-2">
            <button className="flex gap-1 hover:text-gray-900 dark:hover:text-white hover:font-semibold transition-colors duration-200 rounded-md px-2 py-1 flex w-32">
              <PlusCircle size={20} />
              <span>Add Expense</span>
            </button>
            <button className="flex gap-1 hover:text-gray-900 dark:hover:text-white hover:font-semibold transition-colors duration-200 rounded-md px-2 py-1 flex w-50">
              <CircleArrowUp size={20} />
              <span>Upload Statement</span>
            </button>
          </div>
          <div className="flex gap-3">
            <div className="flex gap-1">
              <CalendarArrowUp size={20} />
              <div> {dayjs(Date.now()).format('DD-MMM-YYYY')} </div>
            </div>
            <div className="flex gap-1">
              <ClockArrowUp size={20} />
              <div> {dayjs(Date.now()).format('hh:mm A')} </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-between">
          <div className="w-full min-w-0">
            <BankList
              items={getArrayOrDefault(bankEntries)}
              isLoading={bankEntries.isLoading}
              setBankItemId={setBankItemId}
            />
          </div>
          <div className="w-full px-10 min-w-0">
            <PhonepeList
              items={getArrayOrDefault(phonepeEntries)}
              isLoading={phonepeEntries.isLoading}
            />
          </div>
          <div className="w-full min-w-0">
            <DraftList
              items={getArrayOrDefault(draftEntries)}
              isLoading={draftEntries.isLoading}
            />
          </div>
          <AnimatePresence>
            {bankItemId && (
              <ReviewModal key={bankItemId} {...{
                bankEntries: getArrayOrDefault(bankEntries),
                phonepeEntries: getArrayOrDefault(phonepeEntries),
                draftEntries: getArrayOrDefault(draftEntries),
                bankItemId,
                setBankItemId
              }} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default ReviewExpense;
