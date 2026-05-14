import dayjs from 'dayjs';
import { CheckCircle, Clock } from 'lucide-react';
import { FC } from 'react';
import { Nullable, WithId } from '../../../../../engine/models/types';
import { PhonePeEntry } from '../../../engine/models/types';
import { BankIcon } from '../../Common';
import { getFormattedAmount } from '../../../../../engine/helpers/numberHelper';

const styles = {
  base: {
    container: 'w-full rounded-lg bg-gray-50 p-2.5 font-sans transition-all duration-300 ease-in-out cursor-pointer relative overflow-hidden border border-gray-100 hover:shadow-md hover:scale-[1.015] hover:border-slate-200 [&:not(:first-child)]:mt-2.5 [&:not(:last-child)]:mb-2.5',
    indicator: 'w-4 h-4 text-white absolute top-2 right-2 bg-indigo-500 rounded-full p-0.5 shadow',
    content: 'flex items-center space-x-3',
    iconWrapper: 'flex-shrink-0',
    titleWrapper: 'flex-grow min-w-0',
    title: 'text-sm font-medium line-clamp-2 capitalize',
    rightSection: 'flex flex-col items-end flex-shrink-0 ml-auto text-right',
    amount: 'font-semibold whitespace-nowrap mb-0.5',
    datetime: 'flex items-center text-xs font-semibold whitespace-nowrap',
    clock: 'w-3.5 h-3.5 ml-1.5 mr-0.5 opacity-70',
    time: 'opacity-90'
  },
  default: {
    container: 'shadow-sm',
    title: 'text-slate-500',
    datetime: 'text-slate-800',
    amount: {
      credit: 'text-green-600',
      debit: 'text-red-600'
    }
  },
  selected: {
    container: 'ring-1 ring-indigo-400 shadow-lg bg-indigo-50/70',
    title: 'text-indigo-600',
    datetime: 'text-indigo-700',
    amount: {
      credit: 'text-green-500',
      debit: 'text-red-500'
    }
  }
};

export const PhonePeItem: FC<{
  item: WithId<PhonePeEntry>;
  isSelected: boolean;
  setSelected: React.Dispatch<React.SetStateAction<Nullable<WithId<PhonePeEntry>>>>
}> = ({
  item,
  isSelected,
  setSelected
}) => {
    const isCredit = item.type === 'Credit';
    const stateStyles = isSelected ? styles.selected : styles.default;
    const containerStyle = `${styles.base.container} ${stateStyles.container}`;
    const titleStyle = `${styles.base.title} ${stateStyles.title}`;
    const amountStyle = `${styles.base.amount} ${isCredit ? stateStyles.amount.credit : stateStyles.amount.debit}`;
    const datetimeStyle = `${styles.base.datetime} ${stateStyles.datetime}`;

    const onSelect = (current: WithId<PhonePeEntry>) => setSelected(isSelected ? null : current);

    return (
      <div
        className={containerStyle}
        onClick={() => onSelect(item)}
      >
        {isSelected && <CheckCircle className={styles.base.indicator} />}
        <div className={styles.base.content}>
          <div className={styles.base.iconWrapper}><BankIcon bankName={item.bank} /></div>
          <div className={styles.base.titleWrapper}>
            <p className={titleStyle} title={item.recipient}>
              {item.recipient}
            </p>
          </div>

          <div className={styles.base.rightSection}>
            <div className={amountStyle}>
              {isCredit ? '+' : '-'}₹{getFormattedAmount(item.amount)}
            </div>
            <div className={datetimeStyle}>
              <Clock className={styles.base.clock} />
              <span className={styles.base.time}>{dayjs(item.date).format('hh:mm A')}</span>
            </div>
          </div>
        </div>
      </div>
    )
  };
