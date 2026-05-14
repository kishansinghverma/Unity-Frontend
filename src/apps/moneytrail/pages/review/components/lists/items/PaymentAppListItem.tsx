import dayjs from 'dayjs';
import { Calendar, Clock } from 'lucide-react';
import { Dispatch, FC, memo, SetStateAction } from 'react';
import { BankIcon } from '../../../../../components/Common';
import { PaymentAppEntry } from '../../../../../engine/models/types';
import { Nullable, WithId } from '../../../../../../../engine/models/types';
import { ProcessedActionButton, ProcessedMarker } from './shared/ProcessedState';
import { SwipeableContent } from './shared/SwipeableContent';

type PaymentAppListItemProps = {
  item: WithId<PaymentAppEntry>;
  isOpen: boolean;
  onOpen: (id: string | null) => void;
  setProcessed: (id: string) => void;
  setPaymentAppItemId: Dispatch<SetStateAction<Nullable<string>>>;
};

const PaymentAppListItemFC: FC<PaymentAppListItemProps> = ({
  isOpen,
  item,
  onOpen,
  setPaymentAppItemId,
  setProcessed,
}) => {
  const markProcessed = (id: string) => {
    setProcessed(id);
    onOpen(null);
  };

  return (
    <>
      <ProcessedActionButton disabled={item.processed} onClick={() => markProcessed(item._id)} />
      <SwipeableContent
        id={item._id}
        isOpen={isOpen}
        onOpen={onOpen}
        onClick={() => setPaymentAppItemId(item._id)}
      >
        {item.processed && <ProcessedMarker />}
        <div className="flex items-center flex-shrink-0">
          <BankIcon bankName={item.bank} />
        </div>
        <div className="flex-grow pl-4 min-w-4">
          <div className="text-gray-800 line-clamp-1 break-all capitalize">{item.recipient}</div>
          <div className="flex justify-between">
            <div className={`flex items-center ${item.type === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>
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

export const PaymentAppListItem = memo(PaymentAppListItemFC);
