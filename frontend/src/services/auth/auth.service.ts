import axios from 'axios';
import API_CONFIG from '../../config/api.config';
import { ApiResponse, RegistrationInfo, SendOtpRequest, verifyOtpRequest } from '@/interfaces/modals';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setEmail, setOTPAttemptsRemaining } from '../../redux/features/auth';

const api = axios.create(API_CONFIG);

export function AuthService() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    async function register(body: RegistrationInfo): Promise<void> {
        try {
            const response = await api.post(`auth/register`, body);
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
            if (response.data.success) {
                dispatch(setOTPAttemptsRemaining({ OTPAttemptsRemaining: 3 }))
                navigate(navigateTo)
            }
        } catch (error) {
            processError(error)
        }
    }

    return { register, sendOTP, verifyOTP };
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
