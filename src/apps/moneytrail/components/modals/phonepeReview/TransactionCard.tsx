import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileText
} from 'lucide-react';
import { WithId } from '../../../../../engine/models/types';
import { BankEntry, PhonepeEntry } from '../../../engine/models/types';
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

const TransactionCard: React.FC<WithId<PhonepeEntry>> = (phonepeEntry) => {
  const isDebit: boolean = phonepeEntry.type === 'Debit';
  
  // Common styling for the new tags
  const tagBaseStyle = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border";

  return (
    <div>
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <BankIcon bankName={phonepeEntry.bank} />
            <div className="font-semibold text-gray-800 dark:text-gray-100">{phonepeEntry.bank}</div>
          </div>
          <div className="text-right">
            <div className={`text-xl font-bold ${isDebit
              ? 'text-red-600 dark:text-red-400'
              : 'text-emerald-600 dark:text-emerald-400'
              }`}>
              {isDebit ? '-' : '+'} ₹{phonepeEntry.amount.toLocaleString()}
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
            {phonepeEntry.type}
          </span>


          {/* Processed/Pending Status Tag */}
          <span className={`${tagBaseStyle} ${phonepeEntry.processed
            ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800'
            : 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800'
            }`}>
            {phonepeEntry.processed ? <CheckCircle2 className="w-3 h-3 mr-1.5" /> : <Clock className="w-3 h-3 mr-1.5" />}
            {phonepeEntry.processed ? 'Processed' : 'Pending'}
          </span>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2 text-slate-800 dark:text-slate-100">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <div className="font-medium text-sm">{dayjs(phonepeEntry.date).format('dddd, DD MMM, YYYY')}</div>
              </div>
              <div className="flex items-start space-x-2 text-slate-500 dark:text-slate-400">
                <FileText className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div className="text-sm font-medium break-all leading-relaxed capitalize">{phonepeEntry.recipient}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
