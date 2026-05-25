import type { ModalProps } from 'antd';
import type { FormItemProps, Rule } from 'antd/es/form';
import type { NamePath } from 'antd/es/form/interface';
import type { DefaultOptionType, SelectProps } from 'antd/es/select';
import type { Dispatch, ElementType, ReactNode, SetStateAction } from 'react';
import { Nullable, WithId } from '../../../../../../engine/models/types';
import { AppRecord, BankRecord, LocationRecord } from './models';

export type BankIconProps = {
  bankName: string;
};

export type AlphabetIconProps = {
  firstLetter: string;
  seed: string;
  overrideStyle?: Nullable<string>;
};

export type CustomSelectProps = SelectProps<unknown, DefaultOptionType> & {
  name: NamePath;
  rules?: Rule[];
  width?: string | number;
  prefix?: ReactNode;
  formItemProps?: Omit<FormItemProps, 'name' | 'rules' | 'children'>;
};

export type SelectWithAddProps = {
  defaultOptions: Array<DefaultOptionType>;
  placeholder: string;
  name: string;
  rules?: Rule[];
  className: string;
  width?: string;
  isLoading: boolean;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';
  prefix: ReactNode;
  onAddOption: (option: DefaultOptionType) => void;
};

export type BankRecordSectionProps = {
  bankRecords: WithId<BankRecord>[];
  appRecords: WithId<AppRecord>[];
  locationRecords: WithId<LocationRecord>[];
  isLoading: boolean;
};

export type AppRecordSectionProps = {
  appRecords: WithId<AppRecord>[];
  locationRecords: WithId<LocationRecord>[];
  isLoading: boolean;
};

export type LocationRecordSectionProps = {
  locationRecords: WithId<LocationRecord>[];
  isLoading: boolean;
  isManualEntryModalVisible: boolean;
  setManualEntryModalVisible: Dispatch<SetStateAction<boolean>>;
};

export type HeaderProps = {
  setModalVisible: Dispatch<SetStateAction<boolean>>;
};

export type ListHeaderProps = {
  title: string;
  subtitle: string;
  Icon: ElementType;
  className: string;
  showProcessed: boolean;
  setShowProcessed: Dispatch<SetStateAction<boolean>>;
};

export type BankRecordListProps = {
  items: WithId<BankRecord>[];
  isLoading: boolean;
  setBankItemId: Dispatch<SetStateAction<Nullable<string>>>;
};

export type ReviewLocationRecordListProps = {
  items: WithId<LocationRecord>[];
  isLoading: boolean;
  setLocationRecordItem: Dispatch<SetStateAction<Nullable<WithId<LocationRecord>>>>;
};

export type ReviewAppRecordListProps = {
  items: WithId<AppRecord>[];
  isLoading: boolean;
  setAppRecordItemId: Dispatch<SetStateAction<Nullable<string>>>;
};

export type TransactionListProps = {
  title: string;
  subtitle: string;
  isLoading: boolean;
  items: WithId<BankRecord>[];
  icon: ElementType;
  gradientColors: {
    from: string;
    to: string;
  };
};

export type AppRecordListProps = {
  title: string;
  subtitle: string;
  isLoading: boolean;
  items: WithId<AppRecord>[];
  icon: ElementType;
  gradientColors: {
    from: string;
    to: string;
  };
};

export type LocationRecordListProps = {
  title: string;
  subtitle: string;
  isLoading: boolean;
  items: WithId<LocationRecord>[];
  icon: ElementType;
  gradientColors: {
    from: string;
    to: string;
  };
};

export type ReviewModalProps = {
  itemId: string | null;
  bankRecords: Array<WithId<BankRecord>>;
  appRecords: Array<WithId<AppRecord>>;
  onClose: () => void;
};

export type BankRecordListItemProps = {
  item: WithId<BankRecord>;
  isOpen: boolean;
  onOpen: (id: string | null) => void;
  setProcessed: (id: string) => void;
  setBankItemId: Dispatch<SetStateAction<Nullable<string>>>;
};

export type LocationRecordListItemProps = {
  item: WithId<LocationRecord>;
  isOpen: boolean;
  onOpen: (id: string | null) => void;
  setProcessed: (id: string) => void;
  setLocationRecordItem: Dispatch<SetStateAction<Nullable<WithId<LocationRecord>>>>;
};

export type AppRecordListItemProps = {
  item: WithId<AppRecord>;
  isOpen: boolean;
  onOpen: (id: string | null) => void;
  setProcessed: (id: string) => void;
  setAppRecordItemId: Dispatch<SetStateAction<Nullable<string>>>;
};

export type ProcessedActionButtonProps = {
  disabled?: boolean;
  onClick: () => void;
};

export type SwipeableContentProps = {
  id: string;
  isOpen: boolean;
  onOpen: (id: string | null) => void;
  onClick: () => void;
  children: ReactNode;
};

export type LocationRecordItemProps = {
  item: WithId<LocationRecord>;
  isSelected: boolean;
  setSelected: Dispatch<SetStateAction<Nullable<WithId<LocationRecord>>>>;
};

export type AppRecordItemProps = {
  item: WithId<AppRecord>;
  isSelected: boolean;
  setSelected: Dispatch<SetStateAction<Nullable<WithId<AppRecord>>>>;
};

export type BankRecordReviewModalProps = {
  bankItemId: string;
  bankRecords: WithId<BankRecord>[];
  appRecords: WithId<AppRecord>[];
  locationRecords: WithId<LocationRecord>[];
  setBankItemId: Dispatch<SetStateAction<Nullable<string>>>;
};

export type ManualEntryModalProps = {
  locationRecord: Nullable<WithId<LocationRecord>>;
  setVisible: (isVisible: boolean) => void;
  setLocationRecordItem: Dispatch<SetStateAction<Nullable<WithId<LocationRecord>>>>;
};

export type AppRecordReviewModalProps = {
  appRecordItemId: string;
  appRecords: WithId<AppRecord>[];
  locationRecords: WithId<LocationRecord>[];
  setAppRecordItemId: Dispatch<SetStateAction<Nullable<string>>>;
};

export type PrefixIconProps = {
  size: number;
  strokeWidth: number;
  icon: ElementType;
};

export type AnimatedModalProps = ModalProps & {
  motionClassName?: string;
  children: ReactNode;
};
