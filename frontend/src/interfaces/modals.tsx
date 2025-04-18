export interface LoginInfo {
    email: string,
    password: string
}

export interface RegistrationInfo {
    username: string,
    email: string,
    password: string
}

export interface SendOtpRequest {
    email: string,
}

export interface verifyOtpRequest {
    email: string,
    otpCode: string;
}

export enum PlanType {
    STARTER = "Starter",
    PLUS = "Plus",
    PRO = "Pro"
}

export interface SubscribeRequest {
    email: string;
    planId: string;
    autoRenew: boolean;
}

export interface UpdateCurrencyRequest {
    currency: string;
    email: string;
}
export interface PlanInfo {
    _id: string;
    name: string;
    description: string;
    monthly_price: number;
    yearly_price: number;
    currency: string;
    features: string[];
    active: boolean;
}

export interface ApiResponse {
    success: boolean,
    error: {message: string} | null, 
    data: {message: string, object?: any} | null
}

export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER'
}

