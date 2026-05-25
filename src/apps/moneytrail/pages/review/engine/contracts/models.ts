export type BankRecord = {
    date: Date,
    description: string,
    amount: number,
    processed?: boolean,
    type: "Credit" | "Debit",
    bank: "SBI" | "HDFC" | "SBI CC" | "ICICI CC"
}

export type AppRecord = {
    date: Date,
    app: "paytm" | "phonepe",
    recipient: string,
    transactionId: string,
    utr: string,
    processed?: boolean,
    bank: string | "SBI" | "HDFC"
    type: string | "Credit" | "Debit",
    amount: number
}

export type LocationRecord = {
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
