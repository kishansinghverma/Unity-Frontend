import { FC, memo } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { Nullable, WithId } from '../../../../../engine/models/types';
import { DraftEntry } from '../../../engine/models/types';
import dayjs from 'dayjs';
import { AlphabetIcon } from '../../Common';

type DraftItemProps = {
    item: WithId<DraftEntry>;
    isSelected: boolean;
    setSelected: React.Dispatch<React.SetStateAction<Nullable<WithId<DraftEntry>>>>;
};

const styles = {
    base: {
        container: 'w-full rounded-lg p-2.5 font-sans transition-all duration-300 ease-in-out cursor-pointer relative overflow-hidden group border border-gray-100 hover:shadow-md hover:scale-[1.015] hover:border-slate-200 [&:not(:first-child)]:mt-3 [&:not(:last-child)]:mb-3',
        primaryText: 'text-sm font-medium line-clamp-2 flex capitalize',
        datetime: 'flex items-center bg-gray-50 text-xs font-semibold absolute bottom-2 right-2 px-1.5 py-1'
    },
    default: {
        container: 'bg-gray-50 shadow-sm',
        primaryText: 'text-slate-500',
        datetime: 'text-slate-800'
    },
    selected: {
        container: 'ring-1 ring-indigo-400 shadow-lg bg-indigo-50/70',
        primaryText: 'text-indigo-600',
        datetime: 'text-indigo-700',
        icon: 'bg-indigo-100 text-indigo-600'
    },
    icon: {
        checkCircle: 'w-4 h-4 text-white absolute top-2 right-2 bg-indigo-500 rounded-full p-0.5 shadow',
        clock: 'w-3.5 h-3.5 mr-0.5 opacity-85'
    },
    iconWrapper: 'flex items-start space-x-3',
    mapLink: 'cursor-default'
};

const DraftItemFC: FC<DraftItemProps> = ({ item, isSelected, setSelected }) => {
    const singleLineLocation = item.location.split('\n').join(', ');
    const firstLetter = singleLineLocation.charAt(0).toUpperCase() || '?';

    const containerClassName = `${styles.base.container} ${isSelected ? styles.selected.container : styles.default.container}`;
    const primaryTextClassName = `${styles.base.primaryText} ${isSelected ? styles.selected.primaryText : styles.default.primaryText}`;
    const datetimeClassName = `${styles.base.datetime} ${isSelected ? styles.selected.datetime : styles.default.datetime}`;
    const iconOverrideStyle = isSelected ? styles.selected.icon : undefined;

    const onSelect = (current: WithId<DraftEntry>) => setSelected(isSelected ? null : current);

    return (
        <div
            className={containerClassName}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onSelect(item)}
        >
            {isSelected && <CheckCircle className={styles.icon.checkCircle} />}
            <div className={styles.iconWrapper}>
                <a
                    target="_blank"
                    className={styles.mapLink}
                    href={`https://www.google.com/maps?q=${item.coordinate}`}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={(e) => e.stopPropagation()}
                >
                    <AlphabetIcon {...{ firstLetter, seed: item._id, overrideStyle: iconOverrideStyle }} />
                </a>
                <div>
                    <p className={primaryTextClassName} title={singleLineLocation}> {singleLineLocation} </p>
                    <div className={datetimeClassName}>
                        <Clock className={styles.icon.clock} />
                        <span>{dayjs(item.dateTime).format('hh:mm A')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const DraftItem = memo(DraftItemFC);
