import React, { useEffect } from 'react';
import { Building2 } from 'lucide-react';
import { BankEntry } from '../commons/Types';
import TransactionList from '../components/TransactionList';
import { WithId } from '../../../commons/types';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchBankEntries } from '../store/reviewSlice';

const ReviewExpense: React.FC = () => {

  const dispatch = useAppDispatch();
  const { bankEntries, loading, error } = useAppSelector(state => state.moneytrail);

  useEffect(() => {
    dispatch(fetchBankEntries());
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 md:p-8">
      <div className="flex-1 min-w-0">
        <TransactionList
          title="Bank Entries"
          subtitle="Aggregated bank transactions"
          icon={Building2}
          gradientColors={{ from: 'from-violet-500', to: 'to-indigo-600' }}
          items={bankEntries}
          isLoading={false}
        />
      </div>
      {/* <div className="flex-1 min-w-0">
        <TransactionList 
          title="PhonePe Records"
          subtitle="PhonePe transaction records"
          icon={TabletSmartphone}
          gradientColors={{ from: 'from-green-500', to: 'to-emerald-600' }}
          initialItems={phonepeEntries}
        />
      </div>
      <div className="flex-1 min-w-0">
        <TransactionList 
          title="Draft Logs"
          subtitle="Metadata for identification"
          icon={FileSearch}
          gradientColors={{ from: 'from-orange-500', to: 'to-yellow-500' }}
          initialItems={draftEntries}
        />
      </div> */}
    </div>
  );
};

export default ReviewExpense;
