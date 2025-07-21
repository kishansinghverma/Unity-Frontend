import { ReactNode, FC } from 'react';
import { CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { AlphabetIcon } from '../../Common';
import { Nullable, WithId } from '../../../../../engine/models/types';
import { DraftEntry } from '../../../engine/models/types';
import dayjs from 'dayjs';

export const DraftItem: FC<{
    item: WithId<DraftEntry>;
    isSelected: boolean;
    setSelected: React.Dispatch<React.SetStateAction<Nullable<WithId<DraftEntry>>>>
}> = ({
    item,
    isSelected,
    setSelected
}) => {
        const singleLineLocation = item.location.split('\n').join(', ');
        const firstLetter = singleLineLocation.charAt(0).toUpperCase() || '?';

        const baseStyling = `w-full rounded-lg p-2.5 font-sans transition-all duration-300 ease-in-out cursor-pointer relative overflow-hidden group
                       border border-gray-100 dark:border-gray-700
                       hover:shadow-md dark:hover:shadow-slate-700/40`;

        const hoverClasses = "hover:scale-[1.015] hover:border-slate-200 dark:hover:border-slate-700";

        let selectionSpecificClasses = "";
        let selectionIndicatorElement: ReactNode = null;

        let currentDateTimeColor = 'text-slate-800 dark:text-slate-100';
        let currentPrimaryTextColor = 'text-slate-500 dark:text-slate-400';

        let iconStyle;

        if (isSelected) {
            selectionSpecificClasses = `ring-1 ring-indigo-400 dark:ring-indigo-500 shadow-lg dark:shadow-indigo-900/50 bg-indigo-50/70 dark:bg-slate-800`;
            selectionIndicatorElement = <CheckCircle className="w-4 h-4 text-white absolute top-2 right-2 bg-indigo-500 dark:bg-indigo-400 rounded-full p-0.5 shadow" />;
            currentDateTimeColor = 'text-indigo-700 dark:text-indigo-300';
            currentPrimaryTextColor = 'text-indigo-600 dark:text-indigo-400';
            iconStyle = 'bg-indigo-100 dark:bg-indigo-700/50 text-indigo-600 dark:text-indigo-300';
        } else {
            selectionSpecificClasses = "bg-gray-50 dark:bg-slate-800/60 shadow-sm dark:shadow-slate-900/30";
        }

        const onSelect = (current: WithId<DraftEntry>) => {
            isSelected ? setSelected(null) : setSelected(current);
        }

        return (
            <div
                className={`${baseStyling} ${selectionSpecificClasses} ${hoverClasses} [&:not(:first-child)]:mt-3 [&:not(:last-child)]:mb-3`}
                onClick={() => onSelect(item)}
            >
                {selectionIndicatorElement}

                <div className="flex items-start space-x-3">
                    <a
                        target="_blank"
                        href={`https://www.google.com/maps?q=${item.coordinate}`}
                        onClick={(e) => e.stopPropagation()}
                        className="cursor-default"
                    >
                        <AlphabetIcon {...{ firstLetter, seed: item._id, overrideStyle: iconStyle }} />
                    </a>
                    <div className="flex-grow min-w-0 py-0.5">
                        <p className={`text-sm font-medium ${currentPrimaryTextColor} line-clamp-2 flex capitalize`} title={singleLineLocation}>
                            {singleLineLocation}
                        </p>
                        <div className={`flex items-center text-xs font-semibold absolute bottom-2 right-2 px-1.5 py-1`}>
                            <div className='bg-gradient-to-r from-transparent via-gray-50 to-gray-50 dark:via-slate-800/60 dark:to-slate-800/60 px-3'></div>
                            <div className={`${currentDateTimeColor} flex bg-gray-50 items-center  dark:bg-slate-800/60`}>
                                <Clock className="w-3.5 h-3.5 mr-0.5 opacity-85" />
                                <span className="opacity-100">{dayjs(item.dateTime).format('hh:mm A')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };