import { getFormattedDate } from "../../../../utils/utils";
import { FaHandHoldingUsd } from "react-icons/fa";

function CreditCardSummary({ currency, creditCardSummary }: { currency: string, creditCardSummary: any }) {

    const totalLimit = creditCardSummary?.spaceInfo ? creditCardSummary.spaceInfo[0]?.creditCardLimit?.$numberDecimal : 0;
    const actualDueDate = creditCardSummary?.spaceInfo ? (creditCardSummary.spaceInfo[0]?.creditCardDueDate?.split("T")[0] || "Not set") : "Not set";
    const actualStatementDate = creditCardSummary?.spaceInfo ? (creditCardSummary.spaceInfo[0]?.creditCardStatementDate?.split("T")[0] || "Not set") : "Not set";
    const creditCardDueDate = getDueDate(actualDueDate)
    const creditCardStatementDate = getStatementDate(actualStatementDate, actualDueDate)
    const totalBalance = creditCardSummary?.totalBalance?.length > 0 ? creditCardSummary.totalBalance[0]?.amount : 0
    const totalPayment = creditCardSummary?.totalPayment?.length > 0 ? creditCardSummary.totalPayment[0]?.amount : 0;
    const totalOutStanding = totalBalance - totalPayment;
    const utilizationRate = totalLimit > 0 ? (totalOutStanding / totalLimit * 100).toFixed(2) : 0.0;

    return (
        <section className="rounded my-3 p-3 border border-border-light-primary dark:border-border-dark-primary *:text-text-light-primary *:dark:text-text-dark-primary">
            {/* title */}
            <div className="rounded flex justify-between items-center ">
                <span className="flex gap-3 items-center text-xl font-bold"><FaHandHoldingUsd />Card summary</span>
            </div>

            {/* cash flow */}
            <div className="flex gap-3 *:flex-1 flex-wrap">

                <div className="pb-2 border-border-light-primary dark:border-border-dark-primary mt-3">
                    <h1 className="font-semibold">Total Outstanding</h1>
                    <h2 className="text-xl font-semibold text-text-light-secondary dark:text-text-dark-secondary">{totalOutStanding} {currency}</h2>
                </div>
                <div className="pb-2 border-border-light-primary dark:border-border-dark-primary mt-3">
                    <h1 className="font-semibold">Total Limit</h1>
                    <h2 className="text-xl font-semibold text-text-light-secondary dark:text-text-dark-secondary">{totalLimit} {currency}</h2>
                </div>
                <div className="pb-2 border-border-light-primary dark:border-border-dark-primary mt-3">
                    <h1 className="font-semibold">Statement date</h1>
                    <h2 className="text-xl font-semibold text-text-light-secondary dark:text-text-dark-secondary">{getFormattedDate(creditCardStatementDate)}</h2>
                </div>
                <div className="pb-2 border-border-light-primary dark:border-border-dark-primary mt-3">
                    <h1 className="font-semibold">Due date</h1>
                    <h2 className="text-xl font-semibold text-text-light-secondary dark:text-text-dark-secondary">{getFormattedDate(creditCardDueDate)}</h2>
                </div>
            </div>

            {/* card charts */}
            <div className="flex gap-3 *:flex-1 flex-wrap">

                <div className="p-2 border border-border-light-primary dark:border-border-dark-primary mt-3">
                    <h1>Card Utilization</h1>
                    <div className="mt-3">
                        <div className="text-right w-full text-xs text-text-light-secondary dark:text-text-dark-secondary">{totalOutStanding} {currency}/{totalLimit} {currency}</div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full dark:bg-gray-700">
                            <div className="bg-primary text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: `${Number(utilizationRate) > 100 ? 100 : utilizationRate}%` }}> {utilizationRate}%</div>
                        </div>
                    </div>
                </div>
            </div>

        </section >
    )
}

export default CreditCardSummary;


export function getStatementDate(statementDate: string, dueDate: string) {
    if (statementDate === "Not set") return statementDate;

    const targetDate = new Date(dueDate);
    const statementDateOld = new Date(statementDate);
    const today = new Date();
    let newdate = statementDate;

    if (targetDate < today) {
        const newDay = statementDateOld.getDate();
        const newMonth = statementDateOld.getMonth() == 11 ? 0 : statementDateOld.getMonth() + 1;
        const newYear = statementDateOld.getMonth() == 11 ? statementDateOld.getFullYear() + 1 : statementDateOld.getFullYear();

        newdate = `${newYear}-${String(newMonth + 1).padStart(2, "0")}-${String(newDay).padStart(2, "0")}`
    }
    return newdate;

}

export function getDueDate(dueDate: string) {

    const targetDate = new Date(dueDate);
    const today = new Date();
    let newdate = dueDate;

    if (targetDate < today) {
        const newDay = targetDate.getDate();
        const newMonth = targetDate.getMonth() == 11 ? 0 : targetDate.getMonth() + 1;
        const newYear = targetDate.getMonth() == 11 ? targetDate.getFullYear() + 1 : targetDate.getFullYear();

        newdate = `${newYear}-${String(newMonth + 1).padStart(2, "0")}-${String(newDay).padStart(2, "0")}`
    }
    return newdate;

}