import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { MailOptions } from '../interfaces/requests';

// Ensure environment variables are loaded
dotenv.config();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error('Email credentials not found in environment variables');
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    debug: true // Enable debug logs
});

export const sendEmail = async (options: MailOptions): Promise<boolean> => {
    try {
        const mailOptions: any = {
            from: process.env.EMAIL_USER,
            ...options
        };

        await transporter.verify(); // Verify connection configuration
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        return true
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error(`Failed to send email: ${error}`);
        return false
    }
};

// const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: email,
//             subject: 'Account Verification OTP',
//             text: `Your OTP for account verification is: ${otp}. This code will expire in 10 minutes.`
//         };
