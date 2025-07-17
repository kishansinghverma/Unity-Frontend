import { ElementType, FC, useEffect, useState } from "react";
import { getColorPair, getIconBackground } from "../engine/utils";
import { BankLogo } from "./Resources";
import { ListX } from "lucide-react";
import { DefaultOptionType } from "antd/es/select";
import { StringUtils } from "../../../engine/helpers/stringHelper";
import { Space, Select, Form } from "antd";
import { Rule } from "antd/es/form";


export const BankIcon: FC<{
  bankName: string
}> = ({ bankName }) => (
  <div className={`p-2 rounded ${getIconBackground(bankName)}`} title={bankName}>
    {BankLogo.get(bankName)}
  </div>
);

export const AlphabetIcon: FC<{
  firstLetter: string
  seed: string;
  overrideStyle?: string;
}> = ({ firstLetter, seed, overrideStyle }) => (
  <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg ${overrideStyle ?? getColorPair(seed)}`}>
    <span className={`text-lg sm:text-xl font-bold`}>
      {firstLetter}
    </span>
  </div>
);

export const ListHeader: FC<{
  title: string;
  subtitle: string;
  Icon: ElementType;
  headerBackground: { to: string, from: string };
  showProcessed: boolean;
  setShowProcessed: React.Dispatch<React.SetStateAction<boolean>>
}> = ({
  title, subtitle, Icon, headerBackground, showProcessed, setShowProcessed
}) => (
    <header className={`bg-gradient-to-r ${headerBackground.from} ${headerBackground.to} px-6 py-4 flex-shrink-0`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start gap-4">
          <div className="bg-white/20 p-3 rounded-lg">
            <Icon size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{title}</h1>
            <p className="text-slate-100 text-sm">{subtitle}</p>
          </div>
        </div>
        <div className="relative group">
          <button
            type="button"
            onClick={() => setShowProcessed(flag => !flag)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white ${showProcessed ? 'bg-green-500/90' : 'bg-white/30'}`}
            role="switch"
            aria-checked={showProcessed}
          >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ease-in-out ${showProcessed ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
          <div className="absolute top-8 right-0 w-max bg-gray-900 text-white dark:bg-gray-200 dark:text-black text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Show Processed
          </div>
        </div>
      </div>
    </header>
  )

export const EmptyList: FC = () => (
  <div className="text-center py-12 px-6 flex flex-col items-center justify-center h-full">
    <ListX className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-300">No Transactions</h3>
    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Your transactions will appear here.</p>
  </div>
);

export const SkeletonItem: FC = () => (
  <div className="flex items-center justify-between p-3.5 border-b border-gray-200 dark:border-gray-700">
    <div className="flex items-center gap-4 flex-grow min-w-0">
      <div className="h-10 w-10 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      <div className="flex-grow space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
      </div>
    </div>
    <div className="text-right flex-shrink-0 ml-4 space-y-2">
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
    </div>
  </div>
);

export const CustomSelect: FC<{
  defaultOptions: Array<DefaultOptionType>;
  placeholder: string;
  name: string;
  rules?: Rule[];
  className: string;
  placement?: "bottomLeft" | "bottomRight" | "topLeft" | "topRight"
  prefix: React.ReactNode;
  isLoading: boolean;
}> = ({
  defaultOptions,
  placeholder,
  name,
  rules,
  className,
  placement,
  isLoading,
  prefix,
}) => {
    const [value, setValue] = useState<any>(null);

    const onClear = () => setValue(null);
    const onChange = (value: string, option: any) => setValue(option);

    return (
      <Space.Compact>
        {prefix}
        <Form.Item noStyle name={name} rules={rules}>
          <Select
            style={{ height: 38 }}
            showSearch
            allowClear
            value={value}
            options={defaultOptions}
            placeholder={placeholder}
            onChange={onChange}
            onClear={onClear}
            className={className}
            placement={placement}
            loading={isLoading}
            optionFilterProp="title"
          />
        </Form.Item>
      </Space.Compact>
    )
  }

export const SelectWithAdd: FC<{
  defaultOptions: Array<DefaultOptionType>;
  placeholder: string;
  name: string;
  rules?: Rule[];
  className: string;
  isLoading: boolean;
  placement?: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
  prefix: React.ReactNode;
  onAddOption: (option: DefaultOptionType) => void
}> = ({
  defaultOptions,
  placeholder,
  name,
  rules,
  className,
  placement,
  isLoading,
  onAddOption,
  prefix
}) => {

    const [value, setValue] = useState<any>();
    const [options, setOptions] = useState<DefaultOptionType[]>(defaultOptions);

    const filterAddOption = (items: DefaultOptionType[]) => items.filter(t => !t.title?.toString().startsWith('+ Add'));

    const onOpenClose = () => setOptions(options => filterAddOption(options));

    const onClear = () => setValue(null);

    const onSearch = (text: string) => {
      const filteredOptions = filterAddOption(options);

      if (!StringUtils.isNullOrEmpty(text)) {
        if (!filteredOptions.some(option => option.title?.toString()?.toLowerCase() === text.toLowerCase())) {
          const formattedValue = StringUtils.capitalize(text);
          filteredOptions.push({
            label: <span className='text-gray-600 dark:text-gray-200 font-medium'>{`+ Add ${formattedValue}`}</span>,
            value: formattedValue,
            title: `+ Add ${formattedValue}`
          });
        }
      }

      setOptions(filteredOptions);
    }

    const onChange = (value: string, item?: DefaultOptionType) => {
      if (StringUtils.isNullOrEmpty(item?.title)) return;

      let selectedOption = item;
      if (item?.title?.toString()?.startsWith('+ Add')) {
        const filteredOptions = filterAddOption(options);
        const optionValue = item.value?.toString().trim().toLowerCase();
        const existingOption = filteredOptions.find(option => option.value?.toString().toLowerCase() === optionValue);

        if (existingOption) selectedOption = existingOption;
        else {
          const formattedValue = StringUtils.capitalize(optionValue);
          selectedOption = {
            label: <span className='text-gray-600 dark:text-gray-200 font-medium'>{formattedValue}</span>,
            title: formattedValue,
            value: formattedValue
          };

          onAddOption(selectedOption);
        }
      }

      setValue(selectedOption);
    }

    useEffect(() => setOptions(defaultOptions), [defaultOptions]);

    return (
      <Space.Compact>
        {prefix}
        <Form.Item noStyle name={name} rules={rules}>
          <Select
            style={{ height: 38 }}
            showSearch
            value={value?.value}
            options={options}
            placeholder={placeholder}
            onChange={onChange}
            onSearch={onSearch}
            onOpenChange={onOpenClose}
            onClear={onClear}
            className={className}
            placement={placement}
            loading={isLoading}
            allowClear
          />
        </Form.Item>
      </Space.Compact>
    )
  }