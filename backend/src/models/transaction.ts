import { Document, model, Schema } from "mongoose";

export enum TransactionType {
   EXPENSE = 'EXPENSE',
   INCOME = 'INCOME',
   INTERNAL_TRANSFER = 'INTERNAL_TRANSFER',
   PRINCIPAL_REPAYMENT_RECEIVED = 'PRINCIPAL_REPAYMENT_RECEIVED',
   PRINCIPAL_REPAYMENT_PAID = 'PRINCIPAL_REPAYMENT_PAID',
   INTEREST_RECEIVED = 'INTEREST_RECEIVED',
   INTEREST_PAID = 'INTEREST_PAID',
   REFUND = 'REFUND',
   PURCHASE = 'PURCHASE',
   BILL_PAYMENT = "BILL_PAYMENT",
   BALANCE_TRANSFER = "BALANCE_TRANSFER",
   WITHDRAW_CASH = "WITHDRAW_CASH",
   INTEREST_CHARGED = "INTEREST_CHARGED",
   LOAN_PRINCIPAL = "LOAN_PRINCIPAL"
}

export interface ITransaction extends Document {
    type: TransactionType,
    amount: Schema.Types.Decimal128,
    from: Schema.Types.ObjectId,
    to: Schema.Types.ObjectId,
    date: Schema.Types.Date,
    note: string,
    pcategory: Schema.Types.ObjectId,
    scategory: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    scheduleId: Schema.Types.ObjectId
}

const TransactionSchema: Schema = new Schema({
    type: {
        type: String,
        enum: Object.values(TransactionType)
    },
    amount: {
        type: Schema.Types.Decimal128
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: "Space"
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: "Space"
    },
    date: {
        type: Schema.Types.Date
    },
    note: {
        type: String
    },
    pcategory: {
        type: Schema.Types.ObjectId,
        ref: "Category"
    },
    scategory: {
        type: Schema.Types.ObjectId,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    scheduleId: {
        type: Schema.Types.ObjectId,
        ref: "Schedule"
    }
})

export default model<ITransaction>("Transaction", TransactionSchema)