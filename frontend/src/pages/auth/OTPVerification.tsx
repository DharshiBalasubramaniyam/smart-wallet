import { useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { toast } from 'react-toastify';
import { AuthService } from "@/services/auth/auth.service";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

function OTPVerification() {
    const [otp, setOtp] = useState<string>("");
    const {sendOTP} = AuthService();
    const email = useSelector((state: RootState) => state.auth.email);
    const OTPAttemptsRemaining = useSelector((state: RootState) => state.auth.OTPAttemptsRemaining);

    const handleResend = async () => {
        await sendOTP({email: email ?? ""})
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateOTP(otp)) return;
        // Add your OTP verification logic here
        console.log("OTP:", otp);
    };

    return (
        <div className="font-main dark">
            <div className="min-h-screen flex fle-col items-center justify-center py-6 px-4 bg-bg-light-secondary dark:bg-bg-dark-secondary">
                <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl max-md:max-w-md w-full">
                    <div>
                        <h2 className="lg:text-5xl text-3xl font-extrabold lg:leading-[55px] text-text-light-primary dark:text-text-dark-primary">
                            Verify Your Email
                        </h2>
                        <p className="text-sm mt-6 text-text-light-secondary dark:text-text-dark-secondary">
                            We've sent a verification code to your email address. Please enter the code below to complete your registration.
                        </p>
                    </div>

                    <form className="max-w-md md:ml-auto w-full" onSubmit={onSubmit}>
                        <h3 className="text-text-light-primary dark:text-text-dark-primary text-3xl font-extrabold mb-5">
                            Enter Verification Code
                        </h3>

                        <div className="space-y-4">
                            <Input 
                                name="otp" 
                                type="text" 
                                placeholder="Enter OTP" 
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                            />
                        </div>

                        <div className="!mt-8">
                            <Button text="Verify OTP" type="submit" />
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            {
                                OTPAttemptsRemaining > 0 ? (
                                    <button 
                                        type="button"
                                        onClick={handleResend}
                                        disabled={OTPAttemptsRemaining > 0}
                                        className={`text-sm 'text-primary hover:underline cursor-pointer'}`}
                                    >
                                        Resend Code
                                    </button>
                                ) : (
                                    <p className="text-center text-sm">You have reached maxium number of attempts. Please try again after some time.</p>
                                )
                            }
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default OTPVerification;

function validateOTP(otp: string): boolean {
    if (otp.trim() === "") {
        toast.error("OTP is required!");
        return false;
    }
    if (otp.length !== 6) {
        toast.error("OTP must be 6 digits!");
        return false;
    }
    if (!/^\d+$/.test(otp)) {
        toast.error("OTP must contain only numbers!");
        return false;
    }
    return true;
}
