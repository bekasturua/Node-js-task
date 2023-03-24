export interface Search {
    created_at?: { $gte?: Date, $lte?: Date },
    type?: 'income' | 'expense',
    amount?: number,
    status?: 'processing' | 'completed',
}