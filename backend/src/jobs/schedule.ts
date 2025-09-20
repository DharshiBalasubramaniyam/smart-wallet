import cron from 'node-cron';
import Schedule from '../models/schedule';
import Transaction from '../models/transaction';
import { getNextDueDate } from '../utils/schedule.util';

export const initScheduleJobs = () => {
    cron.schedule('0 1 * * *', async () => {
        try {
            const today = new Date().toISOString().split("T")[0]
            console.log(`Schedule.Job ==> Process start for ${today}.`)
            const schedules = await Schedule.find({
                isActive: true,
                nextDueDate: today,
                isAutomated: true,
            });

            if (schedules.length === 0) {
                console.log(`Schedule.Job ==> No schedules found to confirm.`)
            }

            for (const schedule of schedules) {
                try {
                    // record the transaction
                    const transaction = await Transaction.create({
                        type: schedule.type,
                        amount: schedule.amount,
                        from: schedule.from,
                        to: schedule.to,
                        date: schedule.nextDueDate,
                        note: schedule.note,
                        pcategory: schedule.pcategory,
                        scategory: schedule.scategory,
                        userId: schedule.userId,
                        scheduleId: schedule._id
                    })

                    // update next due date
                    const nextDueDate = getNextDueDate(schedule.nextDueDate, schedule.endDate, schedule.recurrent, schedule.repeat, schedule.interval)
                    const updatedSchedule = await Schedule.findByIdAndUpdate(
                        schedule._id,
                        { nextDueDate: nextDueDate, isActive: nextDueDate != null },
                        { new: true }
                    );
                    console.log(`Schedule.Job ==> Confirmed schedule: ${schedule._id}`)
                } catch(error) {
                    console.error(`Schedule.Job ==> Error in confirming schedule ${schedule._id}:`, error);
                }
            }
        } catch (error) {
            console.error('Schedule.Job ==> Error in subscription renewal job:', error);
        }
    });
};




