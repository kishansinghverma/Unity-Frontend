export type BankEntry = {
    date: string;
    description: string;
    amount: number;
    processed?: boolean;
    type: "Credit" | "Debit";
    bank: string;
}

export type PaymentAppEntry = {
    date: string
    recipient: string;
    transactionId: string;
    utr: string;
    bank: string;
    type: "Credit" | "Debit";
    amount: number;
    processed: boolean;
};

export type DraftEntry = {
    dateTime: string,
    location: string,
    coordinate: string,
    processed: boolean,
}

export type Group = {
    id: number;
    name: string;
    simplified_debts: Array<{
        from: number;
        to: number;
        amount: string;
    }>
    whiteboard: null;
    group_type: string;
    avatar: {
        large: string;
    };
    members: Array<Member>;
    sharing: boolean;
}

export type Member = {
    id: number;
    first_name: string;
    email: string;
}

export type SplitwiseGroupResponse = Group;

export type SplitwiseGroupsResponse = Array<Group>;

export type SplitwiseCategory = {
    id: number;
    name: string;
    icon_types: {
        square: {
            large: string;
        }
    };
    subcategories: SplitwiseCategory[];
}

export type SplitwiseCategoriesResponse = {
    categories: SplitwiseCategory[];
}
