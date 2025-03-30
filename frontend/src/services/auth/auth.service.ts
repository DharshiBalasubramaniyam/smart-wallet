import axios from 'axios';
import API_CONFIG from '../../config/api.config';
import { RegistrationInfo, SendOtpRequest, verifyOtpRequest } from '@/interfaces/modals';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setEmail } from '@/redux/features/auth';

const api = axios.create(API_CONFIG);

export function AuthService() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    async function register(body: RegistrationInfo): Promise<void> {
        const registerResponse = await api.post(`auth/register`, body);
        console.log(registerResponse);
        if (registerResponse.data.success && registerResponse.data.object.email) {
            dispatch(setEmail({ email: registerResponse.data.object.email }))
            await sendOTP({ email: registerResponse.data.object.email })
        } else {
            toast.error(registerResponse.data.error.message);
        }
    }

    async function sendOTP(body: SendOtpRequest): Promise<void> {
        const sendOtpResponse = await api.post(`auth/resend-otp`, body);
        console.log(sendOtpResponse);
        if (sendOtpResponse.data.success) {
            navigate("/verify")
        } else {
            toast.error(sendOtpResponse.data.error.message);
        }
    }

    async function verifyOTP(body: verifyOtpRequest, navigateTo: string): Promise<void> {
        const verifyOtpResponse = await api.post(`auth/verify-otp`, body);
        console.log(verifyOtpResponse);
        if (verifyOtpResponse.data.success) {
            navigate(navigateTo)
        } else {
            toast.error(verifyOtpResponse.data.error.message);
        }
    }

    return { register };
}
