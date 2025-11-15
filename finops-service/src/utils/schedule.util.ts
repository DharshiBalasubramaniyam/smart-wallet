import { Repeat } from "../models/schedule";

export function getNextDueDate(currentDueDate: Date, endDate: Date | null, recurrent: boolean, repeat: Repeat, interval: number): Date | null {
    if (!recurrent) return null;

    const result = new Date(currentDueDate);

    if (repeat === "YEAR") {
        result.setFullYear(result.getFullYear() + interval);
    } else if (repeat === "MONTH") {
        const originalDate = result.getDate();
        result.setMonth(result.getMonth() + interval);

        if (result.getDate() !== originalDate) {
            result.setDate(0);
        }
    } else if (repeat === "WEEK") {
        result.setDate(result.getDate() + interval * 7);
    } else if (repeat === "DAY") {
        result.setDate(result.getDate() + interval);
    }

    if (endDate != null) {
        const endDate2 = new Date(endDate);
        if (result.getTime() > endDate2.getTime()) {
            return null;
        }
    }
    return result;
}