import React, { useState, ReactNode } from 'react';

// --- Type Definitions ---
interface IconProps {
  className?: string;
}

interface TransactionData {
  id: string;
  day: string;
  month: string;
  icon: ReactNode;
  upiId: string;
  transactionInfo: string;
  amount: number;
  isCredit: boolean;
}

interface TransactionItemProps extends TransactionData {
  isSelected: boolean;
  onSelect: (id: string) => void;
  animationStyle?: 'slide-right-subtle' | 'scale-up' | 'glow-border' | 'slide-and-glow' | 'shadow-lift'; // Example animation styles
  selectionStyle?: 'checkmark' | 'accent-border' | 'accent-border-green' | 'background-tint'; // Example selection styles
  currency?: string;
}

interface TransactionContainerProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}


// --- Icon Components ---
const CheckIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
);

const PlaceholderBankIcon: React.FC = () => ( // No className prop needed if not used
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-xl">
    <rect width="48" height="48" rx="12" fill="url(#iconGradientDef)" />
    <defs>
      <linearGradient id="iconGradientDef" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#E0E7FF" /> {/* Light Indigo */}
        <stop offset="100%" stopColor="#C7D2FE" /> {/* Indigo */}
      </linearGradient>
    </defs>
    <path d="M18 36V22H14V36H18ZM24 36V22H20V36H24ZM30 36V22H26V36H30ZM12 19L24 12L36 19V20H12V19Z" fill="#4338CA" /> {/* Indigo-700 */}
  </svg>
);

const PhoneIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
);

const DocumentIcon: React.FC<IconProps> = ({ className = "w-16 h-16" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);


// --- TransactionItem Component ---
export const TransactionItem: React.FC<TransactionItemProps> = ({
  id,
  day,
  month,
  icon,
  upiId,
  transactionInfo,
  amount,
  currency = '₹',
  isCredit = true,
  isSelected,
  onSelect,
  selectionStyle = 'checkmark',
}) => {
  const baseStyling = "w-full rounded-2xl p-4 my-3 font-sans transition-all duration-300 ease-in-out cursor-pointer relative overflow-hidden";
  const hoverClasses = "hover:translate-x-1 hover:shadow-lg"; 

  let selectionSpecificClasses = "";
  let selectionIndicatorElement: ReactNode = null; 

  let currentUpiIdColor = 'text-slate-700';
  let currentTransactionInfoColor = 'text-slate-500';
  let currentDateColor = 'text-slate-500';
  let currentAmountColor = isCredit ? 'text-emerald-600' : 'text-rose-600';

  if (isSelected) {
    // Subtle 'checkmark' style for selected item
    selectionSpecificClasses = "bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 ring-1 ring-indigo-300"; 
    selectionIndicatorElement = <CheckIcon className="w-6 h-6 text-indigo-500 absolute top-3 right-3 bg-white rounded-full p-0.5 shadow-md" />; 
    currentUpiIdColor = 'text-indigo-700'; 
    currentTransactionInfoColor = 'text-indigo-500'; 
    currentDateColor = 'text-indigo-400'; 
    currentAmountColor = isCredit ? 'text-emerald-600' : 'text-rose-600'; 
  } else {
    // Non-selected items are clean white cards
    selectionSpecificClasses = "bg-white shadow-md"; 
  }

  return (
    <div className={`${baseStyling} ${selectionSpecificClasses} ${hoverClasses}`} onClick={() => onSelect(id)}>
      {selectionIndicatorElement} 
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {React.isValidElement(icon) && (icon.props as any).className ? icon :
           typeof icon === 'string' ? <img src={icon} alt="Transaction Icon" className="w-10 h-10 rounded-lg object-cover"/> :
           icon || <PlaceholderBankIcon />}
        </div>

        <div className="flex-grow min-w-0">
          <p className={`text-sm font-semibold truncate ${currentUpiIdColor}`} title={upiId}>
            {upiId}
          </p>
          <p className={`text-xs truncate ${currentTransactionInfoColor}`} title={transactionInfo}>
            {transactionInfo}
          </p>
        </div>

        <div className="flex flex-col items-end flex-shrink-0 ml-2">
          <div className={`text-xs mb-0.5 whitespace-nowrap ${currentDateColor}`}>
            {month} {day}
          </div>
          <div className={`text-base font-bold whitespace-nowrap ${currentAmountColor}`}>
            {isCredit ? '+' : ''} {currency}{parseFloat(amount.toString()).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};