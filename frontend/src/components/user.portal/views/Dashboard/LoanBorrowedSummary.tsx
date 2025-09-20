import { FaHandHoldingUsd } from "react-icons/fa";
import { getFormattedDate } from "../../../../utils/utils";

function LoanBorrowedSummary({ currency, loanSummary }: { currency: string, loanSummary: any }) {
    const loanAmount = loanSummary?.loan ? loanSummary.loan[0].loanPrincipal.$numberDecimal : 0;
    const startDate = loanSummary?.loan ? (loanSummary.loan[0]?.loanStartDate?.split("T")[0] || "Not set") : "Not set";
    const endDate = loanSummary?.loan ? (loanSummary.loan[0]?.loanEndDate?.split("T")[0] || "Not set") : "Not set";
    const interest = loanSummary?.interestPaid?.length > 0 ? loanSummary.interestPaid[0].amount : 0
    const principalPaid = loanSummary?.principalPaid?.length > 0 ? loanSummary.principalPaid[0].amount : 0;
    const rate = loanAmount > 0 ? (principalPaid / loanAmount * 100).toFixed(0) : 0;

    return (
        <section className="rounded my-3 p-3 border border-border-light-primary dark:border-border-dark-primary *:text-text-light-primary *:dark:text-text-dark-primary">
            {/* title */}
            <div className="rounded flex justify-between items-center ">
                <span className="flex gap-3 items-center text-xl font-bold"><FaHandHoldingUsd />Loan summary</span>
            </div>

            {/* cash flow */}
            <div className="flex gap-3 *:flex-1 flex-wrap">

                <div className="pb-2 border-border-light-primary dark:border-border-dark-primary mt-3">
                    <h1 className="font-semibold">Loan amount</h1>
                    <h2 className="text-xl font-semibold text-text-light-secondary dark:text-text-dark-secondary">{loanAmount} {currency}</h2>
                </div>
                <div className="pb-2 border-border-light-primary dark:border-border-dark-primary mt-3">
                    <h1 className="font-semibold">Interest Paid</h1>
                    <h2 className="text-xl font-semibold text-text-light-secondary dark:text-text-dark-secondary">{interest} {currency}</h2>
                </div>
                <div className="pb-2 border-border-light-primary dark:border-border-dark-primary mt-3">
                    <h1 className="font-semibold">Start date</h1>
                    <h2 className="text-xl font-semibold text-text-light-secondary dark:text-text-dark-secondary">{getFormattedDate(startDate)}</h2>
                </div>

                <div className="pb-2 border-border-light-primary dark:border-border-dark-primary mt-3">
                    <h1 className="font-semibold">Due date</h1>
                    <h2 className="text-xl font-semibold text-text-light-secondary dark:text-text-dark-secondary">{getFormattedDate(endDate)}</h2>
                </div>



            </div>

            {/* due charts */}
            <div className="flex gap-3 *:flex-1 flex-wrap">

                <div className="p-2 border border-border-light-primary dark:border-border-dark-primary mt-3">
                    <h1>Principal Due</h1>
                    <div className="mt-3">
                        <div className="text-right w-full text-xs text-text-light-secondary dark:text-text-dark-secondary">{principalPaid} {currency}/{loanAmount}  {currency}</div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full dark:bg-gray-700">
                            <div className="bg-primary text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: `${rate}%` }}> {rate}%</div>
                        </div>
                    </div>
                </div>
                {/* <div className="p-2 border border-border-light-primary dark:border-border-dark-primary mt-3">
                    <h1>Interest Due</h1>
                </div> */}

            </div>

        </section >
    )
}

export default LoanBorrowedSummary;