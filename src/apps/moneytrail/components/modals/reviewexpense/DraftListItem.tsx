import { ReactNode, FC } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { getDateComponent } from '../../../../../engine/helpers/dateTimeHelper';
import { AlphabetIcon } from '../../Common';

// Data structure for a single location history entry
export interface LocationHistoryData {
    id: string; // Unique identifier for the entry
    dateTime: string; // ISO date string e.g., "2025-02-22T17:42:48+05:30"
    location: string; // Multi-line location string e.g., "Sector 40\nGurugram 122001\nHaryana\nIndia"
}

// Props for the LocationHistoryItem component
export interface LocationHistoryItemProps extends LocationHistoryData {
    isSelected: boolean;
    onSelect: (id: string) => void; // Callback function when item is selected
}

// --- LocationHistoryItem Component ---
export const LocationHistoryItem: FC<LocationHistoryItemProps> = ({
    id,
    dateTime: dateTimeString,
    location,
    isSelected,
    onSelect,
}) => {
    const { time } = getDateComponent(dateTimeString);
    const singleLineLocation = location.split('\n').join(', ');
    const firstLetter = singleLineLocation.charAt(0).toUpperCase() || '?';

    const baseStyling = `w-full rounded-lg p-2.5 font-sans transition-all duration-300 ease-in-out cursor-pointer relative overflow-hidden group
                       border border-gray-100 dark:border-gray-700
                       hover:shadow-md dark:hover:shadow-slate-700/40`;

    const hoverClasses = "hover:scale-[1.015] hover:border-slate-200 dark:hover:border-slate-700";

    let selectionSpecificClasses = "";
    let selectionIndicatorElement: ReactNode = null;

    let currentDateTimeColor = 'text-slate-800 dark:text-slate-100';
    let currentPrimaryTextColor = 'text-slate-500 dark:text-slate-400';

    // Initialize icon colors with generated subtle colors
    let iconStyle;

    if (isSelected) {
        selectionSpecificClasses = `ring-1 ring-indigo-400 dark:ring-indigo-500 shadow-lg dark:shadow-indigo-900/50 bg-indigo-50/70 dark:bg-slate-800`;
        selectionIndicatorElement = <CheckCircle className="w-4 h-4 text-white absolute top-2 right-2 bg-indigo-500 dark:bg-indigo-400 rounded-full p-0.5 shadow" />;
        currentDateTimeColor = 'text-indigo-700 dark:text-indigo-300';
        currentPrimaryTextColor = 'text-indigo-600 dark:text-indigo-400';
        iconStyle = 'bg-indigo-100 dark:bg-indigo-700/50 text-indigo-600 dark:text-indigo-300';
    } else {
        // Default styling for unselected items
        selectionSpecificClasses = "bg-gray-50 dark:bg-slate-800/60 shadow-sm dark:shadow-slate-900/30";
    }

    return (
        <div
            className={`${baseStyling} ${selectionSpecificClasses} ${hoverClasses} [&:not(:first-child)]:mt-3 [&:not(:last-child)]:mb-3`}
            onClick={() => onSelect(id)}
        >
            {selectionIndicatorElement}

            <div className="flex items-start space-x-3">
                <AlphabetIcon {...{ firstLetter, seed: id, overrideStyle: iconStyle }} />

                <div className="flex-grow min-w-0 py-0.5">
                    <p className={`text-sm font-medium ${currentPrimaryTextColor} line-clamp-2`} title={singleLineLocation}>
                        {singleLineLocation}
                    </p>
                    <div className={`flex items-center text-xs font-semibold absolute bottom-2 right-2 px-1.5 py-1`}>
                        <div className='bg-gradient-to-r from-transparent via-gray-50 to-gray-50 dark:via-slate-800/60 dark:to-slate-800/60 px-3'>&nbsp;</div>
                        <div className={`${currentDateTimeColor} flex bg-gray-50 items-center  dark:bg-slate-800/60`}>
                            <Clock className="w-3.5 h-3.5 mr-0.5 opacity-85" />
                            <span className="opacity-100">{time}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};