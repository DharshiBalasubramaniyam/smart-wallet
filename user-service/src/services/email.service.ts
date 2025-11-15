import { api } from '../config/api';
import { MailRequest } from '../interfaces/requests';

export async function sendRegisterOTPEmail(userId: any, email: string, otp: string): Promise<boolean> {
        try {
        const mailReq =  {
            mailOptions: {
                to: email,
                subject: 'Account Verification OTP',
                text: `Your OTP for account verification is: ${otp}. This code will expire in 10 minutes.`
            },
            userId: userId,
            type: "REGISTER_OTP_SEND"
        };
            const response = await api.post(`notification/email/send/`, mailReq);
            return response.data.success;
        } catch (error) {
            return false
        }
    }

// export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
//     try {
//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: email,
//             subject: 'Account Verification OTP',
//             text: `Your OTP for account verification is: ${otp}. This code will expire in 10 minutes.`
//         };

//         await transporter.verify(); // Verify connection configuration
//         const info = await transporter.sendMail(mailOptions);
//         console.log('Email sent successfully:', info.response);
        
//     } catch (error) {
//         console.error('Error sending email:', error);
//         throw new Error(`Failed to send OTP email: ${error}`);
//     }
// };
