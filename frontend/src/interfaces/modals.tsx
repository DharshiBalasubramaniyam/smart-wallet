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
    otp: string;
}

export interface ApiResponse {
    success: boolean,
    error: {message: string} | null, 
    data: {message: string, object?: any} | null
}
