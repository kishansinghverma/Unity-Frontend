import React, { useState } from 'react';
import { ReviewModal } from '../components/modals/reviewExpense/ReviewModal';
import { BankList } from '../components/BankList';
import { AnimatePresence } from 'framer-motion';
import { Nullable } from '../../../engine/models/types';
import { useBankEntryQuery, useDraftEntryQuery, usePhonepeEntryQuery } from '../store/reviewSlice';
import { getArrayOrDefault } from '../../../engine/helpers/rtkHelper';
import { TabletSmartphone, FileSearch } from 'lucide-react';
import DraftList from '../components/DraftList';
import PhonepeList from '../components/PhonePeList';

const ReviewExpense: React.FC = () => {
  const bankEntries = useBankEntryQuery();
  const phonepeEntries = usePhonepeEntryQuery();
  const draftEntries = useDraftEntryQuery();

  const [bankItemId, setBankItemId] = useState<Nullable<string>>(null);

  return (
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
        {/* <DraftList
          title="Draft Logs"
          subtitle="Metadata for identification"
          icon={FileSearch}
          gradientColors={{ from: 'from-orange-500', to: 'to-yellow-500' }}
          items={getArrayOrDefault(draftEntries)}
          isLoading={draftEntries.isLoading}
        /> */}
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
  );
};

export default ReviewExpense;
