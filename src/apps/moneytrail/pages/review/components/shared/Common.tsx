import { Form, Select, Space } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { ListX } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { StringUtils } from "../../../../../../engine/helpers/stringHelper";
import { AlphabetIconProps, BankIconProps, CustomSelectProps, SelectWithAddProps } from "../../engine/contracts/props";
import { getColorPair, getIconBackground } from "../../engine/utils";
import { BankLogo } from "./Resources";

export const BankIcon: FC<BankIconProps> = ({ bankName }) => (
  <div className={`p-2 rounded ${getIconBackground(bankName)}`} title={bankName}>
    {BankLogo.get(bankName)}
  </div>
);

export const AlphabetIcon: FC<AlphabetIconProps> = ({ firstLetter, seed, overrideStyle }) => (
  <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg ${overrideStyle ?? getColorPair(seed)}`}>
    <span className={`text-lg sm:text-xl font-bold`}>
      {firstLetter}
    </span>
  </div>
);

export const EmptyList: FC = () => (
  <div className="text-center py-12 px-6 flex flex-col items-center justify-center h-full">
    <ListX className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-2 text-sm font-medium text-gray-900">No Transactions</h3>
    <p className="mt-1 text-sm text-gray-500">Your transactions will appear here.</p>
  </div>
);

export const SkeletonItem: FC = () => (
  <div className="flex items-center justify-between p-3.5 border-b border-gray-200">
    <div className="flex items-center gap-4 flex-grow min-w-0">
      <div className="h-10 w-10 rounded bg-gray-200 animate-pulse"></div>
      <div className="flex-grow space-y-2">
        <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div className="h-2 bg-gray-200 rounded w-1/2 animate-pulse"></div>
      </div>
    </div>
    <div className="text-right flex-shrink-0 ml-4 space-y-2">
      <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
      <div className="h-2 bg-gray-200 rounded w-12 animate-pulse"></div>
    </div>
  </div>
);

export const CustomSelect: FC<CustomSelectProps> = ({
  name,
  rules,
  width,
  prefix,
  formItemProps,
  style,
  ...selectProps
}) => (
  <Space.Compact style={{ width: width }}>
    {prefix}
    <Form.Item noStyle name={name} rules={rules} {...formItemProps}>
      <Select
        style={{ height: 38, width: width, ...style }}
        showSearch
        allowClear
        optionFilterProp="title"
        {...selectProps}
      />
    </Form.Item>
  </Space.Compact>
);

export const SelectWithAdd: FC<SelectWithAddProps> = ({
  defaultOptions,
  placeholder,
  name,
  rules,
  className,
  width,
  placement,
  isLoading,
  onAddOption,
  prefix
}) => {

  const [value, setValue] = useState<DefaultOptionType | null>(null);
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
          label: <span className='text-gray-600 font-medium'>{`+ Add ${formattedValue}`}</span>,
          value: formattedValue,
          title: `+ Add ${formattedValue}`
        });
      }
    }

    setOptions(filteredOptions);
  }

  const onChange = (_value: unknown, item?: DefaultOptionType) => {
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
          label: <span className='text-gray-600 font-medium'>{formattedValue}</span>,
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
    <Space.Compact style={{ width: width }}>
      {prefix}
      <Form.Item noStyle name={name} rules={rules}>
        <Select
          style={{ height: 38, width: width }}
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
