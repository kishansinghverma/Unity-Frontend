import { ReactNode, FC } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import dayjs from 'dayjs';
import { Nullable, WithId } from '../../../../../engine/models/types';
import { PhonepeEntry } from '../../../engine/models/types';
import { BankIcon } from '../../common';


export const PhonePeItem: FC<{
  item: WithId<PhonepeEntry>;
  isSelected: boolean;
  setSelected: React.Dispatch<React.SetStateAction<Nullable<WithId<PhonepeEntry>>>>
}> = ({
  item,
  isSelected,
  setSelected
}) => {
    const baseStyling = `w-full rounded-lg p-2.5 font-sans transition-all duration-300 ease-in-out cursor-pointer relative overflow-hidden group border border-gray-100 hover:shadow-md`;
    const hoverClasses = "hover:scale-[1.015] hover:border-slate-200";

    let selectionSpecificClasses = "";
    let selectionIndicatorElement: ReactNode = null;

    const isCredit = item.type === 'Credit';
    let currentDateTimeColor = 'text-slate-800';
    let currentPrimaryTextColor = 'text-slate-500';
    let currentAmountColor = isCredit ? 'text-green-600' : 'text-red-600';

    if (isSelected) {
      selectionSpecificClasses = "ring-1 ring-indigo-400 shadow-lg bg-indigo-50/70";
      selectionIndicatorElement = <CheckCircle className="w-4 h-4 text-white absolute top-2 right-2 bg-indigo-500 rounded-full p-0.5 shadow" />;
      currentDateTimeColor = 'text-indigo-700';
      currentPrimaryTextColor = 'text-indigo-600';
      currentAmountColor = isCredit ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold';
    } else {
      selectionSpecificClasses = "bg-gray-50 shadow-sm";
    }

    const onSelect = (current: WithId<PhonepeEntry>) => {
      isSelected ? setSelected(null) : setSelected(current);
    }

    return (
      <div
        className={`${baseStyling} ${selectionSpecificClasses} ${hoverClasses} [&:not(:first-child)]:mt-2.5 [&:not(:last-child)]:mb-2.5`}
        onClick={() => onSelect(item)}
      >
        {selectionIndicatorElement}
        <div className={`flex items-center space-x-3`}>
          <BankIcon bankName={item.bank} />
          <div className="flex-grow min-w-0">
            <p className={`text-sm font-medium ${currentPrimaryTextColor} line-clamp-2 capitalize`} title={item.recipient}>
              {item.recipient}
            </p>
          </div>

          <div className={`flex flex-col items-end flex-shrink-0 ml-auto text-right`}>
            <div className={`text-md font-semibold whitespace-nowrap ${currentAmountColor} mb-0.5`}>
              {isCredit ? '+' : '-'}₹{parseFloat(item.amount.toString()).toFixed(2)}
            </div>
            <div className={`flex items-center text-xs font-semibold whitespace-nowrap ${currentDateTimeColor}`}>
              <Clock className="w-3.5 h-3.5 ml-1.5 mr-0.5 opacity-70" />
              <span className="opacity-90">{dayjs(item.date).format('hh:mm A')}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
