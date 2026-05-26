import dayjs from 'dayjs';
import { Calendar, CheckCircle2, Clock, FileText, Sparkles } from 'lucide-react';
import React from 'react';
import { WithId } from '../../../../../../../../engine/models/types';
import { AppRecord } from '../../../../engine/contracts/models';
import { BankIcon } from '../../../shared/Common';
import { ImgSrc, SvgImage } from '../../../../../../../../static/icons/provider';

type AppTransactionCardProps = WithId<AppRecord> & {
  predictionLabel?: string;
  predictionTitle?: string;
  predictionTone?: 'low' | 'medium' | 'high';
  onApplyPrediction?: () => void;
};

const TransactionCard: React.FC<AppTransactionCardProps> = ({
  predictionLabel,
  predictionTitle,
  predictionTone,
  onApplyPrediction,
  ...appRecord
}) => {
  const isDebit: boolean = appRecord.type === 'Debit';

  // Common styling for the new tags
  const tagBaseStyle = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border";
  const predictionStyleByTone = {
    low: 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200',
    medium: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200',
    high: 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200',
  };
  
  const predictionStyle = predictionTone ? predictionStyleByTone[predictionTone] : predictionStyleByTone.low;
  const appIconSrc = appRecord.app === "paytm" ? ImgSrc.Paytm : appRecord.app === "phonepe" ? ImgSrc.PhonePe : null;

  return (
    <div>
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <BankIcon bankName={appRecord.bank} />
            <div className="font-semibold text-gray-800">{appRecord.bank}</div>
          </div>
          <div className="text-right">
            <div className={`text-xl font-bold ${isDebit
              ? 'text-red-600'
              : 'text-emerald-600'
              }`}>
              {isDebit ? '-' : '+'} ₹{appRecord.amount.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex justify-between w-full">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`${tagBaseStyle} ${isDebit
                ? 'bg-red-100 text-red-700 border-red-200'
                : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                }`}>
                {appRecord.type}
              </span>
              <span className={`${tagBaseStyle} ${appRecord.processed
                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                }`}>
                {appRecord.processed ? <CheckCircle2 className="w-3 h-3 mr-1.5" /> : <Clock className="w-3 h-3 mr-1.5" />}
                {appRecord.processed ? 'Processed' : 'Pending'}
              </span>
            </div>
            {appIconSrc && <div className="flex items-center">
              <SvgImage src={appIconSrc} style={{ height: 16 }} />
            </div>}
          </div>

          {onApplyPrediction && predictionLabel && (
            <button
              type="button"
              onClick={onApplyPrediction}
              title={predictionTitle}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap ${predictionStyle}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{predictionLabel}</span>
            </button>
          )}
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2 text-slate-800">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <div className="font-medium text-sm">{dayjs(appRecord.date).format('dddd, DD MMM, YYYY')}</div>
                <Clock className="w-4 h-4 flex-shrink-0" />
                <div className="font-medium text-sm">{dayjs(appRecord.date).format('hh:mm A')}</div>
              </div>
              <div className="flex items-start space-x-2 text-slate-500">
                <FileText className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div className="text-sm font-medium break-all leading-relaxed capitalize">{appRecord.recipient}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
