import { capitalize, getFormattedDate, toStrdSpaceType } from "../../../../utils/utils";
import { CategoryInfo } from "../../../../interfaces/modals";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { FaArrowDown, FaArrowUp, FaHandHoldingUsd, FaMoneyBillWave, FaTimes } from "react-icons/fa";
import { RiPercentLine } from "react-icons/ri";
import { HiOutlineCalendar } from "react-icons/hi";
import { TransactionType } from "../Transactions";
import { useParams } from "react-router-dom";
import { SpaceType } from "../Spaces";

function TransactionList({ transactions, categories, onClick }: { transactions: any[], categories: CategoryInfo[], onClick?: (t: any) => void }) {

    const { spaces, currency } = useSelector((state: RootState) => state.auth)
    const { spacetype, spaceid } = useParams()
    const standardSpaceType = toStrdSpaceType(spacetype || "") as SpaceType;
    console.log(transactions)
    return (
        <ul className="mt-5 *:mb-3">
            {
                transactions?.map((t) => {
                    return (
                        <li
                            key={t._id}
                            className={`rounded border border-border-light-primary dark:border-border-dark-primary p-2 flex flex-col gap-1 hover:bg-hover-light-primary dark:hover:bg-hover-dark-primary hover:cursor-pointer`}
                            onClick={onClick ? () => onClick(t) : () => { }}
                        >
                            <div className="flex justify-between">
                                <span className="text-text-light-primary dark:text-text-dark-primary capitalize">
                                    {
                                        (standardSpaceType === SpaceType.CASH || standardSpaceType === SpaceType.BANK) && t.pcategory &&
                                        (categories.find(pc => pc._id === t.pcategory)?.parentCategory) + " - "
                                    }
                                    {
                                        (standardSpaceType === SpaceType.CASH || standardSpaceType === SpaceType.BANK) && t.pcategory ?
                                            (categories.find(pc => pc._id === t.pcategory)?.subCategories
                                                .find(sc => sc._id === t.scategory)?.name) :
                                            capitalize(t.type.split("_").join(" "))
                                    }
                                </span>
                                <span className="text-text-light-primary dark:text-text-dark-primary">{currency}. {t.amount.$numberDecimal}</span>
                            </div>
                            <div className="flex gap-3 *:text-xs">
                                <span className="text-text-light-secondary dark:text-text-dark-secondary">{t.note}</span>
                            </div>
                            <div className="flex justify-between gap-3 *:text-sm">
                                <span className="text-text-light-secondary dark:text-text-dark-secondary flex gap-2 items-center capitalize">
                                    {
                                        standardSpaceType === SpaceType.CASH || standardSpaceType === SpaceType.BANK ? (
                                            spaceid === t.from ? <FaArrowUp className="text-red-500" /> : <FaArrowDown className="text-green-500" />
                                        ) : standardSpaceType === SpaceType.LOAN_BORROWED || standardSpaceType === SpaceType.LOAN_LENT ? (
                                            t.type === TransactionType.LOAN_PRINCIPAL ?
                                                <FaMoneyBillWave className="text-yellow-500" /> :
                                                t.type === TransactionType.PRINCIPAL_REPAYMENT_PAID || t.type === TransactionType.PRINCIPAL_REPAYMENT_RECEIVED ?
                                                    <FaHandHoldingUsd className="text-pink-500" /> :
                                                    <RiPercentLine className="text-red-500" />

                                        ) : standardSpaceType === SpaceType.CREDIT_CARD ? (
                                            t.type === TransactionType.PURCHASE || t.type === TransactionType.INTEREST_CHARGED ?
                                                <FaArrowUp className="text-red-500" /> :
                                                t.type === TransactionType.BILL_PAYMENT || t.type === TransactionType.REFUND ?
                                                    <FaArrowDown className="text-green-500" /> :
                                                    <RiPercentLine className="text-red-500" />

                                        ) : (
                                            <FaMoneyBillWave className="text-purple-500" />
                                        )
                                    }
                                    {
                                        spaceid === t.from ?
                                            `${spaces.find(s => s.id == t.to)?.name || "Outside wallet"}` :
                                            `${spaces.find(s => s.id == t.from)?.name || "Outside wallet"}`
                                    }
                                </span>
                                <span className="text-text-light-secondary dark:text-text-dark-secondary text-xs flex items-center gap-2">
                                    {
                                        t.scheduleId && <span title="Created via schedules"><HiOutlineCalendar className="inline-block" size={17}/></span>
                                    }
                                    {getFormattedDate(t.date)}
                                </span>
                            </div>
                        </li>
                    )
                })
            }

        </ul>
    )

}

export default TransactionList;