import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

export const sendOTPEmail = async (email: string, otp: string) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Account Verification OTP',
        text: `Your OTP for account verification is: ${otp}. This code will expire in 10 minutes.`
    };

    await transporter.sendMail(mailOptions);
};
