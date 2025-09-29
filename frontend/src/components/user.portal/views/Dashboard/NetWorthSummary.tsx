import { FaBalanceScale } from "react-icons/fa";

function NetWorthSummary({ summary, currency }: { summary: any, currency: string }) {
    const assets = summary.totalCashAssetAmount+summary.totalBankAssetAmount+summary.totalLoanLentAssetAmount
    const liabilties = summary.totalLoanBorrowedLiabilityAmount + summary.totalCreditcardLiabilityAmount
    return (
        <div className="rounded my-3 p-3 flex justify-between items-center border border-border-light-primary dark:border-border-dark-primary *:text-xl *:text-text-light-primary *:dark:text-text-dark-primary *:font-bold bg-secondary">
            <span className="flex gap-3 items-center"><FaBalanceScale /><span>Net worth (Assets - Liabilities):</span></span>
            <span>{assets-liabilties} {currency}</span>
        </div>
    )
}

export default NetWorthSummary;