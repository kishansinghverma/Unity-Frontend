import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileText
} from 'lucide-react';
import { WithId } from '../../../../../engine/models/types';
import { BankEntry } from '../../../engine/models/types';
import { BankIcon } from '../../Common';
import dayjs from 'dayjs';

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

const TransactionCard: React.FC<WithId<BankEntry>> = (bankEntry) => {

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

  const descInfo: DescriptionInfo = parseDescription(bankEntry.description);
  const isDebit: boolean = bankEntry.type === 'Debit';

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
      case 'SBI CC': return {
        gradient: 'from-purple-500 to-purple-600',
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        text: 'text-purple-700 dark:text-purple-300',
        border: 'border-purple-200 dark:border-purple-800'
      };
      default: return {
        gradient: 'from-gray-500 to-gray-600',
        bg: 'bg-gray-50 dark:bg-gray-800/50',
        text: 'text-gray-700 dark:text-gray-300',
        border: 'border-gray-200 dark:border-gray-700'
      };
    }
  };
  const bankTheme: BankTheme = getBankTheme(bankEntry.bank);

  // Common styling for the new tags
  const tagBaseStyle = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border";

  return (
    <div>
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <BankIcon bankName={bankEntry.bank} />
            <div className="font-semibold text-gray-800 dark:text-gray-100">{bankEntry.bank}</div>
          </div>
          <div className="text-right">
            <div className={`text-xl font-bold ${isDebit
              ? 'text-red-600 dark:text-red-400'
              : 'text-emerald-600 dark:text-emerald-400'
              }`}>
              {isDebit ? '-' : '+'} ₹{bankEntry.amount.toLocaleString()}
            </div>
          </div>
        </div>

        {/* New Tags Section: Type, Category, Status */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {/* Transaction Type Tag */}
          <span className={`${tagBaseStyle} ${isDebit
            ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
            : 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800'
            }`}>
            {bankEntry.type}
          </span>

          {/* Category Tag */}
          <span className={`${tagBaseStyle} ${bankTheme.bg} ${bankTheme.text} ${bankTheme.border}`}>
            {descInfo.category}
          </span>

          {/* Processed/Pending Status Tag */}
          <span className={`${tagBaseStyle} ${bankEntry.processed
            ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800'
            : 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800'
            }`}>
            {bankEntry.processed ? <CheckCircle2 className="w-3 h-3 mr-1.5" /> : <Clock className="w-3 h-3 mr-1.5" />}
            {bankEntry.processed ? 'Processed' : 'Pending'}
          </span>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2 text-slate-800 dark:text-slate-100">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <div className="font-medium text-sm">{dayjs(bankEntry.date).format('dddd, DD MMM, YYYY')}</div>
              </div>
              <div className="flex items-start space-x-2 text-slate-500 dark:text-slate-400">
                <FileText className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div className="text-sm font-medium break-all leading-relaxed capitalize">{bankEntry.description}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
