import { ReactNode, FC } from 'react'; // Removed useState as it's not used in this isolated module
import { CheckCircle, Clock } from 'lucide-react';
import { getDateComponent } from '../../../../../services/utils';
import { PhonepeEntry } from '../../../commons/types';
import { WithId } from '../../../../../commons/types';
import { getBankIcon } from '../../Common';


export const TransactionItem: FC<WithId<PhonepeEntry> & { isSelected: boolean, onSelect: (id: string) => void }> = (item) => {
  const { time } = getDateComponent(new Date(item.date));
  const isCredit = item.type === 'Credit';

  // Base styling for the item
  const baseStyling = `w-full rounded-lg p-2.5 font-sans transition-all duration-300 ease-in-out cursor-pointer relative overflow-hidden group
                       border border-gray-100 dark:border-gray-700
                       hover:shadow-md dark:hover:shadow-slate-700/40`;

  // Hover effects
  const hoverClasses = "hover:scale-[1.015] hover:border-slate-200 dark:hover:border-slate-700";

  // Conditional styling for selected state
  let selectionSpecificClasses = "";
  let selectionIndicatorElement: ReactNode = null;

  // Default text colors
  let currentDateTimeColor = 'text-slate-800 dark:text-slate-100';
  let currentPrimaryTextColor = 'text-slate-500 dark:text-slate-400';
  let currentAmountColor = isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

  if (item.isSelected) {
    selectionSpecificClasses = `ring-1 ring-indigo-400 dark:ring-indigo-500 shadow-lg dark:shadow-indigo-900/50 bg-indigo-50/70 dark:bg-slate-800`;
    selectionIndicatorElement = <CheckCircle className="w-4 h-4 text-white absolute top-2 right-2 bg-indigo-500 dark:bg-indigo-400 rounded-full p-0.5 shadow" />;
    currentDateTimeColor = 'text-indigo-700 dark:text-indigo-300';
    currentPrimaryTextColor = 'text-indigo-600 dark:text-indigo-400';
    currentAmountColor = isCredit ? 'text-green-500 dark:text-green-300 font-semibold' : 'text-red-500 dark:text-red-300 font-semibold';
  } else {
    // Default styling for unselected items
    selectionSpecificClasses = "bg-gray-50 dark:bg-slate-800/60 shadow-sm dark:shadow-slate-900/30";
  }

  return (
    <div
      className={`${baseStyling} ${selectionSpecificClasses} ${hoverClasses} [&:not(:first-child)]:mt-2.5 [&:not(:last-child)]:mb-2.5`}
      onClick={() => item.onSelect(item._id)} // Tooltip for accessibility
    >
      {selectionIndicatorElement}
      <div className={`flex items-center space-x-3`}>
        {getBankIcon(item.bank)}

        <div className="flex-grow min-w-0">
          <p className={`text-sm font-medium ${currentPrimaryTextColor} line-clamp-2`} title={item.recipient}>
            {item.recipient}
          </p>
        </div>

        <div className={`flex flex-col items-end flex-shrink-0 ml-auto text-right`}>
          <div className={`text-md font-semibold whitespace-nowrap ${currentAmountColor} mb-0.5`}>
            {isCredit ? '+' : '-'}₹{parseFloat(item.amount.toString()).toFixed(2)}
          </div>
          <div className={`flex items-center text-xs font-semibold whitespace-nowrap ${currentDateTimeColor}`}>
            <Clock className="w-3.5 h-3.5 ml-1.5 mr-0.5 opacity-70" />
            <span className="opacity-90">{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;