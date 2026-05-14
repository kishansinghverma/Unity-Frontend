import type { ModalProps } from 'antd';
import type { FormItemProps, Rule } from 'antd/es/form';
import type { NamePath } from 'antd/es/form/interface';
import type { DefaultOptionType, SelectProps } from 'antd/es/select';
import type { Dispatch, ElementType, ReactNode, SetStateAction } from 'react';
import { Nullable, WithId } from '../../../../../../engine/models/types';
import { BankEntry, PaymentAppEntry, DraftEntry } from './models';

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

export type BankSectionProps = {
  bankEntries: WithId<BankEntry>[];
  paymentAppEntries: WithId<PaymentAppEntry>[];
  draftEntries: WithId<DraftEntry>[];
  isLoading: boolean;
};

export type PaymentAppSectionProps = {
  paymentAppEntries: WithId<PaymentAppEntry>[];
  draftEntries: WithId<DraftEntry>[];
  isLoading: boolean;
};

export type DraftSectionProps = {
  draftEntries: WithId<DraftEntry>[];
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

export type BankListProps = {
  items: WithId<BankEntry>[];
  isLoading: boolean;
  setBankItemId: Dispatch<SetStateAction<Nullable<string>>>;
};

export type ReviewDraftListProps = {
  items: WithId<DraftEntry>[];
  isLoading: boolean;
  setDraftItem: Dispatch<SetStateAction<Nullable<WithId<DraftEntry>>>>;
};

export type ReviewPaymentAppListProps = {
  items: WithId<PaymentAppEntry>[];
  isLoading: boolean;
  setPaymentAppItemId: Dispatch<SetStateAction<Nullable<string>>>;
};

export type TransactionListProps = {
  title: string;
  subtitle: string;
  isLoading: boolean;
  items: WithId<BankEntry>[];
  icon: ElementType;
  gradientColors: {
    from: string;
    to: string;
  };
};

export type PaymentAppListProps = {
  title: string;
  subtitle: string;
  isLoading: boolean;
  items: WithId<PaymentAppEntry>[];
  icon: ElementType;
  gradientColors: {
    from: string;
    to: string;
  };
};

export type DraftListProps = {
  title: string;
  subtitle: string;
  isLoading: boolean;
  items: WithId<DraftEntry>[];
  icon: ElementType;
  gradientColors: {
    from: string;
    to: string;
  };
};

export type ReviewModalProps = {
  itemId: string | null;
  bankEntries: Array<WithId<BankEntry>>;
  paymentAppEntries: Array<WithId<PaymentAppEntry>>;
  onClose: () => void;
};

export type BankListItemProps = {
  item: WithId<BankEntry>;
  isOpen: boolean;
  onOpen: (id: string | null) => void;
  setProcessed: (id: string) => void;
  setBankItemId: Dispatch<SetStateAction<Nullable<string>>>;
};

export type DraftListItemProps = {
  item: WithId<DraftEntry>;
  isOpen: boolean;
  onOpen: (id: string | null) => void;
  setProcessed: (id: string) => void;
  setDraftItem: Dispatch<SetStateAction<Nullable<WithId<DraftEntry>>>>;
};

export type PaymentAppListItemProps = {
  item: WithId<PaymentAppEntry>;
  isOpen: boolean;
  onOpen: (id: string | null) => void;
  setProcessed: (id: string) => void;
  setPaymentAppItemId: Dispatch<SetStateAction<Nullable<string>>>;
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

export type DraftItemProps = {
  item: WithId<DraftEntry>;
  isSelected: boolean;
  setSelected: Dispatch<SetStateAction<Nullable<WithId<DraftEntry>>>>;
};

export type PaymentAppItemProps = {
  item: WithId<PaymentAppEntry>;
  isSelected: boolean;
  setSelected: Dispatch<SetStateAction<Nullable<WithId<PaymentAppEntry>>>>;
};

export type BankReviewModalProps = {
  bankItemId: string;
  bankEntries: WithId<BankEntry>[];
  paymentAppEntries: WithId<PaymentAppEntry>[];
  draftEntries: WithId<DraftEntry>[];
  setBankItemId: Dispatch<SetStateAction<Nullable<string>>>;
};

export type ManualEntryModalProps = {
  draftEntry: Nullable<WithId<DraftEntry>>;
  setVisible: (isVisible: boolean) => void;
  setDraftItem: Dispatch<SetStateAction<Nullable<WithId<DraftEntry>>>>;
};

export type PaymentAppReviewModalProps = {
  paymentAppItemId: string;
  paymentAppEntries: WithId<PaymentAppEntry>[];
  draftEntries: WithId<DraftEntry>[];
  setPaymentAppItemId: Dispatch<SetStateAction<Nullable<string>>>;
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
