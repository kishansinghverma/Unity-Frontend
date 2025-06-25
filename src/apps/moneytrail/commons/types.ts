import { ReactNode, ElementType } from "react";

export type ListItem = {
    id: number;
    title: string;
    description: string;
    tag: string;
    date: string;
    amount: string;
    type: 'credit' | 'debit';
    processed: boolean;
    bank: string
}

export type IconWrapperProps = {
    children: ReactNode;
    className?: string;
}

export type TransactionListProps = {
    title: string;
    subtitle: string;
    icon: ElementType;
    gradientColors: {
        from: string;
        to: string;
    };
    initialItems: ListItem[];
}