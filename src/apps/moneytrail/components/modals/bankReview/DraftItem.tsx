import { FC, memo } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { Nullable, WithId } from '../../../../../engine/models/types';
import { DraftEntry } from '../../../engine/models/types';
import dayjs from 'dayjs';
import { AlphabetIcon } from '../../Common';
import { title } from 'framer-motion/client';

type DraftItemProps = {
    item: WithId<DraftEntry>;
    isSelected: boolean;
    setSelected: React.Dispatch<React.SetStateAction<Nullable<WithId<DraftEntry>>>>;
};

const styles = {
    base: {
        container: 'w-full rounded-lg bg-gray-50 p-2.5 font-sans transition-all duration-300 ease-in-out cursor-pointer relative overflow-hidden border border-gray-100 hover:shadow-md hover:scale-[1.015] hover:border-slate-200 [&:not(:first-child)]:mt-3 [&:not(:last-child)]:mb-3',
        title: 'text-sm font-medium line-clamp-2 capitalize',
        datetime: 'flex items-center text-xs font-semibold absolute bottom-2 right-2 px-1.5 py-1'
    },
    default: {
        container: 'shadow-sm',
        title: 'text-slate-500',
        datetime: 'text-slate-800'
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
    contentWrapper: 'flex items-start space-x-3',
    locationLink: 'cursor-default'
};

const DraftItemFC: FC<DraftItemProps> = ({ item, isSelected, setSelected }) => {
    const singleLineLocation = item.location.split('\n').join(', ');
    const firstLetter = singleLineLocation.charAt(0).toUpperCase() || '?';

    const containerStyle = `${styles.base.container} ${isSelected ? styles.selected.container : styles.default.container}`;
    const titleStyle = `${styles.base.title} ${isSelected ? styles.selected.title : styles.default.title}`;
    const datetimeStyle = `${styles.base.datetime} ${isSelected ? styles.selected.datetime : styles.default.datetime}`;
    const iconOverrideStyle = isSelected ? styles.selected.icon : undefined;

    const onSelect = (current: WithId<DraftEntry>) => setSelected(isSelected ? null : current);

    return (
        <div
            className={containerStyle}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onSelect(item)}
        >
            {isSelected && <CheckCircle className={styles.icon.checkCircle} />}
            <div className={styles.contentWrapper}>
                <a
                    target="_blank"
                    className={styles.locationLink}
                    href={`https://www.google.com/maps?q=${item.coordinate}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <AlphabetIcon {...{ firstLetter, seed: item._id, overrideStyle: iconOverrideStyle }} />
                </a>
                <div>
                    <p className={titleStyle} title={singleLineLocation}> {singleLineLocation} </p>
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
