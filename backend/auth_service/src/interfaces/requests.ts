import { PaymentType } from "../models/payment";

export interface CreateAccountRequest {
    email: string;
    username: string;
    password: string;
}

export interface VerifyOTPRequest {
    email: string;
    otpCode: string;
}

export interface UpdateCurrencyRequest {
    email: string;
    currency: string;
}

export interface SavePaymentRequest {
    email: string;
    type: PaymentType;
    details: {
        cardType?: string;
        lastFourDigits?: string;
        expiryDate?: string;
        paypalEmail?: string;
    };
    isDefault: boolean;
}

export interface CreateSubscriptionRequest {
    email: string;
    planId: string;
    paymentId: string;
    autoRenew: boolean;
}
