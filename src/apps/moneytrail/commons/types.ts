import { ElementType } from "react";
import { WithId } from "../../../commons/types";

export type BankEntry = {
    date: Date;
    description: string;
    amount: number;
    processed?: boolean;
    type: "Credit" | "Debit";
    bank: string;
}

export interface RecordItem {
    id: string;
    title: string;
    subtitle: string;
    date: string;
    icon?: string;
}

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