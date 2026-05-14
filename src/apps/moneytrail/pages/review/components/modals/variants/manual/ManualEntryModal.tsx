import { DatePicker, Form, Input, InputNumber, Radio, Space } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import dayjs from 'dayjs';
import { X, IndianRupee, Layers2, Pencil, PieChart, Save, CalendarClock, CreditCard, MapPin, Loader2 } from 'lucide-react';
import { FC, useState } from 'react';
import { PostParams, Routes } from '../../../../../../../../engine/constant';
import { handleResponse, handleError } from '../../../../../../../../engine/helpers/httpHelper';
import { notify } from '../../../../../../../../engine/services/notificationService';
import { useAppDispatch } from '../../../../../../../../store/hooks';
import { SelectWithAdd, CustomSelect } from '../../../../../../components/Common';
import { ManualEntryModalProps, PrefixIconProps } from '../../../../../../engine/contracts/props';
import { SplitwiseCategory } from '../../../../../../engine/types';
import { useDescriptionsQuery, useGroupsQuery, useCategoriesQuery, reviewApi } from '../../../../../../store/reviewSlice';
import { AnimatedModal } from '../../shared/AnimatedModal';
import { getIcon, icon } from '../../../../../../../../static/icons/provider';

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

const LAST_SOURCE_KEY = 'moneytrail.manualEntry.lastSource';

export const ManualEntryModal: FC<ManualEntryModalProps> = ({
  draftEntry,
  setVisible,
  setDraftItem
}) => {
    const dispatch = useAppDispatch();
    const [isSaving, setIsSaving] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const [lastSource, setLastSource] = useState<string | null>(() => {
      const saved = localStorage.getItem(LAST_SOURCE_KEY);
      return saved && saved.trim().length > 0 ? saved : null;
    });

    const descriptions = useDescriptionsQuery();
    const groups = useGroupsQuery();
    const categories = useCategoriesQuery();

    const [form] = Form.useForm<FormState>();

    const descriptionOptions: DefaultOptionType[] = descriptions.data ?
      descriptions.data.value.map(item => ({
        label: <div className='text-gray-600 font-medium'>{item}</div>,
        value: item,
        title: item
      })) : [];

    const categoryOptions: DefaultOptionType[] = categories.data ?
      categories.data.categories.reduce((accumulator: SplitwiseCategory[], category: SplitwiseCategory) => {
        accumulator.push(category);
        if (category.subcategories.length)
          accumulator.push(...category.subcategories);
        return accumulator;
      }, []).map((category: SplitwiseCategory) => ({
        title: category.name,
        value: category.id,
        label: <div className='flex gap-2 items-center w-full'>
          <img src={category.icon_types.square.large} className='rounded-full w-6 h-6' />
          <span className='text-gray-600 font-medium'>{category.name}</span>
        </div>
      })) : [];

    const groupOptions: DefaultOptionType[] = groups.data ?
      groups.data.map(group => ({
        title: group.name,
        value: group.id,
        label: <div className='flex gap-2 items-center w-full'>
          <img src={group.avatar.large} className='rounded-full w-6 h-6' />
          <span className='text-gray-600 font-medium'>{group.name}</span>
        </div>
      })) : [];

    const sourceOptions: DefaultOptionType[] = [
      { name: 'SBI', icon: icon.Sbi },
      { name: 'HDFC', icon: icon.Hdfc },
      { name: 'SBI Credit Card', icon: icon.SbiCc },
      { name: 'ICICI Credit Card', icon: icon.Icici },
      { name: 'Cash', icon: icon.Cash },
      { name: 'Other', icon: icon.OtherPay }
    ].map((source) => ({
      title: source.name,
      value: source.name,
      label: <div className='flex gap-2 items-center w-full'>
        <img className="w-5 h-5 rounded-full" src={getIcon(source.icon)} />
        <span className='text-gray-600 font-medium'>{source.name}</span>
      </div>
    }));

    const availableSources = new Set(sourceOptions.map((option) => String(option.value)));
    const selectedSource = lastSource && availableSources.has(lastSource) ? lastSource : null;

    const persistLastSource = (source: string | null) => {
      const nextSource = source?.trim() ?? null;
      setLastSource(nextSource);

      if (!nextSource) {
        localStorage.removeItem(LAST_SOURCE_KEY);
        return;
      }

      localStorage.setItem(LAST_SOURCE_KEY, nextSource);
    };

    const classes = {
      tr: "px-3 py-2 truncate overflow-hidden text-overflow-ellipsis whitespace-nowrap",
      th: "px-3 py-2 truncate overflow-hidden text-overflow-ellipsis whitespace-nowrap font-semibold tracking-wide",
      input: "flex items-center [&_input]:font-medium [&_input]:text-gray-600",
      select: "[&_.ant-select-selection-placeholder]:font-medium [&_input]:!caret-transparent"
    }

    const onModalClose = () => {
      setIsOpen(false);
    }

    const onAfterClose = () => {
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

    const onSourceChange = (value: unknown) => {
      if (typeof value === 'string') {
        persistLastSource(value);
        return;
      }

      persistLastSource(null);
    };

  return (
      <AnimatedModal
        open={isOpen}
        onCancel={onModalClose}
        afterClose={onAfterClose}
        width={550}
      >
        <div className="bg-white rounded-xl shadow-2xl w-[550px] max-w-full max-h-[90vh] overflow-hidden">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Add Expense</h2>
              <p className="text-sm text-gray-600">Add manual expense to splitwise</p>
            </div>
            <button
              onClick={onModalClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="mx-auto px-14 py-12">
              <div className=" bg-gray-100/20 p-8 rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <Form
                  form={form}
                  className="flex items-center flex-col gap-4"
                >

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
                    options={sourceOptions}
                    formItemProps={{ initialValue: selectedSource ?? undefined }}
                    onChange={onSourceChange}
                    rules={[{ required: true }]}
                    placeholder="Source"
                    placement="bottomRight"
                    className={`${classes.select}`}
                    width="100%"
                    prefix={<PrefixIcon size={16} strokeWidth={3} icon={CreditCard} />}
                  />

                  <CustomSelect
                    name="category"
                    options={categoryOptions}
                    loading={categories.isLoading}
                    rules={[{ required: true }]}
                    placeholder="Category"
                    placement="bottomRight"
                    className={`${classes.select}`}
                    width="100%"
                    prefix={<PrefixIcon icon={Layers2} size={16} strokeWidth={3} />}
                  />

                  <CustomSelect
                    name="group"
                    options={groupOptions}
                    loading={groups.isLoading}
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
                    <label className="text-gray-500">Transaction Type</label>
                    <span className="text-gray-300 px-2">⎜</span>
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
          <div className="flex gap-3 border-t border-gray-200 px-14 py-6 justify-end">
            <button
              onClick={onApprove}
              type="submit"
              disabled={isSaving}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md font-medium shadow-sm transition-colors text-white bg-green-600 hover:bg-green-700 ${isSaving ? 'opacity-60 cursor-not-allowed' : ''}`}
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
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-md font-medium shadow-sm transition-colors text-gray-600 bg-gray-200 hover:bg-gray-300"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </AnimatedModal>
    );
  }

export const PrefixIcon: FC<PrefixIconProps> = ({ size, strokeWidth, icon: Icon }) => (
  <span className="text-sm px-3 py-[10px] border border-r-0 rounded-l-md border-gray-300 bg-gray-50 text-gray-500">
    <Icon size={size} strokeWidth={strokeWidth} />
  </span>
);
