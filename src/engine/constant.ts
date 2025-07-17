export const Routes = {
    Parties: "/api/emandi/parties",
    Push: "/api/emandi/push",
    Processed: "/api/emandi/processed",
    Requeue: "/api/emandi/requeue",
    Queued: "/api/emandi/queued",
    Delete: "/api/emandi/entry",
    DraftExpenses: "/api/expenses",
    ExpenseLastRefinement: "/api/expenses/lastrefinement",
    ExpenseDescriptions: "/api/expenses/descriptions",
    AddDescriptions: "/api/expenses/description",
    ExpenseGroups: "/api/expenses/groups",
    FinalizeExpense: "/api/expenses/finalize",
    SettleExpense: "/api/splitwise/settlement",
    NotificationUrl: "/api/whatsapp/sendtext/unityhub",
    SplitWiseGroups: "/api/splitwise/groups",
    SplitWiseCategories: "/api/splitwise/categories",
    SplitWiseGroup: "/api/splitwise/group",
    SplitWiseExpenses: "/api/splitwise/transactions",
    BankStatement: "/api/expenses/statement/bank",
    PhonePeStatement: "/api/expenses/statement/phonepe",
    ProcessBank: "/api/expenses/process/bank",
    ProcessPhonepe: "/api/expenses/process/phonepe",
    ProcessDraft: "/api/expenses/process/draft",
    Distance: "https://dev.virtualearth.net/REST/V1/Routes/Driving?o=json&wp.0=sadabad&key=AhWAWkHKZZ0JtpBDWvq2_vZqrtmAgf3prbe31w7FbepXyGzvHoWzvpetsQIA7DpL&wp.1"
}

export const HttpStatusCode: { [key: number]: string } = {
    200: 'Operation Successfull.',
    201: 'Record Created Successfully.',
    401: 'Authorization Error!',
    500: 'Something Wrong On Server!',
    501: 'Method Not Implemented!',
    404: 'Resource Not Found!',
    400: 'Bad Request!',
    409: 'Duplicate Record!'
}

export const PostParams = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
}

export const PatchParams = {
    method: 'PATCH',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
}

export const DeleteParams = {
    method: 'DELETE'
}