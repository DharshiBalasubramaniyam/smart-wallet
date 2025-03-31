export interface AuthState {
    username: string|null,
    email: string|null,
    token: string|null,
    isAuthenticated: boolean;
    OTPAttemptsRemaining: number
}
