import { ElementType, FC, useEffect } from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { DatePicker, Form, Input, InputNumber, Radio, Space } from 'antd';
import { X, IndianRupee, Layers2, Pencil, PieChart, Save, CalendarClock, CreditCard, MapPinned, MapPin, Loader2 } from 'lucide-react';
import { DefaultOptionType } from 'antd/es/select';
import { CustomSelect, SelectWithAdd } from '../../Common';
import { reviewApi, useCategoriesQuery, useDescriptionsQuery, useGroupsQuery } from '../../../store/reviewSlice';
import { useAppDispatch } from '../../../../../store/hooks';
import { PostParams, Routes } from '../../../../../engine/constant';
import { handleError, handleResponse } from '../../../../../engine/helpers/httpHelper';
import { notify } from '../../../../../engine/services/notificationService';
import { DraftEntry } from '../../../engine/models/types';
import { Nullable, WithId } from '../../../../../engine/models/types';
import dayjs from 'dayjs';

import HdfcLogo from '../../../../../static/hdfc.svg';
import SbiLogo from '../../../../../static/sbi.svg';
import CashLogo from '../../../../../static/cash.svg';
import ICICILogo from '../../../../../static/icici.svg';
import SBICCLogo from '../../../../../static/sbicc.svg';
import OtherPayLogo from '../../../../../static/otherpay.svg';

type FormState = {
  amount: number;
  description: string;
  category: number;
  group: number;
  date: Date;
  source: string;
  location: string;
  type: "Credit" | "Debit";
};

export const ManualEntryModal: FC<{
  draftEntry: Nullable<WithId<DraftEntry>>;
  setVisible: (isVisible: boolean) => void;
  setDraftItem: React.Dispatch<React.SetStateAction<Nullable<WithId<DraftEntry>>>>;
}> = ({
  draftEntry,
  setVisible,
  setDraftItem
}) => {
    const dispatch = useAppDispatch();
    const [isSaving, setIsSaving] = useState(false);

    const descriptions = useDescriptionsQuery();
    const groups = useGroupsQuery();
    const categories = useCategoriesQuery();

    const [form] = Form.useForm<FormState>();

    const descriptionOptions: DefaultOptionType[] = descriptions.data ?
      descriptions.data.value.map(item => ({
        label: <div className='text-gray-600 dark:text-gray-200 font-medium'>{item}</div>,
        value: item,
        title: item
      })) : [];

    const categoryOptions: DefaultOptionType[] = categories.data ?
      categories.data.categories.reduce((accumulator: any[], category: any) => {
        accumulator.push(category);
        if (category.subcategories.length)
          accumulator.push(...category.subcategories);
        return accumulator;
      }, []).map((category: any) => ({
        title: category.name,
        value: category.id,
        label: <div className='flex gap-2 items-center w-full'>
          <img src={category.icon_types.square.large} className='rounded-full w-6 h-6' />
          <span className='text-gray-600 dark:text-gray-200 font-medium'>{category.name}</span>
        </div>
      })) : [];

    const groupOptions: DefaultOptionType[] = groups.data ?
      groups.data.map(group => ({
        title: group.name,
        value: group.id,
        label: <div className='flex gap-2 items-center w-full'>
          <img src={group.avatar.large} className='rounded-full w-6 h-6' />
          <span className='text-gray-600 dark:text-gray-200 font-medium'>{group.name}</span>
        </div>
      })) : [];

    const sourceOptions: DefaultOptionType[] = [
      { name: "SBI", icon: SbiLogo },
      { name: "HDFC", icon: HdfcLogo },
      { name: "SBI Credit Card", icon: SBICCLogo },
      { name: "ICICI Credit Card", icon: ICICILogo },
      { name: "Cash", icon: CashLogo },
      { name: "Other", icon: OtherPayLogo }
    ].map(source => ({
      title: source.name,
      value: source.name,
      label: <div className='flex gap-2 items-center w-full'>
        <img className="w-5 h-5 rounded-full" src={source.icon} />
        <span className='text-gray-600 dark:text-gray-200 font-medium'>{source.name}</span>
      </div>
    }));

    const classes = {
      tr: "px-3 py-2 truncate overflow-hidden text-overflow-ellipsis whitespace-nowrap",
      th: "px-3 py-2 truncate overflow-hidden text-overflow-ellipsis whitespace-nowrap font-semibold tracking-wide",
      input: "flex items-center [&_input]:font-medium [&_input]:text-gray-600 dark:[&_input]:text-gray-200",
      select: "[&_.ant-select-selection-placeholder]:font-medium [&_input]:!caret-transparent"
    }

    const handleKeyDown = ({ key }: KeyboardEvent) => { if (key === 'Escape') onModalClose() };

    const onModalClose = () => {
      setVisible(false);
      setDraftItem(null);
    }

    const onComplete = () => {
      notify.success({ message: "Saved Successfully", description: "Expense Created in Splitwise!" });
      onModalClose();
    }

    const saveTransaction = (formState: FormState) => {
      const selectedGroup = groups.data?.find(group => group.id === formState.group);

      let payload = {
        group_id: selectedGroup?.id,
        cost: formState.amount,
        date: formState.date,
        description: formState.description,
        parties: selectedGroup?.members.map(m => m.id),
        category: formState.category,
        draftTxnId: draftEntry?._id,
        details: Object.entries({
          Source: formState.source,
          Location: formState.location ?? 'N/A',
          Coordinates: draftEntry?.coordinate ? `https://www.google.com/maps?q=${draftEntry.coordinate}` : 'N/A'
        }).map(([k, v]) => `${k} : ${v}\n——————`).join('\n'),
        ...(formState.type === 'Debit' ? { shared: selectedGroup?.sharing } : {})
      };

      const url = formState.type === 'Credit' ? Routes.SettleExpense : Routes.FinalizeExpense;

      fetch(url, { ...PostParams, body: JSON.stringify(payload) })
        .then(handleResponse)
        .then(onComplete)
        .catch(handleError)
        .finally(() => setIsSaving(false));
    }

    const onApprove = () => {
      setIsSaving(true);

      form.validateFields()
        .then(saveTransaction)
        .catch(() => {
          notify.error({
            message: "Failed to Save",
            description: "Provide the required details!"
          });

          setIsSaving(false);
        });
    };

    const onAddDescription = (option: DefaultOptionType) => {
      dispatch(reviewApi.util.updateQueryData("descriptions", undefined, (data) => {
        data.value.push(option.value as unknown as string);
      }));

      fetch(Routes.AddDescriptions, { ...PostParams, body: JSON.stringify({ item: option.value }) })
        .then(handleResponse)
        .then(() => notify.success({ message: "Success", description: "New description added!" }))
        .catch(handleError);
    }

    useEffect(() => {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

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
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[550px] max-w-7xl max-h-[90vh] overflow-hidden"
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Expense</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Add manual expense to splitwise</p>
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
            <div className="mx-auto px-14 py-12">
              <div className=" bg-gray-100/20 p-8 dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                <Form form={form} className="flex items-center flex-col gap-4">

                  <Space.Compact style={{ width: "100%" }}>
                    <PrefixIcon icon={CalendarClock} size={16} strokeWidth={3} />
                    <Form.Item name="date" noStyle rules={[{ required: true }]} initialValue={dayjs(draftEntry?.dateTime)}>
                      <DatePicker
                        showTime
                        style={{ width: "100%" }}
                        placeholder="Date"
                        format="DD-MMM-YYYY ↔ hh:mm A"
                        className={`${classes.input}`}

                      />
                    </Form.Item>
                  </Space.Compact>

                  <SelectWithAdd
                    name="description"
                    defaultOptions={descriptionOptions}
                    onAddOption={onAddDescription}
                    isLoading={descriptions.isLoading}
                    rules={[{ required: true }]}
                    placeholder="Description"
                    placement="bottomRight"
                    className={`${classes.select}`}
                    width="100%"
                    prefix={<PrefixIcon icon={Pencil} size={16} strokeWidth={3} />}
                  />

                  <Space.Compact style={{ width: "100%" }}>
                    <PrefixIcon icon={IndianRupee} size={16} strokeWidth={3} />
                    <Form.Item name="amount" noStyle rules={[{ required: true }]}>
                      <InputNumber
                        style={{ width: "100%" }}
                        placeholder="Amount"
                        className={`${classes.input}`}
                      />
                    </Form.Item>
                  </Space.Compact>

                  <CustomSelect
                    name="source"
                    defaultOptions={sourceOptions}
                    rules={[{ required: true }]}
                    placeholder="Source"
                    placement="bottomRight"
                    className={`${classes.select}`}
                    width="100%"
                    prefix={<PrefixIcon size={16} strokeWidth={3} icon={CreditCard} />}
                  />

                  <CustomSelect
                    name="category"
                    defaultOptions={categoryOptions}
                    isLoading={categories.isLoading}
                    rules={[{ required: true }]}
                    placeholder="Category"
                    placement="bottomRight"
                    className={`${classes.select}`}
                    width="100%"
                    prefix={<PrefixIcon icon={Layers2} size={16} strokeWidth={3} />}
                  />

                  <CustomSelect
                    name="group"
                    defaultOptions={groupOptions}
                    isLoading={groups.isLoading}
                    rules={[{ required: true }]}
                    placeholder="Group"
                    placement="bottomRight"
                    className={`${classes.select}`}
                    width="100%"
                    prefix={<PrefixIcon size={16} strokeWidth={3} icon={PieChart} />}
                  />

                  <Space.Compact style={{ width: "100%" }}>
                    <PrefixIcon icon={MapPin} size={16} strokeWidth={3} />
                    <Form.Item name="location" initialValue={draftEntry?.location.replaceAll('\n', ', ')} noStyle rules={[{ required: true }]}>
                      <Input
                        style={{ width: "100%" }}
                        placeholder="Location"
                        className={`${classes.input}`}
                      />
                    </Form.Item>
                  </Space.Compact>

                  <Space.Compact style={{ width: "100%" }} className="font-medium">
                    <label className="text-gray-500 dark:text-gray-300">Transaction Type</label>
                    <span className="text-gray-300 dark:text-gray-600 px-2">⎜</span>
                    <Form.Item name="type" noStyle rules={[{ required: true }]}>
                      <Radio.Group
                        options={[
                          { value: "Debit", label: 'Debit' },
                          { value: "Credit", label: 'Credit' }
                        ]}
                      />
                    </Form.Item>
                  </Space.Compact>
                </Form>
              </div>
            </div>
          </div>
          <div className="flex gap-3 border-t border-gray-200 dark:border-gray-700 px-14 py-6 justify-end">
            <button
              onClick={onApprove}
              type="submit"
              disabled={isSaving}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md font-medium shadow-sm transition-colors text-white bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 ${isSaving ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>
            <button
              onClick={onModalClose}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-md font-medium shadow-sm transition-colors text-gray-600 bg-gray-200 dark:bg-gray-500 hover:bg-gray-300 dark:hover:bg-gray-500 dark:text-gray-200"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

const PrefixIcon: FC<{ size: number, strokeWidth: number, icon: ElementType }> = ({ size, strokeWidth, icon: Icon }) => (
  <span className="text-sm px-3 py-[10px] border border-r-0 rounded-l-md border-gray-300 dark:border-[#424242] bg-gray-50 dark:bg-[#FFFFFF0A] text-gray-500 dark:text-gray-300">
    <Icon size={size} strokeWidth={strokeWidth} />
  </span>
)