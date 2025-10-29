import { FC, memo } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { AlphabetIcon } from '../../Common';
import { Nullable, WithId } from '../../../../../engine/models/types';
import { DraftEntry } from '../../../engine/models/types';
import dayjs from 'dayjs';

type DraftItemProps = {
    item: WithId<DraftEntry>;
    isSelected: boolean;
    setSelected: React.Dispatch<React.SetStateAction<Nullable<WithId<DraftEntry>>>>;
};

const styles = {
    container: 'w-full rounded-lg p-2.5 font-sans transition-all duration-300 ease-in-out cursor-pointer relative overflow-hidden group border border-gray-100 dark:border-gray-700 hover:shadow-md dark:hover:shadow-slate-700/40 hover:scale-[1.015] hover:border-slate-200 dark:hover:border-slate-700 [&:not(:first-child)]:mt-3 [&:not(:last-child)]:mb-3',
    checkCircle: 'w-4 h-4 text-white absolute top-2 right-2 bg-indigo-500 dark:bg-indigo-400 rounded-full p-0.5 shadow',
    primaryText: 'text-sm font-medium line-clamp-2 flex capitalize',
    datetime: 'flex items-center bg-gray-50 dark:bg-slate-800/60 text-xs font-semibold absolute bottom-2 right-2 px-1.5 py-1',
    clockIcon: 'w-3.5 h-3.5 mr-0.5 opacity-85',
    iconWrapper: 'flex items-start space-x-3'
};

const styleMap = {
    base: {
        textIcon: null,
        datetime: `text-slate-800 dark:text-slate-100 ${styles.datetime}`,
        primaryText: `text-slate-500 dark:text-slate-400 ${styles.primaryText}`,
        container: `bg-gray-50 dark:bg-slate-800/60 shadow-sm dark:shadow-slate-900/30 ${styles.container}`
    },
    onSelect: {
        textIcon: 'bg-indigo-100 dark:bg-indigo-700/50 text-indigo-600 dark:text-indigo-300',
        datetime: `text-indigo-700 dark:text-indigo-300 ${styles.datetime}`,
        primaryText: `text-indigo-600 dark:text-indigo-400 ${styles.primaryText}`,
        container: `ring-1 ring-indigo-400 dark:ring-indigo-500 shadow-lg dark:shadow-indigo-900/50 bg-indigo-50/70 dark:bg-slate-800 ${styles.container}`
    }
};

const DraftItemFC: FC<DraftItemProps> = ({ item, isSelected, setSelected }) => {
    const style = { ...styles, ...(isSelected ? styleMap.onSelect : styleMap.base) };
    const singleLineLocation = item.location.split('\n').join(', ');
    const firstLetter = singleLineLocation.charAt(0).toUpperCase() || '?';

    const onSelect = (current: WithId<DraftEntry>) => setSelected(isSelected ? null : current);

    return (
        <div className={style.container} onClick={() => onSelect(item)}>
            {isSelected && <CheckCircle className={style.checkCircle} />}
            <div className={style.iconWrapper}>
                <a
                    target="_blank"
                    className="cursor-default"
                    href={`https://www.google.com/maps?q=${item.coordinate}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <AlphabetIcon {...{ firstLetter, seed: item._id, overrideStyle: style.textIcon }} />
                </a>
                <div>
                    <p className={style.primaryText} title={singleLineLocation}> {singleLineLocation} </p>
                    <div className={style.datetime}>
                        <Clock className={style.clockIcon} />
                        <span>{dayjs(item.dateTime).format('hh:mm A')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const DraftItem = memo(DraftItemFC);