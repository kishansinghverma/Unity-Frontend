import dayjs from 'dayjs';
import { Calendar, Clock } from 'lucide-react';
import { FC, memo } from 'react';
import { ImgSrc, SvgImage } from '../../../../../../../static/icons/provider';
import { AppRecordListItemProps } from '../../../engine/contracts/props';
import { BankIcon } from '../../shared/Common';
import { ProcessedActionButton, ProcessedMarker } from './shared/ProcessedState';
import { SwipeableContent } from './shared/SwipeableContent';

const AppRecordListItemFC: FC<AppRecordListItemProps> = ({
  isOpen,
  item,
  onOpen,
  setAppRecordItemId,
  setProcessed,
}) => {
  const markProcessed = (id: string) => {
    setProcessed(id);
    onOpen(null);
  };

  const appIconSrc = item.app === "paytm" ? ImgSrc.Paytm : item.app === "phonepe" ? ImgSrc.PhonePe : null;

  return (
    <>
      <ProcessedActionButton disabled={item.processed} onClick={() => markProcessed(item._id)} />
      <SwipeableContent
        id={item._id}
        isOpen={isOpen}
        onOpen={onOpen}
        onClick={() => setAppRecordItemId(item._id)}
      >
        {item.processed && <ProcessedMarker />}
        <div className="flex items-center flex-shrink-0">
          <BankIcon bankName={item.bank} />
        </div>
        <div className="flex-grow pl-4 min-w-4">
          <div className="flex justify-between">
            <div className="flex-1 text-gray-800 line-clamp-1 break-all capitalize pr-2" title={item.recipient}>{item.recipient}</div>
            {appIconSrc && (
              <div className="flex items-center">
                <SvgImage src={appIconSrc} style={{ height: 12 }} alt={item.app} />
              </div>
            )}
          </div>
          <div className="flex justify-between">
            <div className={`flex items-center gap-2 ${item.type === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>
              {item.type === 'Credit' ? '+' : '-'} ₹{item.amount}
            </div>
            <div className="flex items-center text-gray-400">
              <div className="mr-1"><Calendar width={16} height={16} strokeWidth={2.5} /></div>
              <div>{dayjs(item.date).format('DD MMM')}</div>
              <div className="m-1"><Clock width={16} height={16} strokeWidth={2.5} /></div>
              <div>{dayjs(item.date).format('hh:mm A')}</div>
            </div>
          </div>
        </div>
      </SwipeableContent>
    </>
  );
};

export const AppRecordListItem = memo(AppRecordListItemFC);
