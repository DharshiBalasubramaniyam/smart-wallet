import Button from "../../../components/Button";
import { CategoryInfo } from "../../../interfaces/modals";
import { CategoryService } from "../../../services/category.service";
import { useEffect, useState } from "react";

function Category() {
    const { getCategories } = CategoryService();
    const [categories, setCategories] = useState<CategoryInfo[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        const fetchCategories = () => {
            setLoading(true)
            getCategories()
                .then((res) => setCategories(res))
                .catch((err) => setCategories([]))
                .finally(() => setLoading(false))
        }
        fetchCategories();
    }, [])

    if (loading) return <h1 className="text-xl text-text-light-primary dark:text-text-dark-primary">Loading...</h1>

    return (
        <>
            <div className="flex justify-between items-center">
                <h1 className="text-xl text-text-light-primary dark:text-text-dark-primary">Categories</h1>
                {/* <div className="flex justify-end gap-3 items-center">
                    <Button
                        text="New Category"
                        className="max-w-fit"
                        onClick={() => { }}
                    />
                </div> */}
            </div>
            <div className="*:text-text-light-primary *:dark:text-text-dark-primary">
                {
                    categories?.map(pc => {
                        return (
                            <div key={pc.parentCategory}>
                                <div
                                    className="font-bold mt-3 capitalize"
                                >{pc.parentCategory}</div>
                                <div className="flex gap-3 flex-wrap">
                                    {pc.subCategories.map(sc => (
                                        <div
                                            key={sc.name}
                                            className="capitalize py-2 px-2 my-2 flex-1 min-w-64 max-w-80 text-text-light-secondary dark:text-text-dark-secondary"
                                            style={{
                                                backgroundColor: sc.color + "20", // add transparency for bg (hex + alpha)
                                                borderColor: sc.color,
                                                borderWidth: 1,
                                            }}
                                        >{sc.name}</div>
                                    ))}
                                </div>

                            </div>
                        )
                    })
                }
            </div>
        </>
    )

}

export default Category;