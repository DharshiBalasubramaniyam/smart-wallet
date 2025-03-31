import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';
import OTP from '../models/otp';
import { CreateAccountRequest, CreateSubscriptionRequest, SavePaymentRequest, UpdateCurrencyRequest, VerifyOTPRequest } from '../interfaces/requests';
import { generateOTP } from '../utils/otp.util';
import { sendOTPEmail } from '../services/email.service';
import Plan from '../models/plan';
import Payment from '../models/payment';
import Subscription, { SubscriptionStatus } from '../models/subscription';

const authRouter = express.Router();

// todo: login

// {
//     "email": "user@example.com",
//     "username": "testuser",
//     "password": "yourpassword"
// }
authRouter.post('/register', async (req: Request, res: Response) => {
    try {
        const { email, username, password }: CreateAccountRequest = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            res.status(400).json({
                success: false,
                error: { message: 'User with this email or username already exists' },
                data: null
            });
            return;
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user with currency as null and enabled as false
        const newUser = await User.create({
            email,
            username,
            password: hashedPassword,
            currency: null,
            enabled: false,
            blockedUntil: null
        });

        // Remove password from response
        const userResponse = newUser.toObject();
        delete (userResponse as { password?: string }).password;

        res.status(201).json({
            success: true,
            data: {
                object: userResponse,
                message: 'Account is created. Please verify your account.'
            },
            error: null
        });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: { message: 'Error creating account: ' + errorMessage },
            data: null
        });
    }
});

// {
//     "email": "user@example.com",
//     "otpCode": "123456"
// }
authRouter.post('/verify-otp', async (req: Request, res: Response) => {
    try {
        const { email, otpCode }: VerifyOTPRequest = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({
                success: false,
                error: { message: 'User not found. email: ' + email },
                data: null
            });
            return;
        }

        if (user.enabled) {
            res.status(404).json({
                success: false,
                error: { message: 'User is already verified. Try login.' },
                data: null
            });
            return;
        }

        if (user.blockedUntil && user.blockedUntil > new Date()) {
            const remainingTime = user.blockedUntil!.getTime() - Date.now();
            const minutesRemaining = Math.ceil(remainingTime / (1000 * 60));
            res.status(429).json({
                success: false,
                error: {
                    message: `Maximum resend attempts reached. Please try login after ${minutesRemaining} minutes`,
                },
                data: null
            });
        }

        // Find valid OTP
        const otp = await OTP.findOne({
            userId: user._id,
            code: otpCode,
            expiredAt: { $gt: new Date() }
        });

        if (!otp) {
            res.status(400).json({
                success: false,
                error: { message: 'Invalid or expired OTP' },
                data: null
            });
            return;
        }

        // Enable user account
        const savedUser = await User.findByIdAndUpdate(user._id, {
            enabled: true,
            blockedUntil: null,
        });

        // Delete used OTP
        await OTP.deleteOne({ _id: otp._id });

        res.status(200).json({
            success: true,
            data: { message: 'Account verified successfully', object: savedUser },
            error: null
        });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: { message: 'Error verifying account: ' + errorMessage },
            data: null
        });
    }
});

// {
//     "email": "user@example.com"
// }
authRouter.post('/resend-otp', async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({
                success: false,
                error: { message: 'User not found' },
                data: null
            });
            return;
        }

        const existingOTP = await OTP.findOne({
            userId: user._id,
            expiredAt: { $gt: new Date() }
        });

        // Check if user is blocked
        if (user.blockedUntil) {
            if (user.blockedUntil > new Date()) {
                const remainingTime = user.blockedUntil.getTime() - Date.now();
                const minutesRemaining = Math.ceil(remainingTime / (1000 * 60));
                res.status(429).json({
                    success: false,
                    error: {
                        message: `Too many attempts. Try again after ${minutesRemaining} minutes`,
                        blockedUntil: user.blockedUntil
                    },
                    data: null
                });
                return;
            } else {
                user.blockedUntil = undefined;
                await OTP.deleteOne({ _id: existingOTP?._id });
                await user.save();
            }
        }

        // Generate new OTP code
        const otpCode = generateOTP();
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

        if (!existingOTP) {
            // No existing OTP - create new one
            await OTP.create({
                userId: user._id,
                code: otpCode,
                description: 'Account verification',
                expiredAt: otpExpiry,
                attempts: 1,
                lastOtpAttemptAt: new Date()
            });
        } else {
            // Check if last request was more than 30 minutes ago
            const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

            if (existingOTP.lastOtpAttemptAt && existingOTP.lastOtpAttemptAt < thirtyMinutesAgo) {
                // Delete old OTP and create new one
                await OTP.deleteOne({ _id: existingOTP._id });
                await OTP.create({
                    userId: user._id,
                    code: otpCode,
                    description: 'Account verification',
                    expiredAt: otpExpiry,
                    attempts: 1,
                    lastOtpAttemptAt: new Date()
                });
            } else if (existingOTP.attempts < 3) {
                // Increment attempts and update OTP
                await OTP.findByIdAndUpdate(existingOTP._id, {
                    code: otpCode,
                    expiredAt: otpExpiry,
                    $inc: { attempts: 1 },
                    lastOtpAttemptAt: new Date()
                });
            } else {
                // Block user after 3 attempts
                const blockUntil = new Date();
                blockUntil.setMinutes(blockUntil.getMinutes() + 30);

                await User.findByIdAndUpdate(user._id, {
                    blockedUntil: blockUntil,
                    enabled: false
                });

                await OTP.deleteOne({ _id: existingOTP._id });

                res.status(429).json({
                    success: false,
                    error: {
                        message: 'Too many attempts. Try again after 30 minutes',
                        blockedUntil: blockUntil
                    },
                    data: null
                });
                return;
            }
        }

        // Send OTP email
        await sendOTPEmail(email, otpCode);

        const currentOTP = await OTP.findOne({ userId: user._id });

        res.status(200).json({
            success: true,
            data: {
                message: 'New OTP has been sent to your email',
                object: {
                    attemptsRemaining: 3 - currentOTP!.attempts,
                    expiresIn: '10 minutes'
                }
            },
            error: null
        });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: { message: 'Error sending OTP: ' + errorMessage },
            data: null
        });
    }
});


// {
//     "email": "user@example.com",
//     "type": "CREDIT_CARD",
//     "details": {
//         "cardType": "VISA",
//         "lastFourDigits": "4242",
//         "expiryDate": "12/25"
//     },
//     "isDefault": true
// }
authRouter.post('/payments', async (req: Request, res: Response) => {
    try {
        const { email, type, details, isDefault }: SavePaymentRequest = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({
                success: false,
                error: { message: 'User not found. email: ' + email },
                data: null
            });
            return;
        }

        // If setting as default, remove default flag from other payments
        if (isDefault) {
            await Payment.updateMany(
                { userId: user._id },
                { isDefault: false }
            );
        }

        const payment = await Payment.create({
            userId: user._id,
            type,
            details,
            isDefault
        });

        res.status(201).json({
            success: true,
            data: { message: 'Payment is successfull', object: payment },
            error: null
        });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: { message: 'Error saving payment method: ' + errorMessage },
            data: null
        });
    }
});

// {
//     "email": "user@example.com",
//     "planId": "plan_id_here",
//     "paymentId": "payment_id_here"
//     "autoRenew": "true"
// }
authRouter.post('/subscriptions', async (req: Request, res: Response) => {
    try {
        const { email, planId, paymentId, autoRenew }: CreateSubscriptionRequest = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({
                success: false,
                error: { message: 'User not found. email: ' + email },
                data: null
            });
            return;
        }

        // Check for existing active subscription
        const existingSubscription = await Subscription.findOne({
            userId: user._id,
            status: SubscriptionStatus.ACTIVE
        });

        if (existingSubscription) {
            // Auto-cancel the existing subscription
            await Subscription.findByIdAndUpdate(
                existingSubscription._id,
                {
                    status: SubscriptionStatus.CANCELLED,
                    cancelledAt: new Date(),
                    autoRenew: false
                }
            );
        }

        const plan = await Plan.findById(planId);
        if (!plan || !plan.active) {
            res.status(400).json({
                success: false,
                error: { message: 'Invalid or inactive plan' },
                data: null
            });
            return;
        }

        const payment = await Payment.findById(paymentId);
        if (!payment || !payment.isValid) {
            res.status(400).json({
                success: false,
                error: { message: 'Invalid payment method' },
                data: null
            });
            return;
        }

        const startDate = new Date();
        const endDate = new Date();
        // Set end date based on billing cycle
        if (plan.billingCycle === 'MONTHLY') {
            endDate.setMonth(endDate.getMonth() + 1);
        } else if (plan.billingCycle === 'YEARLY') {
            endDate.setFullYear(endDate.getFullYear() + 1);
        }

        const subscription = await Subscription.create({
            userId: user._id,
            planId: plan._id,
            paymentId: payment._id,
            startDate,
            endDate,
            lastBillingDate: startDate,
            nextBillingDate: endDate,
            status: SubscriptionStatus.PENDING,
            autoRenew
        });

        res.status(201).json({
            success: true,
            data: { object: subscription, message: 'Subscription is successfull' },
            error: null
        });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: { message: 'Error creating subscription: ' + errorMessage },
            data: null
        });
    }
});

// ...existing code...

// {
//     "email": "user@example.com",
//     "paymentId": "payment_id_here"
// }
authRouter.post('/subscriptions/:subscriptionId/activate', async (req: Request, res: Response) => {
    try {
        const { subscriptionId } = req.params;
        const { email, paymentId } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({
                success: false,
                error: { message: 'User not found' },
                data: null
            });
            return;
        }

        // Find pending subscription
        const subscription = await Subscription.findOne({
            _id: subscriptionId,
            userId: user._id,
            status: SubscriptionStatus.PENDING
        });

        if (!subscription) {
            res.status(404).json({
                success: false,
                error: { message: 'Pending subscription not found' },
                data: null
            });
            return;
        }

        // Verify payment method
        const payment = await Payment.findById(paymentId);
        if (!payment || !payment.isValid) {
            res.status(400).json({
                success: false,
                error: { message: 'Invalid payment method' },
                data: null
            });
            return;
        }

        // Cancel any existing active subscriptions
        await Subscription.updateMany(
            {
                userId: user._id,
                status: SubscriptionStatus.ACTIVE,
                _id: { $ne: subscriptionId }
            },
            {
                status: SubscriptionStatus.CANCELLED,
                cancelledAt: new Date(),
                autoRenew: false
            }
        );

        // Activate the subscription
        const activatedSubscription = await Subscription.findByIdAndUpdate(
            subscriptionId,
            {
                status: SubscriptionStatus.ACTIVE,
                paymentId
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: {
                object: activatedSubscription,
                message: 'Subscription activated successfully'
            },
            error: null
        });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: { message: 'Error activating subscription: ' + errorMessage },
            data: null
        });
    }
});

// {
//     "email": "user@example.com"
// }
authRouter.patch('/subscriptions/:subscriptionId/cancel', async (req: Request, res: Response) => {
    try {
        const { subscriptionId } = req.params;
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({
                success: false,
                error: { message: 'User not found' },
                data: null
            });
            return;
        }

        const subscription = await Subscription.findOne({
            _id: subscriptionId,
            userId: user._id
        });

        if (!subscription) {
            res.status(404).json({
                success: false,
                error: { message: 'Subscription not found' },
                data: null
            });
            return;
        }

        if (subscription.status === SubscriptionStatus.CANCELLED) {
            res.status(400).json({
                success: false,
                error: { message: 'Subscription is already cancelled' },
                data: null
            });
            return;
        }

        const updatedSubscription = await Subscription.findByIdAndUpdate(
            subscriptionId,
            {
                status: SubscriptionStatus.CANCELLED,
                cancelledAt: new Date(),
                autoRenew: false
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: {
                object: updatedSubscription,
                message: 'Subscription cancelled successfully'
            },
            error: null
        });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: { message: 'Error cancelling subscription: ' + errorMessage },
            data: null
        });
    }
});

// {
//     "email": "user@example.com",
//     "currency": "EUR"
// }
authRouter.patch('/update-currency', async (req: Request, res: Response) => {
    try {
        const { email, currency }: UpdateCurrencyRequest = req.body;

        // Find and verify user exists
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({
                success: false,
                error: { message: 'User not found. email: ' + email },
                data: null
            });
            return;
        }

        // Verify user is enabled
        if (!user.enabled) {
            res.status(403).json({
                success: false,
                error: { message: 'Account not verified. Please verify your account first.', verfication: false },
                data: null
            });
            return;
        }

        // Update currency
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { currency },
            { new: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            data: {
                object: updatedUser,
                message: 'Currency updated successfully'
            },
            error: null
        });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: { message: 'Error updating currency: ' + errorMessage },
            data: null
        });
    }
});

export default authRouter;
