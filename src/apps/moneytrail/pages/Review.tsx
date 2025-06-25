import React from 'react';
import { Building2, FileSearch, Landmark, Smartphone, TabletSmartphone } from 'lucide-react';
import { BankEntry } from '../commons/Types';
import TransactionList from '../components/TransactionList';
import { WithId } from '../../../commons/types';

const bankEntries: WithId<BankEntry>[] = [
  {
    _id: 'bke_001',
    date: new Date('2025-06-20T10:00:00Z'),
    description: 'Online purchase - Amazon.com',
    amount: 55.75,
    processed: true,
    type: 'Debit',
    bank: 'SBI'
  },
  {
    _id: 'bke_002',
    date: new Date('2025-06-21T14:30:00Z'),
    description: 'Salary Deposit - June 2025',
    amount: 2500.00,
    processed: true,
    type: 'Credit',
    bank: 'SBI'
  },
  {
    _id: 'bke_003',
    date: new Date('2025-06-21T16:15:00Z'),
    description: 'ATM Withdrawal',
    amount: 100.00,
    processed: true,
    type: 'Debit',
    bank: 'ABC Bank'
  },
  {
    _id: 'bke_004',
    date: new Date('2025-06-22T09:00:00Z'),
    description: 'Utility Bill Payment - Electricity',
    amount: 75.20,
    processed: true,
    type: 'Debit',
    bank: 'PQR Credit Union'
  },
  {
    _id: 'bke_005',
    date: new Date('2025-06-22T11:45:00Z'),
    description: 'Interest Earned',
    amount: 5.25,
    processed: false,
    type: 'Credit',
    bank: 'XYZ Financial'
  },
  {
    _id: 'bke_006',
    date: new Date('2025-06-23T13:00:00Z'),
    description: 'Restaurant - Dinner with friends',
    amount: 45.00,
    type: 'Debit',
    bank: 'ABC Bank'
  },
  {
    _id: 'bke_007',
    date: new Date('2025-06-23T17:00:00Z'),
    description: 'Refund - Online store',
    amount: 25.50,
    processed: true,
    type: 'Credit',
    bank: 'PQR Credit Union'
  },
  {
    _id: 'bke_008',
    date: new Date('2025-06-24T08:30:00Z'),
    description: 'Subscription Service - Netflix',
    amount: 15.99,
    processed: false,
    type: 'Debit',
    bank: 'XYZ Financial'
  },
  {
    _id: 'bke_009',
    date: new Date('2025-06-24T10:00:00Z'),
    description: 'Inter-bank Transfer - Savings',
    amount: 500.00,
    processed: true,
    type: 'Debit',
    bank: 'ABC Bank'
  },
  {
    _id: 'bke_010',
    date: new Date('2025-06-24T10:05:00Z'),
    description: 'Inter-bank Transfer - From Checking',
    amount: 500.00,
    processed: true,
    type: 'Credit',
    bank: 'PQR Credit Union'
  },
];

const ReviewExpense: React.FC = () => {
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
          initialItems={personalAccountItems}
        />
      </div>
      <div className="flex-1 min-w-0">
        <TransactionList 
          title="Draft Logs"
          subtitle="Metadata for identification"
          icon={FileSearch}
          gradientColors={{ from: 'from-orange-500', to: 'to-yellow-500' }}
          initialItems={personalAccountItems}
        />
      </div> */}
    </div>
  );
};

export default ReviewExpense;
