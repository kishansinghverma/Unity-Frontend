import dayjs from 'dayjs';
import { CheckCircle, Clock } from 'lucide-react';
import { FC, memo } from 'react';
import { getFormattedAmount } from '../../../../../../../../engine/helpers/numberHelper';
import { BankIcon } from '../../../../../../components/Common';
import { PaymentAppItemProps } from '../../../../engine/contracts/props';

const styles = {
  container: 'w-full rounded-lg bg-gray-50 p-2.5 font-sans transition-all duration-300 ease-in-out cursor-pointer relative overflow-hidden border border-gray-100 hover:shadow-md hover:scale-[1.015] hover:border-slate-200 [&:not(:first-child)]:mt-2.5 [&:not(:last-child)]:mb-2.5',
  rightSection: 'flex flex-col items-end flex-shrink-0 ml-auto text-right',
  content: 'flex items-center space-x-3',
  title: 'text-sm font-medium line-clamp-2 capitalize',
  datetime: 'flex items-center text-xs font-semibold whitespace-nowrap opacity-90',
  amount: 'font-semibold whitespace-nowrap mb-0.5',
  iconWrapper: 'flex-shrink-0',
  titleWrapper: 'flex-grow min-w-0',
  default: {
    container: 'shadow-sm',
    title: 'text-slate-500',
    datetime: 'text-slate-800',
    creditAmount: 'text-green-600',
    debitAmount: 'text-red-600'
  },
  selected: {
    container: 'shadow-lg ring-1 ring-indigo-400 bg-indigo-50/70',
    title: 'text-indigo-600',
    datetime: 'text-indigo-700',
    creditAmount: 'text-green-500',
    debitAmount: 'text-red-500'
  },
  icon: {
    clock: 'w-3.5 h-3.5 ml-1.5 mr-0.5',
    checkCircle: 'w-4 h-4 text-white absolute top-2 right-2 bg-indigo-500 rounded-full p-0.5 shadow',
  }
};

const PaymentAppItemFC: FC<PaymentAppItemProps> = ({
  item,
  isSelected,
  setSelected
}) => {
    const isCredit = item.type === 'Credit';
    const stateStyles = isSelected ? styles.selected : styles.default;
    const containerStyle = `${styles.container} ${stateStyles.container}`;
    const titleStyle = `${styles.title} ${stateStyles.title}`;
    const amountStyle = `${styles.amount} ${isCredit ? stateStyles.creditAmount : stateStyles.debitAmount}`;
    const datetimeStyle = `${styles.datetime} ${stateStyles.datetime}`;

    return (
      <div
        className={containerStyle}
        onClick={() => setSelected(isSelected ? null : item)}
      >
        {isSelected && <CheckCircle className={styles.icon.checkCircle} />}
        <div className={styles.content}>
          <div className={styles.iconWrapper}><BankIcon bankName={item.bank} /></div>
          <div className={styles.titleWrapper}>
            <p className={titleStyle} title={item.recipient}>{item.recipient}</p>
          </div>

          <div className={styles.rightSection}>
            <div className={amountStyle}>
              {isCredit ? '+' : '-'}₹{getFormattedAmount(item.amount)}
            </div>
            <div className={datetimeStyle}>
              <Clock className={styles.icon.clock} />
              <span>{dayjs(item.date).format('hh:mm A')}</span>
            </div>
          </div>
        </div>
      </div>
    )
  };

export const PaymentAppItem = memo(PaymentAppItemFC);
