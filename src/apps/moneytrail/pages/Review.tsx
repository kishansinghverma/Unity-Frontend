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
        <div className="flex py-1 px-6 justify-between items-center text-sm font-medium bg-gray-200/50 rounded">
          <div className="flex gap-4">
            <button className="text-gray-600 flex gap-1">
              <Plus size={20} />
              <span>Add Expense</span>
            </button>
            <button className="text-gray-600 flex gap-2">
              <ArrowUpFromLine size={20} />
              <span>Upload Statement</span>
            </button>
          </div>
          <div className="py-2 px-4">Last Refined At: {dayjs(Date.now()).format('DD/MM/YYYY')}</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 p-4 md:p-8">
        <div className="flex-1 min-w-0">
          <BankList
            items={getArrayOrDefault(bankEntries)}
            isLoading={bankEntries.isLoading}
            setBankItemId={setBankItemId}
          />
        </div>
        <div className="flex-1 min-w-0">
          <PhonepeList
            items={getArrayOrDefault(phonepeEntries)}
            isLoading={phonepeEntries.isLoading}
          />
        </div>
        <div className="flex-1 min-w-0">
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
    </>
  );
};

export default ReviewExpense;
