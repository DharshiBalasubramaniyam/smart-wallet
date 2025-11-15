// import Plan from '../models/plan';
// import Payment from '../models/payment';
// import cron from 'node-cron';
// import Subscription, { SubscriptionStatus } from '../models/subscription';

// export const initSubscriptionJobs = () => {
//     cron.schedule('0 0 * * *', async () => {
//         try {
//             const subscriptions = await Subscription.find({
//                 status: SubscriptionStatus.ACTIVE,
//                 autoRenew: true,
//                 nextBillingDate: {
//                     $lte: new Date(Date.now() + 24 * 60 * 60 * 1000) // Next 24 hours
//                 }
//             });

//             for (const subscription of subscriptions) {
//                 const result = await processSubscriptionRenewal(subscription);
//                 if (!result.success) {
//                     // Send notification to user about failed renewal
//                     console.log(`Subscription.Job ==> Failed to renew subscription ${subscription._id}: ${result.message}`);
//                 }
//             }
//         } catch (error) {
//             console.error('Subscription.Job ==> Error in subscription renewal job:', error);
//         }
//     });
// };


// const processSubscriptionRenewal = async (subscription: any) => {
//     try {
//         // Validate payment method
//         const payment = await Payment.findById(subscription.paymentId);
//         if (!payment || !payment.isValid) {
//             await Subscription.findByIdAndUpdate(subscription._id, {
//                 status: SubscriptionStatus.EXPIRED,
//                 autoRenew: false
//             });
//             return {
//                 success: false,
//                 message: 'Payment method invalid or expired'
//             };
//         }

//         // Get plan details
//         const plan = await Plan.findById(subscription.planId);
//         if (!plan || !plan.active) {
//             await Subscription.findByIdAndUpdate(subscription._id, {
//                 status: SubscriptionStatus.EXPIRED,
//                 autoRenew: false
//             });
//             return {
//                 success: false,
//                 message: 'Plan no longer active'
//             };
//         }

//         // Calculate new dates
//         const startDate = new Date();
//         const endDate = new Date();
//         endDate.setMonth(endDate.getMonth() + 1);

//         // Process payment here (integrate with payment gateway)
//         // const paymentResult = await processPayment(payment, plan.price);

//         // Update subscription
//         await Subscription.findByIdAndUpdate(subscription._id, {
//             startDate,
//             endDate,
//             lastBillingDate: startDate,
//             nextBillingDate: endDate,
//             status: SubscriptionStatus.ACTIVE
//         });

//         return {
//             success: true,
//             message: 'Subscription renewed successfully'
//         };
//     } catch (error) {
//         console.error('Error renewing subscription:', error);
//         return {
//             success: false,
//             message: 'Error processing renewal'
//         };
//     }
// };

