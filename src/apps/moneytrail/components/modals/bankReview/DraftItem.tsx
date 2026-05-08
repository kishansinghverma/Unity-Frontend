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
    containerBase: 'w-full rounded-lg p-2.5 font-sans transition-all duration-300 ease-in-out cursor-pointer relative overflow-hidden group border border-gray-100 hover:shadow-md hover:scale-[1.015] hover:border-slate-200 [&:not(:first-child)]:mt-3 [&:not(:last-child)]:mb-3',
    containerDefault: 'bg-gray-50 shadow-sm',
    containerSelected: 'ring-1 ring-indigo-400 shadow-lg bg-indigo-50/70',
    checkCircle: 'w-4 h-4 text-white absolute top-2 right-2 bg-indigo-500 rounded-full p-0.5 shadow',
    primaryTextBase: 'text-sm font-medium line-clamp-2 flex capitalize',
    primaryTextDefault: 'text-slate-500',
    primaryTextSelected: 'text-indigo-600',
    datetimeBase: 'flex items-center bg-gray-50 text-xs font-semibold absolute bottom-2 right-2 px-1.5 py-1',
    datetimeDefault: 'text-slate-800',
    datetimeSelected: 'text-indigo-700',
    clockIcon: 'w-3.5 h-3.5 mr-0.5 opacity-85',
    iconWrapper: 'flex items-start space-x-3'
};

const DraftItemFC: FC<DraftItemProps> = ({ item, isSelected, setSelected }) => {
    const singleLineLocation = item.location.split('\n').join(', ');
    const firstLetter = singleLineLocation.charAt(0).toUpperCase() || '?';
    const containerClassName = `${styles.containerBase} ${isSelected ? styles.containerSelected : styles.containerDefault}`;
    const primaryTextClassName = `${styles.primaryTextBase} ${isSelected ? styles.primaryTextSelected : styles.primaryTextDefault}`;
    const datetimeClassName = `${styles.datetimeBase} ${isSelected ? styles.datetimeSelected : styles.datetimeDefault}`;
    const iconOverrideStyle = isSelected ? 'bg-indigo-100 text-indigo-600' : undefined;

    const onSelect = (current: WithId<DraftEntry>) => setSelected(isSelected ? null : current);

    return (
        <div
            className={containerClassName}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onSelect(item)}
        >
            {isSelected && <CheckCircle className={styles.checkCircle} />}
            <div className={styles.iconWrapper}>
                <a
                    target="_blank"
                    className="cursor-default"
                    href={`https://www.google.com/maps?q=${item.coordinate}`}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={(e) => e.stopPropagation()}
                >
                    <AlphabetIcon {...{ firstLetter, seed: item._id, overrideStyle: iconOverrideStyle }} />
                </a>
                <div>
                    <p className={primaryTextClassName} title={singleLineLocation}> {singleLineLocation} </p>
                    <div className={datetimeClassName}>
                        <Clock className={styles.clockIcon} />
                        <span>{dayjs(item.dateTime).format('hh:mm A')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const DraftItem = memo(DraftItemFC);
