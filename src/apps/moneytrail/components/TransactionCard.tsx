import React, { useState } from 'react';
import {
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  FileText
} from 'lucide-react';

// Type Definitions
interface Transaction {
  _id: string;
  date: string;
  description: string;
  amount: number;
  type: 'Debit' | 'Credit';
  bank: string;
  processed: boolean;
}

interface DateInfo {
  fullDateWithDay: string;
}

interface DescriptionInfo {
  platform: string;
  category: string;
}

interface BankTheme {
  gradient: string;
  bg: string;
  text: string;
  border: string;
}

// The TransactionCard component - now typed with React.FC
const TransactionCard: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Sample transaction data array
  const transactions: Transaction[] = [
    {
      "_id": "6818a43aa5ebd8d3fe2f96c8",
      "date": "2025-03-01T18:30:00.000Z",
      "description": "UPI-SBIMOPS-SBIMOPS@SBI-SBIN0016209-100108867409-COLLECT FROM 70374",
      "amount": 1566,
      "type": "Debit",
      "bank": "HDFC",
      "processed": true
    },
    {
      _id: "6818a43aa5ebd8d3fe2f96b5",
      date: "2025-02-17T18:30:00.000Z",
      description: "464482015-EMI RTN CHARGES-JANUARY 140125-MIR2504677639181",
      amount: 236,
      type: "Debit",
      bank: "HDFC",
      processed: true
    },
    {
      _id: "6818a60ba5ebd8d3fe2f97ea",
      date: "2025-02-20T18:30:00.000Z",
      description: "TO TRANSFER-UPI/DR/215254668498/R L Shar/YESB/paytm.s155/Payme--",
      amount: 2950,
      type: "Debit",
      bank: "SBI",
      processed: true
    },
  ];

  if (transactions.length === 0) {
    return <div className="p-4 text-center text-gray-500">No transaction data available.</div>;
  }

  const safeCurrentIndex = Math.max(0, Math.min(currentIndex, transactions.length - 1));
  const currentTransaction: Transaction = transactions[safeCurrentIndex];

  const formatDate = (dateString: string): DateInfo => {
    const date = new Date(dateString);
    const datePart = `${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'long' })}, ${date.getFullYear()}`;
    const weekdayPart = date.toLocaleDateString('en-US', { weekday: 'long' });
    return {
      fullDateWithDay: `${datePart}, ${weekdayPart}`
    };
  };

  const parseDescription = (desc: string): DescriptionInfo => {
    const description = desc.trim();
    if (description.startsWith('UPI-')) {
      return { platform: 'UPI', category: 'Digital Payment' };
    }
    if (description.startsWith('TO TRANSFER-UPI/DR/')) {
      const parts = description.split('/');
      const recipient = parts[3]?.trim() || 'Unknown';
      const upiId = parts[5]?.trim() || '';
      let category = 'Transfer';
      if (recipient.toLowerCase().includes('blinkit')) { category = 'Grocery'; }
      else if (recipient.toLowerCase().includes('zudio') || recipient.toLowerCase().includes('reliance')) { category = 'Shopping'; }
      else if (upiId.includes('paytm')) { category = 'Digital Wallet'; }
      else if (upiId.includes('jio')) { category = 'Telecom'; }
      return { platform: 'UPI', category: category };
    }
    if (description.includes('EMI') || description.includes('CHARGES')) {
      return { platform: 'Banking', category: 'Bank Fees' };
    }
    return { platform: 'Banking', category: 'General' };
  };

  const dateInfo: DateInfo = formatDate(currentTransaction.date);
  const descInfo: DescriptionInfo = parseDescription(currentTransaction.description);
  const isDebit: boolean = currentTransaction.type === 'Debit';

  const getBankTheme = (bank: string): BankTheme => {
    switch (bank.toUpperCase()) {
      case 'HDFC': return {
        gradient: 'from-blue-500 to-blue-600',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-800'
      };
      case 'SBI': return {
        gradient: 'from-green-500 to-green-600',
        bg: 'bg-green-50 dark:bg-green-900/20',
        text: 'text-green-700 dark:text-green-300',
        border: 'border-green-200 dark:border-green-800'
      };
      case 'ICICI': return {
        gradient: 'from-orange-500 to-orange-600',
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        text: 'text-orange-700 dark:text-orange-300',
        border: 'border-orange-200 dark:border-orange-800'
      };
      default: return {
        gradient: 'from-gray-500 to-gray-600',
        bg: 'bg-gray-50 dark:bg-gray-800/50',
        text: 'text-gray-700 dark:text-gray-300',
        border: 'border-gray-200 dark:border-gray-700'
      };
    }
  };
  const bankTheme: BankTheme = getBankTheme(currentTransaction.bank);

  // Common styling for the new tags
  const tagBaseStyle = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border";

  return (
    <div>
      <div> 
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-xl bg-gradient-to-br ${bankTheme.gradient}`}>
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="font-semibold text-gray-800 dark:text-gray-100">{currentTransaction.bank}</div>
          </div>
          <div className="text-right">
            <div className={`text-xl font-bold ${
              isDebit 
                ? 'text-red-600 dark:text-red-400'
                : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              {isDebit ? '-' : '+'}₹{currentTransaction.amount.toLocaleString()}
            </div>
          </div>
        </div>

        {/* New Tags Section: Type, Category, Status */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {/* Transaction Type Tag */}
          <span className={`${tagBaseStyle} ${
            isDebit
              ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
              : 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800'
          }`}>
            {currentTransaction.type}
          </span>

          {/* Category Tag */}
          <span className={`${tagBaseStyle} ${bankTheme.bg} ${bankTheme.text} ${bankTheme.border}`}>
            {descInfo.category}
          </span>
          
          {/* Processed/Pending Status Tag */}
          <span className={`${tagBaseStyle} ${
            currentTransaction.processed
              ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800'
              : 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800'
          }`}>
            {currentTransaction.processed ? (
              <CheckCircle2 className="w-3 h-3 mr-1.5" />
            ) : (
              <Clock className="w-3 h-3 mr-1.5" />
            )}
            {currentTransaction.processed ? 'Processed' : 'Pending'}
          </span>
        </div>

        {/* Description Section */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {/* Date display updated to a single line */}
              <div className="flex items-center space-x-2 mb-2 text-slate-800 dark:text-slate-100">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <div className="font-medium text-sm">{dateInfo.fullDateWithDay}</div>
              </div>

              {/* Description label removed, icon added */}
              <div className="flex items-start space-x-2 text-slate-500 dark:text-slate-400"> {/* Changed to items-start for icon alignment */}
                <FileText className="w-4 h-4 flex-shrink-0 mt-0.5" /> {/* Icon added, mt-0.5 for slight alignment adjustment */}
                <div className="text-sm font-medium break-all leading-relaxed">
                  {currentTransaction.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
