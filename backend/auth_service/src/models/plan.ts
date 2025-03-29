import mongoose, { Schema, Document } from 'mongoose';

export enum BillingCycle {
    MONTHLY = 'MONTHLY',
    YEARLY = 'YEARLY'
}

export enum PlanType {
    STARTER = "STARTER",
    PLUS = "PLUS",
    PRO = "PRO"
}

export interface IPlan extends Document {
    name: PlanType;
    description: string;
    billingCycle: BillingCycle;
    price: number;
    currency: string;
    features: string[];
    active: boolean;
}

const PlanSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    billingCycle: { type: String, enum: Object.values(BillingCycle), required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    features: [{ type: String }],
    active: { type: Boolean, default: true }
}, {
    timestamps: true
});

export default mongoose.model<IPlan>('Plan', PlanSchema);
