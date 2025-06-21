import React from 'react';
import { ListItem, TransactionList } from '../components/TransactionList';
import { Landmark } from 'lucide-react';

const personalAccountItems: ListItem[] = [
    {
    id: 1,
    title: 'Monthly Salary',
    description: 'Direct deposit from employer.',
    tag: 'Income',
    date: 'June 15',
    amount: '+₹3,50,000.00',
    type: 'credit',
  },
  {
    id: 2,
    title: 'Starbucks Coffee',
    description: 'Morning coffee with the team.',
    tag: 'Food',
    date: 'June 19',
    amount: '-₹450.75',
    type: 'debit',
  },
   {
    id: 3,
    title: 'Monthly Subscription - Figma',
    description: 'Recurring payment for design software.',
    tag: 'Software',
    date: 'June 18',
    amount: '-₹1,250.00',
    type: 'debit',
  },
  {
    id: 4,
    title: 'Zomato Food Delivery',
    description: 'Dinner order.',
    tag: 'Food',
    date: 'June 18',
    amount: '-₹850.00',
    type: 'debit',
  },
  {
    id: 5,
    title: 'PayTM UPI Transfer to Friend',
    description: 'Shared cost of movie tickets.',
    tag: 'Entertainment',
    date: 'June 17',
    amount: '-₹700.00',
    type: 'debit',
  },
  {
    id: 6,
    title: 'Gas Station',
    description: 'Fuel for the car.',
    tag: 'Transport',
    date: 'June 17',
    amount: '-₹3,500.50',
    type: 'debit',
  },
  {
    id: 7,
    title: 'AWS Server Bill',
    description: 'Monthly cloud infrastructure costs.',
    tag: 'Utilities',
    date: 'June 15',
    amount: '-₹9,500.30',
    type: 'debit',
  },
  {
    id: 8,
    title: 'BookMyShow Movie Tickets',
    description: 'Weekend movie plan.',
    tag: 'Entertainment',
    date: 'June 14',
    amount: '-₹1400.00',
    type: 'debit',
  },
];

const ReviewExpense: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 md:p-8">
      <div className="flex-1 min-w-0">
        <TransactionList 
          title="Personal Account"
          subtitle="Your recent transaction history"
          icon={Landmark}
          gradientColors={{ from: 'from-violet-500', to: 'to-indigo-600' }}
          initialItems={personalAccountItems}
        />
      </div>
      <div className="flex-1 min-w-0">
        <TransactionList 
          title="Family Account"
          subtitle="Shared family expenses"
          icon={Landmark}
          gradientColors={{ from: 'from-green-500', to: 'to-emerald-600' }}
          initialItems={personalAccountItems}
        />
      </div>
      <div className="flex-1 min-w-0">
        <TransactionList 
          title="Business Account"
          subtitle="Business-related transactions"
          icon={Landmark}
          gradientColors={{ from: 'from-orange-500', to: 'to-yellow-500' }}
          initialItems={personalAccountItems}
        />
      </div>
    </div>
  );
};

export default ReviewExpense;
