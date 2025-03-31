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
        const response = await api.post(`auth/register`, body);
        const { message, data } = processResponse(response.data);
        if (data) {
            dispatch(setEmail({ email: data.email }))
            await sendOTP({ email: data.email })
        }
    }

    async function sendOTP(body: SendOtpRequest): Promise<void> {
        const sendOtpResponse = await api.post(`auth/resend-otp`, body);
        const { message, data } = processResponse(sendOtpResponse.data);
        if (data) {
            dispatch(setOTPAttemptsRemaining({ OTPAttemptsRemaining: data.attemptsRemaining }))
            navigate("/verify-otp");
            toast.info("Verification OTP has been sent to your email");
        }
    }

    async function verifyOTP(body: verifyOtpRequest, navigateTo: string): Promise<void> {
        const verifyOtpResponse = await api.post(`auth/verify-otp`, body);
        const { message, data } = processResponse(verifyOtpResponse.data);
        if (data) {
            dispatch(setOTPAttemptsRemaining({ OTPAttemptsRemaining: 3 }))
            navigate(navigateTo)
        }
    }

    return { register, sendOTP, verifyOTP };
}

export function processResponse(response: any): { message: string, data: any } {
    console.log("Response: ", response);
    if (typeof response === "object" && "success" in response) {
        const apiRes = response as ApiResponse;
        if (apiRes.success) {
            return { message: apiRes.data?.message ?? "", data: apiRes.data?.object };;
        }
        toast.error(apiRes.error?.message);
        return { message: "", data: undefined };
    } else {
        toast.error("Internal server error!");
        return { message: "", data: undefined };
    }
}
