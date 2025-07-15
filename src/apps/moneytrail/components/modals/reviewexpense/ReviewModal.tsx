import { FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { InputNumber, Select } from 'antd';
import { X, CreditCard, Smartphone, FileText, Check, IndianRupee, Layers2, ChartPie, Pencil } from 'lucide-react';
import TransactionCard from './TransactionCard';
import { DraftItem } from './DraftItem';
import { getDraftMatches, getPhonePeMatches } from '../../../engine/utils';
import { TransactionContainer } from './TransactionContainer';
import { Nullable, WithId } from '../../../../../engine/models/types';
import { BankEntry, DraftEntry, PhonepeEntry } from '../../../engine/models/types';
import { PhonePeItem } from './PhonepeItem';
import dayjs from 'dayjs';
import { DefaultOptionType } from 'antd/es/select';
import { CustomSelect, SelectWithAdd } from '../../Common';
import { useDescriptionsQuery } from '../../../store/reviewSlice';

export const ReviewModal: FC<{
  bankItemId: string;
  bankEntries: WithId<BankEntry>[];
  phonepeEntries: WithId<PhonepeEntry>[];
  draftEntries: WithId<DraftEntry>[];
  setBankItemId: React.Dispatch<React.SetStateAction<Nullable<string>>>
}> = ({
  bankItemId,
  bankEntries,
  phonepeEntries,
  draftEntries,
  setBankItemId
}) => {
    const [selectedPhonepe, setSelectedPhonePe] = useState<Nullable<WithId<PhonepeEntry>>>(null);
    const [selectedDraft, setSelectedDraft] = useState<Nullable<WithId<DraftEntry>>>(null);

    const bankEntry = bankEntries.find(entry => entry._id === bankItemId)!;
    const phonepeMatches = getPhonePeMatches(bankEntry, phonepeEntries);
    const draftMatches = getDraftMatches(selectedPhonepe, draftEntries);

    const [amount, setAmount] = useState<Nullable<number>>(bankEntry.amount);

  const descriptions = useDescriptionsQuery();


    const classes = {
      tr: "px-3 py-2 truncate overflow-hidden text-overflow-ellipsis whitespace-nowrap",
      th: "px-3 py-2 truncate overflow-hidden text-overflow-ellipsis whitespace-nowrap font-semibold tracking-wide",
      iconColor: "text-gray-500 dark:text-gray-300"
    }

    const setColumnHeight = () => {
      const firstColumn: HTMLElement | null = document.querySelector('[data-first-column]');
      if (firstColumn) {
        const style = document.documentElement.style;
        style.setProperty('--first-col-height', '0px');
        style.setProperty('--first-col-height', `${firstColumn.offsetHeight}px`);
      }
    };

    const handleKeyDown = ({ key }: KeyboardEvent) => { if (key === 'Escape') onModalClose() };

    const onModalClose = () => setBankItemId(null);

    const onAmountChange = ({ currentTarget: { value } }: React.ChangeEvent<HTMLInputElement>) => {
      const amount = parseFloat(value);
      if (!isNaN(amount)) setAmount(amount);
    }

    const onApprove = () => { };

    useEffect(() => {
      setColumnHeight();
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);


    const [description, onSelectDescription] = useState<DefaultOptionType>();
    const [descriptionOptions, setDescriptionOptions] = useState<DefaultOptionType[]>([]);

    useEffect(() => {
      const options: DefaultOptionType[] = descriptions?.data?.value?.map(item => ({ label: item, value: item })) ?? [];
      console.log(options);
      setDescriptionOptions(options);
    }, [descriptions.isLoading])

    return (
      <motion.div
        onClick={onModalClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur backdrop-saturate-[0.8]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Modal Container */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 15, stiffness: 350 } },
            exit: { opacity: 0, scale: 0.8, transition: { duration: 0.15 } },
          }}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Review Bank Transaction</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Review and approve your transactions</p>
            </div>
            <button
              onClick={onModalClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="max-w-7xl mx-auto p-6">
              {/* Three Column Layout */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <TransactionContainer
                  isFirst
                  icon={CreditCard}
                  type="Bank"
                  headerStyle="from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
                  iconStyle="text-blue-600 dark:text-blue-400"
                >
                  <TransactionCard {...bankEntry} />
                </TransactionContainer>

                <TransactionContainer
                  icon={Smartphone}
                  type="PhonePe"
                  headerStyle="from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
                  iconStyle="text-purple-600 dark:text-purple-400"
                >
                  {phonepeMatches.map((item) => (
                    <PhonePeItem key={item._id} {...{
                      item,
                      isSelected: selectedPhonepe?._id === item._id,
                      setSelected: setSelectedPhonePe
                    }} />
                  ))}
                </TransactionContainer>

                <TransactionContainer
                  icon={FileText}
                  type="Draft"
                  headerStyle="from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20"
                  iconStyle="text-orange-600 dark:text-orange-400"
                >
                  {draftMatches.map((item) => (
                    <DraftItem key={item._id} {...{
                      item,
                      isSelected: selectedDraft?._id === item._id,
                      setSelected: setSelectedDraft
                    }} />
                  ))}
                </TransactionContainer>
              </div>

              {/* Transaction Details Table */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-4 py-3 border-b bg-gradient-to-r from-rose-50 to-pink-50/60 dark:from-rose-500/30 dark:to-pink-500/10 border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-800 dark:text-white">Transaction Details</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full table-fixed">
                    <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                      <tr className="text-left text-gray-500 dark:text-gray-400 text-sm">
                        <th className={`${classes.th} w-20`}>Date</th>
                        <th className={`${classes.th} w-12`}>Bank</th>
                        <th className={`${classes.th} w-52`}>Description</th>
                        <th className={`${classes.th} w-28`}>UTR / Transaction #</th>
                        <th className={`${classes.th} w-28`}>Recipient</th>
                        <th className={`${classes.th} w-40`}>Location</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white text-sm">
                        <td className={classes.tr}> {dayjs(bankEntry.date).format('DD-MM-YYYY')} </td>
                        <td className={classes.tr}> {bankEntry.bank} </td>
                        <td className={classes.tr}> {bankEntry.description} </td>
                        <td className={classes.tr}> {selectedPhonepe?.utr || '-'} </td>
                        <td className={classes.tr}> {selectedPhonepe?.recipient || '-'} </td>
                        <td className={classes.tr}> {selectedDraft?.location || '-'} </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Amount and Action Row */}
                <div className="bg-gray-50 dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <InputNumber
                        value={amount}
                        onChange={setAmount}
                        addonBefore={<IndianRupee size={16} strokeWidth={3} className={classes.iconColor} />}
                        placeholder="Amount"
                        className="w-32 [&_input]:!text-sm [&_input]:!font-medium [&_input]:!px-3 [&_input]:!py-2 [&_input]:!text-gray-600 dark:[&_input]:!text-gray-200"
                      />
                      <SelectWithAdd
                        defaultOptions={descriptionOptions}
                        onOptionSelected={onSelectDescription}
                        isLoading={ descriptions.isLoading}
                        placeholder="Description"
                        placement="topRight"
                        className="w-64 [&_input]:!text-sm [&_input]:!font-medium [&_input]:!py-3 [&_input]:!text-gray-600 dark:[&_input]:!text-gray-200"
                        prefix={<span className="text-sm px-3 py-[10px] border border-r-0 rounded-l-md border-gray-300 dark:border-[#424242] bg-gray-50 dark:bg-[#FFFFFF0A] text-gray-500 dark:text-gray-300">
                          <Pencil size={16} strokeWidth={3} />
                        </span>}
                      />
                      <SelectWithAdd
                        defaultOptions={descriptionOptions}
                        onOptionSelected={onSelectDescription}
                        isLoading={ descriptions.isLoading}
                        placeholder="Category"
                        placement="topRight"
                        className="w-48 [&_input]:!text-sm [&_input]:!font-medium [&_input]:!py-3 [&_input]:!text-gray-600 dark:[&_input]:!text-gray-200"
                        prefix={<span className="text-sm px-3 py-[10px] border border-r-0 rounded-l-md border-gray-300 dark:border-[#424242] bg-gray-50 dark:bg-[#FFFFFF0A] text-gray-500 dark:text-gray-300">
                          <Layers2 size={16} strokeWidth={3} />
                        </span>}
                      />
                      <CustomSelect
                        defaultOptions={descriptionOptions}
                        onOptionSelected={onSelectDescription}
                        placeholder="Splitwise"
                        placement="topRight"
                        className="w-48 [&_input]:!text-sm [&_input]:!font-medium [&_input]:!py-3 [&_input]:!text-gray-600 dark:[&_input]:!text-gray-200"
                        prefix={<span className="text-sm px-3 py-[10px] border border-r-0 rounded-l-md border-gray-300 dark:border-[#424242] bg-gray-50 dark:bg-[#FFFFFF0A] text-gray-500 dark:text-gray-300">
                          <ChartPie size={16} strokeWidth={3} />
                        </span>}
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={onModalClose}
                        className="flex items-center gap-2 px-4 py-2 text-sm rounded-md font-medium shadow-sm transition-colors text-gray-600 bg-gray-200 dark:bg-gray-500 hover:bg-gray-300 dark:hover:bg-gray-500 dark:text-gray-200"
                      >
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={onApprove}
                        className="flex items-center gap-2 px-4 py-2 text-sm rounded-md font-medium shadow-sm transition-colors text-white bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }