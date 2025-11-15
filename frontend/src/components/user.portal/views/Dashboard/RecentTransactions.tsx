import Button from "../../../Button";
import { FaClock } from "react-icons/fa";
import { useEffect, useState } from "react";
import { CategoryService } from "../../../../services/category.service";
import { CategoryInfo } from "../../../../interfaces/modals";
import { useNavigate, useParams } from "react-router-dom";
import TransactionList from "../Transactions/TransactionList";
import { toStrdSpaceType } from "../../../../utils/utils";

function RecentTransactions({loanSummary}: {loanSummary: any}) {

    const navigate = useNavigate();
    const { spaceid, spacetype } = useParams();
    const { getCategories } = CategoryService();
    const [categories, setCategories] = useState<CategoryInfo[]>([])

    useEffect(() => {
        const fetchCategories = () => {
         getCategories(toStrdSpaceType(spacetype))
            .then((res) => setCategories(res))
            .catch((err) => setCategories([]))
      }
      fetchCategories();
    }, [])

    const onViewAll = () => {
        navigate(`/user-portal/${spacetype}/${spaceid}/transactions`)
    }

    if (loanSummary?.recentTransactions?.length == 0) {
        return <></>
    }

    return (
        <section className="rounded my-3 p-3 border border-border-light-primary dark:border-border-dark-primary *:text-text-light-primary *:dark:text-text-dark-primary">
            {/* title */}
            <div className="rounded flex justify-between items-center ">
                <span className="flex gap-3 items-center text-xl font-bold"><FaClock />Recent Transactions</span>
                <Button
                    text="View All"
                    className="max-w-fit pt-2 pb-2"
                    onClick={onViewAll}
                />
            </div>
            <TransactionList
                transactions={loanSummary?.recentTransactions || []}
                categories={categories}
            />
        </section>
    )

}

export default RecentTransactions;