import dayjs from 'dayjs';
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileText
} from 'lucide-react';
import React from 'react';
import { WithId } from '../../../../../engine/models/types';
import { PaymentAppEntry } from '../../../engine/models/types';
import { BankIcon } from '../../Common';

// interface DescriptionInfo {
//   platform: string;
//   category: string;
// }
// interface BankTheme {
//   gradient: string;
//   bg: string;
//   text: string;
//   border: string;
// }

const TransactionCard: React.FC<WithId<PaymentAppEntry>> = (paymentAppEntry) => {
  const isDebit: boolean = paymentAppEntry.type === 'Debit';

  // Common styling for the new tags
  const tagBaseStyle = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border";

  return (
    <div>
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <BankIcon bankName={paymentAppEntry.bank} />
            <div className="font-semibold text-gray-800">{paymentAppEntry.bank}</div>
          </div>
          <div className="text-right">
            <div className={`text-xl font-bold ${isDebit
              ? 'text-red-600'
              : 'text-emerald-600'
              }`}>
              {isDebit ? '-' : '+'} ₹{paymentAppEntry.amount.toLocaleString()}
            </div>
          </div>
        </div>

        {/* New Tags Section: Type, Category, Status */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {/* Transaction Type Tag */}
          <span className={`${tagBaseStyle} ${isDebit
            ? 'bg-red-100 text-red-700 border-red-200'
            : 'bg-emerald-100 text-emerald-700 border-emerald-200'
            }`}>
            {paymentAppEntry.type}
          </span>

          {/* Processed/Pending Status Tag */}
          <span className={`${tagBaseStyle} ${paymentAppEntry.processed
            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
            : 'bg-yellow-100 text-yellow-700 border-yellow-200'
            }`}>
            {paymentAppEntry.processed ? <CheckCircle2 className="w-3 h-3 mr-1.5" /> : <Clock className="w-3 h-3 mr-1.5" />}
            {paymentAppEntry.processed ? 'Processed' : 'Pending'}
          </span>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2 text-slate-800">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <div className="font-medium text-sm">{dayjs(paymentAppEntry.date).format('dddd, DD MMM, YYYY')}</div>
                <Clock className="w-4 h-4 flex-shrink-0" />
                <div className="font-medium text-sm">{dayjs(paymentAppEntry.date).format('hh:mm A')}</div>
              </div>
              <div className="flex items-start space-x-2 text-slate-500">
                <FileText className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div className="text-sm font-medium break-all leading-relaxed capitalize">{paymentAppEntry.recipient}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
