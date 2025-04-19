import axios from 'axios';
import { api } from '../../config/api.config';
import { PlanInfo, PlanType, RegistrationInfo, SendOtpRequest, SubscribeRequest, verifyOtpRequest, UpdateCurrencyRequest, LoginInfo, LoginStatus } from '../../interfaces/modals';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, logout, setEmail, setIsAuthenticated, setOTPAttemptsRemaining, setToken } from '../../redux/features/auth';
import { UserPortalView } from '../../components/user.portal/SideBar';
import { RootState } from '@/redux/store/store';

export function AuthService() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = useSelector((state: RootState) => state.auth.token)
    const email = useSelector((state: RootState) => state.auth.email)

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

    async function protectedRoute(): Promise<void> {
        try {
            console.log("sending protected route request")
            const response = await api.get(`auth/protected`, {
                headers: {
                    "authorization": `Bearer ${token}`
                }
            });
            console.log(response.data)
            toast.info(response.data.message);
            // if (response.data.success) {
            //     return response.data.data.object as PlanInfo[];
            // }
        } catch (error) {
            processError(error)
        }
    }

    async function subscribePlan(body: SubscribeRequest, planName: string): Promise<void> {
        try {
            const response = await api.post(`auth/subscriptions/subscribe`, body);
            console.log(response.data)
            if (response.data.success) {
                if (planName === PlanType.STARTER) {
                    navigate('/currency', { state: { email:response.data.data.object.email } });
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
            const response = await api.post(`auth/login`, body, { withCredentials: true });
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
                toast.success("Login successful!");
                navigate(`/user-portal/${UserPortalView.DASHBOARD}`);
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

    async function loginWithGoogle(body: {token: string}) {
        try {
            const response = await api.post(`auth/google`, body, { withCredentials: true });
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
                toast.success("Login successful!");
                navigate(`/user-portal/${UserPortalView.DASHBOARD}`);
            }
        } catch (error) {
            // TODO: Catch different login error types: account not verified, subscription not found etc.
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage = error.response.data?.data?.message || "An error occurred while processing your request.";
                const status = error.response.data?.data?.object.status
                if (status === LoginStatus.BLOCKED || status === LoginStatus.INVALID_CREDENTIALS) {
                } else if (status === LoginStatus.CURRENCY_REQUIRED) {
                    navigate('/currency', { state: { email: error.response.data?.data?.object.email } });
                    dispatch(setEmail(error.response.data?.data?.object.email))
                } else if (status === LoginStatus.SUBSCRIPTION_REQUIRED || status === LoginStatus.SUBSCRIPTION_EXPIRED) {
                    console.log(error.response.data?.data?.object.email ?? "Email not available")
                    dispatch(setEmail(error.response.data?.data?.object.email))
                    navigate('/plans', { state: { email: error.response.data?.data?.object.email } });
                }
                toast.info(errorMessage);
            } else {
                toast.error("An unexpected error occurred. Please try again later.");
            }
            console.error("Error details:", error);
        }
    }

    const logOut = async () => {
        try {
            const response = await api.post(`auth/logout`, {}, { withCredentials: true }); // Send refresh token via cookie
            dispatch(logout());
        } catch (error) {
            console.log(error)
            dispatch(logout());
        }
    };

    return { register, sendOTP, verifyOTP, getAllPlans, subscribePlan, updateCurrency, login, loginWithGoogle, protectedRoute, logOut };
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
