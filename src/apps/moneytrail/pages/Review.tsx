import React, { useState } from 'react';
import { ReviewModal } from '../components/modals/reviewExpense/ReviewModal';
import { BankList } from '../components/BankList';
import { AnimatePresence } from 'framer-motion';
import { Nullable } from '../../../engine/models/types';
import { useBankEntryQuery, useDraftEntryQuery, usePhonepeEntryQuery } from '../store/reviewSlice';
import { getArrayOrDefault } from '../../../engine/helpers/rtkHelper';
import PhonepeList from '../components/PhonePeList';
import { DraftList } from '../components/DraftList';
import dayjs, { Dayjs } from 'dayjs';
import { ArrowUpFromLine, Plus } from 'lucide-react';

const ReviewExpense: React.FC = () => {
  const bankEntries = useBankEntryQuery();
  const phonepeEntries = usePhonepeEntryQuery();
  const draftEntries = useDraftEntryQuery();

  const [bankItemId, setBankItemId] = useState<Nullable<string>>(null);

  return (
    <>
      <div className="px-8">
        <div className="flex px-4 py-2 mb-6 justify-between items-center text-sm font-medium bg-white shadow-md rounded duration-200">
          <div className="flex gap-2">
            <button className="text-gray-600 flex gap-1 hover:text-gray-900 hover:font-semibold transition-colors duration-200 rounded-md px-2 py-1 flex w-32">
              <Plus size={20} />
              <span>Add Expense</span>
            </button>
            <button className="text-gray-600 flex gap-2 hover:text-gray-900 hover:font-semibold transition-colors duration-200 rounded-md px-2 py-1 flex w-50">
              <ArrowUpFromLine size={20} />
              <span>Upload Statement</span>
            </button>
          </div>
          <div className="py-2 px-4">Last Refined At: {dayjs(Date.now()).format('DD/MM/YYYY')}</div>
        </div>

        <div className="flex flex-row justify-between">
          <div className="min-w-0">
            <BankList
              items={getArrayOrDefault(bankEntries)}
              isLoading={bankEntries.isLoading}
              setBankItemId={setBankItemId}
            />
          </div>
          <div className="min-w-0 px-10">
            <PhonepeList
              items={getArrayOrDefault(phonepeEntries)}
              isLoading={phonepeEntries.isLoading}
            />
          </div>
          <div className="min-w-0">
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
