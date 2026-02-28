import { DatePicker, InputNumber, Input, Space, Form, Radio, Modal } from "antd";
import { X, CalendarClock, Pencil, IndianRupee, CreditCard, Layers2, PieChart, MapPin } from "lucide-react";
import { SelectWithAdd, CustomSelect } from "../../Common";
import { PrefixIcon } from "./ManualEntryModal";
import { FC, useState } from "react";
import { Nullable, WithId } from "../../../../../engine/models/types";
import { DraftEntry } from "../../../engine/models/types";
import { useAppDispatch } from "../../../../../store/hooks";
import { useCategoriesQuery, useDescriptionsQuery, useGroupsQuery } from "../../../store/reviewSlice";
import { DefaultOptionType } from "antd/es/select";

import HdfcLogo from '../../../../../static/icons/hdfc.svg';
import SbiLogo from '../../../../../static/icons/sbi.svg';
import CashLogo from '../../../../../static/icons/cash.svg';
import ICICILogo from '../../../../../static/icons/icici.svg';
import SBICCLogo from '../../../../../static/icons/sbicc.svg';
import OtherPayLogo from '../../../../../static/icons/otherpay.svg';

const styles = {
    tr: "px-3 py-2 truncate overflow-hidden text-overflow-ellipsis whitespace-nowrap",
    th: "px-3 py-2 truncate overflow-hidden text-overflow-ellipsis whitespace-nowrap font-semibold tracking-wide",
    input: "flex items-center [&_input]:font-medium [&_input]:text-gray-600 dark:[&_input]:text-gray-200",
    select: "[&_.ant-select-selection-placeholder]:font-medium [&_input]:!caret-transparent",
    modal: {
        mask: 'bg-black/50 backdrop-blur backdrop-saturate-[0.8]',
        content: 'p-0 rounded-xl shadow-2xl w-[550px] max-w-7xl max-h-[90vh] overflow-hidden'
    }
}

type ModalProps = {
    isVisible: boolean;
    setVisible: (isVisible: boolean) => void;
    draftEntry: Nullable<WithId<DraftEntry>>;
    setDraftEntry: React.Dispatch<React.SetStateAction<Nullable<WithId<DraftEntry>>>>;
};

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

export const ManualEntryModal: FC<ModalProps> = ({ isVisible, setVisible, draftEntry, setDraftEntry }) => {
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

    return (
        <Modal
            title={<Header />}
            footer={<Footer />}
            open={isVisible}
            classNames={styles.modal}
            onCancel={() => setVisible(false)}
            maskClosable={true}
            transitionName="custom-scale"
            maskTransitionName="custom-fade"
        >
            <Body />
        </Modal>
    );
};



const Body = () => (
    <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
        <div className="mx-auto px-14 py-12">
            <div className=" bg-gray-100/20 p-8 dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                <Form className="flex items-center flex-col gap-4">

                    <Space.Compact style={{ width: "100%" }}>
                        <PrefixIcon icon={CalendarClock} size={16} strokeWidth={3} />
                        <Form.Item name="date" noStyle rules={[{ required: true }]}>
                            <DatePicker
                                showTime
                                style={{ width: "100%" }}
                                placeholder="Date"
                                format="DD-MMM-YYYY ↔ hh:mm A"
                                className={styles.input}
                            />
                        </Form.Item>
                    </Space.Compact>

                    <SelectWithAdd
                        name="description"
                        defaultOptions={[]}
                        onAddOption={() => { }}
                        isLoading={false}
                        rules={[{ required: true }]}
                        placeholder="Description"
                        placement="bottomRight"
                        className={styles.select}
                        width="100%"
                        prefix={<PrefixIcon icon={Pencil} size={16} strokeWidth={3} />}
                    />

                    <Space.Compact style={{ width: "100%" }}>
                        <PrefixIcon icon={IndianRupee} size={16} strokeWidth={3} />
                        <Form.Item name="amount" noStyle rules={[{ required: true }]}>
                            <InputNumber
                                style={{ width: "100%" }}
                                placeholder="Amount"
                                className={styles.input}
                            />
                        </Form.Item>
                    </Space.Compact>

                    <CustomSelect
                        name="source"
                        defaultOptions={[]}
                        rules={[{ required: true }]}
                        placeholder="Source"
                        placement="bottomRight"
                        className={styles.select}
                        width="100%"
                        prefix={<PrefixIcon size={16} strokeWidth={3} icon={CreditCard} />}
                    />

                    <CustomSelect
                        name="category"
                        defaultOptions={[]}
                        isLoading={false}
                        rules={[{ required: true }]}
                        placeholder="Category"
                        placement="bottomRight"
                        className={styles.select}
                        width="100%"
                        prefix={<PrefixIcon icon={Layers2} size={16} strokeWidth={3} />}
                    />

                    <CustomSelect
                        name="group"
                        defaultOptions={[]}
                        isLoading={false}
                        rules={[{ required: true }]}
                        placeholder="Group"
                        placement="bottomRight"
                        className={styles.select}
                        width="100%"
                        prefix={<PrefixIcon size={16} strokeWidth={3} icon={PieChart} />}
                    />

                    <Space.Compact style={{ width: "100%" }}>
                        <PrefixIcon icon={MapPin} size={16} strokeWidth={3} />
                        <Form.Item name="location" noStyle rules={[{ required: true }]} initialValue="N/A">
                            <Input
                                style={{ width: "100%" }}
                                placeholder="Location"
                                className={styles.input}
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
)

const Header = () => (
    <div className='px-6 py-4 border-b border-gray-200'>
        <h2 className="text-xl font-bold text-gray-800">Add Expense</h2>
        <p className="text-sm font-medium text-gray-500">Add Manual Expense to Splitwise</p>
    </div>
);

const Footer = () => (
    <div className="flex gap-3 border-t border-gray-200 dark:border-gray-700 px-14 py-6 justify-end">
        <button
            type="submit"
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md font-medium shadow-sm transition-colors text-white bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600`}
        >
            Submit
        </button>
        <button
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-md font-medium shadow-sm transition-colors text-gray-600 bg-gray-200 dark:bg-gray-500 hover:bg-gray-300 dark:hover:bg-gray-500 dark:text-gray-200"
        >
            <X className="w-4 h-4" />
            <span>Cancel</span>
        </button>
    </div>
);