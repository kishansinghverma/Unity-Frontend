import React, { useEffect } from 'react';
import { Building2, FileSearch, TabletSmartphone } from 'lucide-react';
import TransactionList from '../components/BankList';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchBankEntries, fetchDraftEntries, fetchPhonePeEntries } from '../store/reviewSlice';
import PhonepeList from '../components/PhonePeList';
import DraftList from '../components/DraftList';

const ReviewExpense: React.FC = () => {

  const dispatch = useAppDispatch();
  const bankEntries = useAppSelector(state => state.moneytrail.bankEntries);
  const phonepeEntries = useAppSelector(state => state.moneytrail.phonepeEntries);
  const draftEntries = useAppSelector(state => state.moneytrail.draftEntries);


  useEffect(() => {
    dispatch(fetchBankEntries());
    dispatch(fetchPhonePeEntries())
    dispatch(fetchDraftEntries());
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 md:p-8">
      <div className="flex-1 min-w-0">
        <TransactionList
          title="Bank Entries"
          subtitle="Aggregated bank transactions"
          icon={Building2}
          gradientColors={{ from: 'from-violet-500', to: 'to-indigo-600' }}
          items={bankEntries.contents}
          isLoading={bankEntries.isLoading}
        />
      </div>
      <div className="flex-1 min-w-0">
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
      </div>
    </div>
  );
};

export default ReviewExpense;
