import { ElementType } from "react";
import { WithId } from "../../../commons/types";

export type BankEntry = {
    date: string;
    description: string;
    amount: number;
    processed?: boolean;
    type: "Credit" | "Debit";
    bank: string;
}

export type PhonepeEntry = {
  date: Date
  recipient: string;
  transactionId: string;
  utr: string;
  bank: string;
  type: "Credit" | "Debit";
  amount: number;
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
}

export type ReviewModalProps = {
    itemId: string | null;
    bankEntries: Array<WithId<BankEntry>>;
    phonepeEntries: Array<WithId<PhonepeEntry>>;
    onClose: () => void;
}