import dayjs from 'dayjs';
import { CheckCircle, Clock } from 'lucide-react';
import { FC, memo } from 'react';
import { DraftItemProps } from '../../../engine/contracts/props';
import { AlphabetIcon } from '../../shared/Common';

const styles = {
    container: 'w-full rounded-lg bg-gray-50 p-2.5 font-sans transition-all duration-300 ease-in-out cursor-pointer relative overflow-hidden border border-gray-100 hover:shadow-md hover:scale-[1.015] hover:border-slate-200 [&:not(:first-child)]:mt-3 [&:not(:last-child)]:mb-3',
    title: 'text-sm font-medium line-clamp-2 capitalize',
    datetime: 'flex items-center text-xs font-semibold absolute bottom-2 right-2 px-1.5 py-1 opacity-90',
    contentWrapper: 'flex items-center space-x-3',
    textBlock: 'flex-1 min-w-0 flex items-center pr-16',
    locationLink: 'cursor-alias',
    default: {
        container: 'shadow-sm',
        title: 'text-slate-500',
        datetime: 'text-slate-800',
        icon: undefined
    },
    selected: {
        container: 'ring-1 ring-indigo-400 shadow-lg bg-indigo-50/70',
        title: 'text-indigo-600',
        datetime: 'text-indigo-700',
        icon: 'bg-indigo-100 text-indigo-600'
    },
    icon: {
        checkCircle: 'w-4 h-4 text-white absolute top-2 right-2 bg-indigo-500 rounded-full p-0.5 shadow',
        clock: 'w-3.5 h-3.5 mr-0.5 opacity-85'
    },
};

const DraftItemFC: FC<DraftItemProps> = ({ item, isSelected, setSelected }) => {
    const singleLineLocation = item.location.split('\n').join(', ');
    const firstLetter = singleLineLocation.charAt(0).toUpperCase() || '?';

    const stateStyles = isSelected ? styles.selected : styles.default;
    const containerStyle = `${styles.container} ${stateStyles.container}`;
    const titleStyle = `${styles.title} ${stateStyles.title}`;
    const datetimeStyle = `${styles.datetime} ${stateStyles.datetime}`;
    const iconOverrideStyle = stateStyles.icon

    return (
        <div
            className={containerStyle}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setSelected(isSelected ? null : item)}
        >
            {isSelected && <CheckCircle className={styles.icon.checkCircle} />}
            <div className={styles.contentWrapper}>
                <a
                    target="_blank"
                    className={styles.locationLink}
                    href={`https://www.google.com/maps?q=${item.coordinate}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <AlphabetIcon firstLetter={firstLetter} seed={item._id} overrideStyle={iconOverrideStyle} />
                </a>
                <div className={styles.textBlock}>
                    <p className={titleStyle} title={singleLineLocation}>{singleLineLocation}</p>
                    <div className={datetimeStyle}>
                        <Clock className={styles.icon.clock} />
                        <span>{dayjs(item.dateTime).format('hh:mm A')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const DraftItem = memo(DraftItemFC);
