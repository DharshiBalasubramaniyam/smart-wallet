import axios from 'axios';
import API_CONFIG from '../../config/api.config';
import { ApiResponse, PlanInfo, PlanType, RegistrationInfo, SendOtpRequest, SubscribeRequest, verifyOtpRequest, UpdateCurrencyRequest, LoginInfo } from '../../interfaces/modals';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess, setEmail, setOTPAttemptsRemaining } from '../../redux/features/auth';

const api = axios.create(API_CONFIG);

export function AuthService() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    async function register(body: RegistrationInfo): Promise<void> {
        try {
            const response = await api.post(`auth/register`, body);
            console.log(response.data)
            if (response.data.success) {
                dispatch(setEmail({ email: response.data.data.object.email }))
                await sendOTP({ email: response.data.data.object.email })
            }
        } catch (error) {
            processError(error);
        }
    }

    async function sendOTP(body: SendOtpRequest): Promise<void> {
        try {
            const response = await api.post(`auth/resend-otp`, body);
            console.log(response.data)
            if (response.data.success) {
                dispatch(setOTPAttemptsRemaining({ OTPAttemptsRemaining: response.data.data.object.attemptsRemaining }))
                navigate("/verify-otp");
                toast.info("Verification OTP has been sent to your email");
            }
        } catch (error) {
            processError(error);
        }
    }

    async function verifyOTP(body: verifyOtpRequest, navigateTo: string): Promise<void> {
        try {
            const response = await api.post(`auth/verify-otp`, body);
            console.log(response.data)
            if (response.data.success) {
                dispatch(setOTPAttemptsRemaining({ OTPAttemptsRemaining: 3 }))
                navigate(navigateTo)
            }
        } catch (error) {
            processError(error)
        }
    }

    async function getAllPlans(): Promise<PlanInfo[]> {
        try {
            const response = await api.get(`auth/plans`);
            console.log(response.data)
            if (response.data.success) {
                return response.data.data.object as PlanInfo[];
            }
            return []
        } catch (error) {
            processError(error)
            return []
        }
    }

    async function subscribePlan(body: SubscribeRequest, planName: string): Promise<void> {
        try {
            const response = await api.post(`auth/subscriptions/subscribe`, body);
            console.log(response.data)
            if (response.data.success) {
                if (planName === PlanType.STARTER) {
                    navigate('/currency');
                } else {
                    navigate(`/subscriptions/${response.data.data.object._id}/payment`);
                }
            }
        } catch (error) {
            processError(error);
        }
    }

    async function updateCurrency(body: UpdateCurrencyRequest, navigateTo: string): Promise<void> {
        try {
            const response = await api.patch(`auth/update-currency`, body);
            console.log(response.data)
            if (response.data.success) {
                toast.success("Currency updated successfully!");
                navigate(navigateTo);
            }
        } catch (error) {
            processError(error);
        }
    }

    async function login(body: LoginInfo) {
        try {
            const response = await api.post(`auth/login`, body);
            console.log(response.data)
            if (response.data.success) {
                const userData = {
                    username: response.data.data.object.username,
                    email: response.data.data.object.email,
                    token: response.data.data.object.accessToken,
                    currency: response.data.data.object.currency,
                    plan: response.data.data.object.plan,
                    role: response.data.data.object.role,
                }
                dispatch(loginSuccess(userData))
                localStorage.setItem("smart-wallet-user", JSON.stringify(userData));
                toast.success("Login successful!");
                navigate("/");
            }
        } catch (error) {
            // TODO: Catch different login error types: account not verified, subscription not found etc.
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage = error.response.data?.data?.message || "An error occurred while processing your request.";
                toast.error(errorMessage);
            } else {
                toast.error("An unexpected error occurred. Please try again later.");
            }
            console.error("Error details:", error);
        }
    }

    return { register, sendOTP, verifyOTP, getAllPlans, subscribePlan, updateCurrency, login };
}

function processError(error: unknown): void {
    if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data?.error?.message || "An error occurred while processing your request.";
        toast.error(errorMessage);
    } else {
        toast.error("An unexpected error occurred. Please try again later.");
    }
    console.error("Error details:", error);
}
