import dayjs from 'dayjs';
import { Calendar } from 'lucide-react';
import { FC, memo } from 'react';
import { BankIcon } from '../../../../../components/Common';
import { ProcessedActionButton, ProcessedMarker } from './shared/ProcessedState';
import { SwipeableContent } from './shared/SwipeableContent';
import { BankListItemProps } from '../../../engine/contracts/props';

const BankListItemFC: FC<BankListItemProps> = ({ isOpen, item, onOpen, setBankItemId, setProcessed }) => {
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
        onClick={() => setBankItemId(item._id)}
      >
        {item.processed && <ProcessedMarker />}
        <div className="flex items-center flex-shrink-0"><BankIcon bankName={item.bank} /></div>
        <div className="flex-grow pr-6 pl-4 min-w-4">
          <h3 className="text-gray-800 line-clamp-2 break-all capitalize">{item.description}</h3>
        </div>
        <div className="text-right min-w-fit">
          <p className={`${item.type === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>
            {item.type === 'Credit' ? '+' : '-'} ₹{item.amount}
          </p>
          <div className="flex justify-end text-gray-400">
            <div className="flex items-center">
              <div className="mr-1"><Calendar width={16} height={16} strokeWidth={2.5} /></div>
              <div>{dayjs(item.date).format('DD MMM')}</div>
            </div>
          </div>
        </div>
      </SwipeableContent>
    </>
  );
};

export const BankListItem = memo(BankListItemFC);
