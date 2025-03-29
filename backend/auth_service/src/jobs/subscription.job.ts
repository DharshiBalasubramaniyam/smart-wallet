import cron from 'node-cron';
import Subscription, { SubscriptionStatus } from '../models/subscription';
import { processSubscriptionRenewal } from '../utils/subscription.util';

export const initSubscriptionJobs = () => {
    // Run every day at midnight
    cron.schedule('0 0 * * *', async () => {
        try {
            // Find subscriptions that need renewal
            const subscriptions = await Subscription.find({
                status: SubscriptionStatus.ACTIVE,
                autoRenew: true,
                nextBillingDate: {
                    $lte: new Date(Date.now() + 24 * 60 * 60 * 1000) // Next 24 hours
                }
            });

            for (const subscription of subscriptions) {
                const result = await processSubscriptionRenewal(subscription);
                if (!result.success) {
                    // Send notification to user about failed renewal
                    console.log(`Failed to renew subscription ${subscription._id}: ${result.message}`);
                }
            }
        } catch (error) {
            console.error('Error in subscription renewal job:', error);
        }
    });
};
