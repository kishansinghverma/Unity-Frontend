import React, { ReactNode, FC } from 'react'; // Removed useState as it's not used in this isolated module
import { CheckCircle, Clock } from 'lucide-react';

// --- Type Definitions ---
interface IconProps {
  className?: string;
  title?: string;
}

// Data structure for a single transaction
export interface TransactionData {
  id: string;
  date: string;       // ISO date string e.g., "2025-02-07T13:49:00.000Z"
  recipient: string;  // e.g., "XXXXXX0041" or "Payment to..."
  bank: string;       // e.g., "SBI" - used for tooltips or mapping to specific bank icons
  type: 'Debit' | 'Credit'; // Type of transaction
  amount: number;
  // icon prop is part of TransactionData if you want to pass it with the data object.
  // Alternatively, iconDisplay in TransactionItemProps handles the actual icon to render.
  icon?: ReactNode;   // Optional: The icon component or element for the bank/transaction type
}

// Props for the TransactionItem component
export interface TransactionItemProps extends Omit<TransactionData, 'icon'> {
  iconDisplay: ReactNode; // The actual icon ReactNode to render (e.g., <PlaceholderBankIcon />)
  isSelected: boolean;
  onSelect: (id: string) => void; // Callback function when item is selected
  currency?: string;        // Currency symbol, defaults to '₹'
}

// Generic placeholder for bank icons
export const PlaceholderBankIcon: FC<IconProps> = ({ className, title = "Bank Icon" }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} rounded-lg`} aria-label={title}>
    <rect width="48" height="48" rx="10" fill="url(#iconGradientDefReusable)" />
    <defs>
      <linearGradient id="iconGradientDefReusable" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#E0E7FF" />
        <stop offset="100%" stopColor="#C7D2FE" />
      </linearGradient>
    </defs>
    <path d="M12 18L24 12L36 18V20H12V18Z" fill="#4338CA" />
    <path d="M15 36V22H13V36H15ZM22.5 36V22H20.5V36H22.5ZM30 36V22H28V36H30Z" fill="#4338CA" />
    <rect x="10" y="34" width="28" height="2" rx="1" fill="#3730A3" />
  </svg>
);

// --- Helper function to format date and time ---
const formatDateAndTime = (dateString: string): { day: string, month: string, time: string } => {
  try {
    const dateObj = new Date(dateString);
    // Check if dateObj is a valid date
    if (isNaN(dateObj.getTime())) {
        throw new Error("Invalid date value");
    }
    const day = dateObj.getDate().toString();
    const month = dateObj.toLocaleString('default', { month: 'short' });
    // Format time to hh:mm AM/PM
    const time = dateObj.toLocaleTimeString('en-US', { 
        hour: 'numeric',    // e.g., 1, 2, ..., 12
        minute: '2-digit',  // e.g., 05, 30
        hour12: true        // Use AM/PM
    });
    return { day, month, time };
  } catch (error) {
    // Log error for debugging purposes
    console.error("Error parsing date:", dateString, error);
    // Return placeholder values for display
    return { day: "??", month: "???", time: "--:-- --" };
  }
};

// --- TransactionItem Component ---
export const TransactionItem: FC<TransactionItemProps> = ({
  id,
  date: dateString,
  recipient,
  bank,
  amount,
  type,
  iconDisplay, // This is the actual icon element to render
  isSelected,
  onSelect,
  currency = '₹', // Default currency to Rupee symbol
}) => {
  const { day, month, time } = formatDateAndTime(dateString);
  const isCredit = type === 'Credit';

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
  let currentRecipientColor = 'text-slate-700 dark:text-slate-200';
  let currentDateTimeColor = 'text-slate-500 dark:text-slate-400';
  let currentAmountColor = isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

  if (isSelected) {
    selectionSpecificClasses = `ring-1 ring-indigo-400 dark:ring-indigo-500 shadow-lg dark:shadow-indigo-900/50 bg-indigo-50/70 dark:bg-slate-800`;
    selectionIndicatorElement = <CheckCircle className="w-4 h-4 text-white absolute top-2 right-2 bg-indigo-500 dark:bg-indigo-400 rounded-full p-0.5 shadow" />;
    currentRecipientColor = 'text-indigo-700 dark:text-indigo-300';
    currentDateTimeColor = 'text-indigo-600 dark:text-indigo-400';
    currentAmountColor = isCredit ? 'text-green-500 dark:text-green-300 font-semibold' : 'text-red-500 dark:text-red-300 font-semibold';
  } else {
    // Default styling for unselected items
    selectionSpecificClasses = "bg-gray-50 dark:bg-slate-800/60 shadow-sm dark:shadow-slate-900/30";
  }

  return (
    <div 
      className={`${baseStyling} ${selectionSpecificClasses} ${hoverClasses} [&:not(:first-child)]:mt-2.5 [&:not(:last-child)]:mb-2.5`}
      onClick={() => onSelect(id)} 
      title={`Transaction with ${bank} on ${month} ${day} at ${time}`} // Tooltip for accessibility
    >
      {selectionIndicatorElement}
      {/* Flex container for the row content, items are vertically centered by default */}
      <div className={`flex items-center space-x-3`}>
        {/* Icon container for the bank/transaction type */}
        <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-slate-100 dark:bg-slate-700/80 rounded-md p-0.5 shadow-inner`}>
          {/* Render the passed iconDisplay prop */}
          {React.isValidElement(iconDisplay) ? 
            React.cloneElement(iconDisplay as React.ReactElement<any>, { className: 'w-full h-full object-contain rounded' }) :
            // Fallback to a placeholder if iconDisplay is not a valid element, though it's expected to be.
            <PlaceholderBankIcon className="w-full h-full" /> 
          }
        </div>

        {/* Recipient information section */}
        <div className="flex-grow min-w-0"> {/* min-w-0 is important for text truncation to work correctly in flex items */}
          <p className={`text-sm font-medium ${currentRecipientColor} line-clamp-2`}title={recipient}>
            {recipient}
          </p>
        </div>

        {/* Amount and Date/Time section */}
        <div className={`flex flex-col items-end flex-shrink-0 ml-auto text-right`}>
          <div className={`text-md font-semibold whitespace-nowrap ${currentAmountColor} mb-0.5`}>
            {isCredit ? '+' : '-'} {currency}{parseFloat(amount.toString()).toFixed(2)}
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