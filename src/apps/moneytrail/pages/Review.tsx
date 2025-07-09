import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchBankEntries, fetchDraftEntries, fetchPhonePeEntries } from '../store/reviewSlice';
import { ReviewModal } from '../components/modals/reviewExpense/ReviewModal';
import { BankList } from '../components/BankList';
import { AnimatePresence } from 'framer-motion';
import { Nullable } from '../../../engine/models/types';

const ReviewExpense: React.FC = () => {

  const dispatch = useAppDispatch();
  const bankEntries = useAppSelector(state => state.moneyTrail.review.bankEntries);
  const phonepeEntries = useAppSelector(state => state.moneyTrail.review.phonepeEntries);
  const draftEntries = useAppSelector(state => state.moneyTrail.review.draftEntries);

  const [bankItemId, setBankItemId] = useState<Nullable<string>>(null);

  useEffect(() => {
    dispatch(fetchBankEntries());
    dispatch(fetchPhonePeEntries())
    dispatch(fetchDraftEntries());
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 md:p-8">
      <div className="flex-1 min-w-0">
        <BankList {...{ ...bankEntries, setBankItemId }} />
      </div>
      {/* <div className="flex-1 min-w-0">
        <PhonepeList
          title="PhonePe Records"
          subtitle="PhonePe transaction records"
          icon={TabletSmartphone}
          gradientColors={{ from: 'from-green-500', to: 'to-emerald-600' }}
          items={phonepeEntries.contents}
          isLoading={phonepeEntries.isLoading}
        />
      </div>
      <div className="flex-1 min-w-0">
        <DraftList
          title="Draft Logs"
          subtitle="Metadata for identification"
          icon={FileSearch}
          gradientColors={{ from: 'from-orange-500', to: 'to-yellow-500' }}
          items={draftEntries.contents}
          isLoading={draftEntries.isLoading}
        />
      </div>*/}
      <AnimatePresence>
        {bankItemId && (
          <ReviewModal {...{
            key: bankItemId,
            bankEntries: bankEntries.contents,
            phonepeEntries: phonepeEntries.contents,
            draftEntries: draftEntries.contents,
            bankItemId,
            setBankItemId
          }}/>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewExpense;
