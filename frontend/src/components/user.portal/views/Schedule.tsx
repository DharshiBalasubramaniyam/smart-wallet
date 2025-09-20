import Button from "../../Button";
import Input from "../../Input";
import { useEffect, useState } from 'react';
import { CategoryInfo, ContinueType, Frequency, RecurringApproval, Repeat, ScheduleInfo, TransactionInfo } from "../../../interfaces/modals"
import { toast } from 'react-toastify';
import { toStrdSpaceType } from "../../../utils/utils";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { CategoryService } from "../../../services/category.service";
import { FaEdit, FaInfoCircle, FaTimes, FaTrash } from "react-icons/fa"
import { TransactionType, transactionTypesInfo } from "./Transactions";
import { ScheduleService } from "../../../services/schedule.service";
import ScheduleList from "./Schedules/ScheduleList";

function Schedule() {

   const { spacetype, spaceid } = useParams()
   const { spaces } = useSelector((state: RootState) => state.auth)
   const [inputs, setInputs] = useState<ScheduleInfo>({
      type: "",
      amount: 0.0,
      from: null,
      to: null,
      note: "",
      scategory: null,
      pcategory: null,
      frequency: "",
      startDate: getTodayDate(),
      repeat: Repeat.DAY,
      interval: 1,
      recurringApproval: RecurringApproval.AUTO,
      continue: ContinueType.FOREVER,
      endDate: null,
      isClosed: false
   });
   const [newOrEditMode, setNewMode] = useState<boolean>(false)
   const [viewMode, setViewMode] = useState<boolean>(false)
   const [editId, setEditId] = useState<string | null>(null)
   const [canEditSchedule, setCanEditSchedule] = useState<boolean>(false)
   const [schedules, setSchedules] = useState<any[]>([])
   const [total, setTotal] = useState<any>(0)
   const [categories, setCategories] = useState<CategoryInfo[]>([])
   const [page, setPage] = useState<number>(1);
   const [loading, setLoading] = useState<boolean>(false)
   const spaceInfo = transactionTypesInfo.find(info => toStrdSpaceType(spacetype) === info.spaceType) || null
   // const { createTransaction, editTransaction, deleteTransaction, getTransactionsByUser } = TransactionService();
   const { createSchedule, deleteSchedule, editSchedule, getSchedulesByUser, confirmSchedule, skipSchedule } = ScheduleService();
   const { getCategories } = CategoryService();
   const pageLimit = 10;

   const onView = (schedule: any) => {
      const info: ScheduleInfo = {
         amount: schedule.amount.$numberDecimal,
         startDate: schedule.nextDueDate?.split("T")[0] || schedule.startDate?.split("T")[0],
         from: schedule.from,
         to: schedule.to,
         note: schedule.note,
         pcategory: schedule.pcategory,
         scategory: schedule.scategory,
         type: schedule.type,
         frequency: schedule.recurrent ? Frequency.RECURRENT : Frequency.ONE_TIME,
         repeat: schedule.repeat,
         interval: schedule.interval,
         recurringApproval: schedule.isAutomated ? RecurringApproval.AUTO : RecurringApproval.MANUAL,
         continue: schedule.endDate ? ContinueType.UNTIL_A_DATE : ContinueType.FOREVER,
         endDate: schedule.endDate ? schedule.endDate.split("T")[0] : null,
         isClosed: !schedule.isActive
      }
      console.log(schedule, info);
      setInputs(info)
      setEditId(schedule._id)
      setCanEditSchedule(schedule.isActive)
      setViewMode(true)
   }

   const onNewOrEditMode = () => {
      setViewMode(false);
      setNewMode(true);
   }

   const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target as HTMLInputElement;
      setInputs((prev: ScheduleInfo) => {
         return { ...prev, [name]: value }
      });
   }

   const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
   }

   const onNewOrEditSubmit = async () => {
      console.log(inputs)
      if (inputs.amount == 0.0) {
         toast.error("Amount is required!")
         return;
      }

      let finalInputs = inputs;

      if (inputs.type === TransactionType.PRINCIPAL_REPAYMENT_RECEIVED || inputs.type === TransactionType.PRINCIPAL_REPAYMENT_PAID) {
         const pcategory = categories.find((cat) => cat.parentCategory === "loan");
         const scategory = pcategory?.subCategories.find((cat) => cat.name === "repayment")
         finalInputs = { ...inputs, pcategory: pcategory?._id || null, scategory: scategory?._id || null }
      }

      else if (inputs.type === TransactionType.INTEREST_PAID || inputs.type === TransactionType.INTEREST_RECEIVED) {
         const pcategory = categories.find((cat) => cat.parentCategory === "loan");
         const scategory = pcategory?.subCategories.find((cat) => cat.name === "interest")
         finalInputs = { ...inputs, pcategory: pcategory?._id || null, scategory: scategory?._id || null }
      }

      else if (inputs.type === TransactionType.INTERNAL_TRANSFER) {
         const pcategory = categories.find((cat) => cat.parentCategory === "Miscellaneous");
         const scategory = pcategory?.subCategories.find((cat) => cat.name === "transfer")
         finalInputs = { ...inputs, pcategory: pcategory?._id || null, scategory: scategory?._id || null }
      }

      else if (inputs.type === TransactionType.BILL_PAYMENT) {
         const pcategory = categories.find((cat) => cat.parentCategory === "Miscellaneous");
         const scategory = pcategory?.subCategories.find((cat) => cat.name === "bills")
         finalInputs = { ...inputs, pcategory: pcategory?._id || null, scategory: scategory?._id || null }
      }
      console.log(finalInputs)
      setLoading(true)
      if (editId) {
         await editSchedule(editId, finalInputs)
      } else {
         await createSchedule(finalInputs)
      }
      getSchedulesByUser(spaceid || "", pageLimit, (page - 1) * pageLimit)
         .then(res => {
            setSchedules(res.schedules)
            setTotal(res.total)
         })
         .catch(err => setSchedules([]))
         .finally(() => {
            setLoading(false);
         });
      onCancel();
   }

   const onDelete = async () => {
      if (!editId) return;
      setLoading(true)
      await deleteSchedule(editId)
      getSchedulesByUser(spaceid || "", pageLimit, (page - 1) * pageLimit)
         .then(res => {
            setSchedules(res.schedules)
            setTotal(res.total)
         })
         .catch(err => setSchedules([]))
         .finally(() => {
            setLoading(false);
         });
      onCancel();
   }

   const onConfirm = async (id: string) => {
      setLoading(true)
      await confirmSchedule(id)
      getSchedulesByUser(spaceid || "", pageLimit, (page - 1) * pageLimit)
         .then(res => {
            setSchedules(res.schedules)
            setTotal(res.total)
         })
         .catch(err => setSchedules([]))
         .finally(() => {
            setLoading(false);
         });
   }

   const onSkip = async (id: string) => {
      setLoading(true)
      await skipSchedule(id)
      getSchedulesByUser(spaceid || "", pageLimit, (page - 1) * pageLimit)
         .then(res => {
            setSchedules(res.schedules)
            setTotal(res.total)
         })
         .catch(err => setSchedules([]))
         .finally(() => {
            setLoading(false);
         });
   }

   const onCancel = () => {
      setViewMode(false)
      setNewMode(false)
      setEditId(null)
      setInputs({
         type: "",
         amount: 0.0,
         from: null,
         to: null,
         note: "",
         scategory: null,
         pcategory: null,
         frequency: "",
         startDate: getTodayDate(),
         repeat: Repeat.DAY,
         interval: 1,
         recurringApproval: RecurringApproval.AUTO,
         continue: ContinueType.FOREVER,
         endDate: null
      })
   }

   useEffect(() => {
      const fetchCategories = () => {
         getCategories()
            .then((res) => setCategories(res))
            .catch((err) => setCategories([]))
      }
      fetchCategories();
      setLoading(true)
      getSchedulesByUser(spaceid || "", pageLimit, (page - 1) * pageLimit)
         .then(res => {
            setSchedules(res.schedules)
            setTotal(res.total)
         })
         .catch(err => setSchedules([]))
         .finally(() => {
            setLoading(false);
         });
   }, [])

   useEffect(() => {
      if (spaceInfo?.transactionTypes.find(t => t.type === inputs.type)?.fromSpaces.includes("ACTIVE_SPACE")) {
         setInputs((prev: any) => {
            return { ...prev, from: spaceid }
         });
      }

      if (spaceInfo?.transactionTypes.find(t => t.type === inputs.type)?.toSpaces.includes("ACTIVE_SPACE")) {
         console.log("sdsd")
         setInputs((prev: any) => {
            return { ...prev, to: spaceid }
         });
      }

      if (inputs.type == TransactionType.INCOME) {
         setInputs((prev: any) => {
            return { ...prev, pcategory: categories.find((c) => c.parentCategory === "Income")?._id }
         });
      }
   }, [inputs.type])

   useEffect(() => {
      setLoading(true)
      getSchedulesByUser(spaceid || "", pageLimit, (page - 1) * pageLimit)
         .then(res => {
            setSchedules(res.schedules)
            setTotal(res.total)
         })
         .catch(err => setSchedules([]))
         .finally(() => {
            setLoading(false);
         });
   }, [page, spaceid])

   if (loading) return <h1 className="text-xl text-text-light-primary dark:text-text-dark-primary">Loading...</h1>

   console.log("inputs", inputs)

   return (
      <>
         {/* sub header */}
         <div className="flex justify-between items-center">
            <h1 className="text-xl text-text-light-primary dark:text-text-dark-primary">Schedules</h1>
            <div className="flex justify-end gap-3 items-center">
               {
                  (!loading && schedules?.length != 0) && (
                     <>
                        <Button
                           text={`${(page - 1) * pageLimit + 1}-${(page - 1) * pageLimit + (schedules?.length)} of ${total}`}
                           className="max-w-fit bg-transparent pointer-events-none"
                           onClick={() => { }}
                        />
                        <Button
                           text="Prev"
                           className="max-w-fit bg-transparent border border-border-light-primary dark:border-border-dark-primary"
                           onClick={() => setPage(prev => {
                              return prev - 1
                           })}
                           disabled={page == 1}
                        />
                        <Button
                           text="Next"
                           className="max-w-fit bg-transparent border border-border-light-primary dark:border-border-dark-primary"
                           onClick={() => setPage(prev => {
                              return prev + 1
                           })}
                           disabled={page * pageLimit >= total}
                        />
                     </>
                  )
               }

               <Button
                  text="New Schedule"
                  className="max-w-fit"
                  onClick={onNewOrEditMode}
               />
            </div>
         </div>

         {/* new or edit schedule */}
         {
            newOrEditMode && (
               <div
                  className="fixed top-0 left-0 w-screen h-screen z-[999] grid place-items-center bg-opacity-50 overflow-auto p-4 modal-bg pt-10"
               >
                  <div
                     className="relative w-full max-w-lg rounded-lg bg-bg-light-secondary dark:bg-bg-dark-secondary shadow-sm p-3"
                  >
                     <div className="flex shrink-0 items-center pb-4 text-xl font-medium text-text-light-primary dark:text-text-dark-primary">
                        {editId ? "Edit Schedule" : "New Schedule"}
                     </div>
                     <form className="border-t border-b border-border-light-primary dark:border-border-dark-primary" onSubmit={onSubmit}>
                        {/* type */}
                        <div className="my-3">
                           <label className="text-text-light-primary dark:text-text-dark-primary font-bold">Type:</label>
                           <select
                              className="w-full p-3 my-3 border border-border-light-primary dark:border-border-dark-primary rounded-md bg-bg-light-primary dark:bg-bg-dark-primary text-text-light-primary dark:text-text-dark-primary focus:border-primary text-sm"
                              value={inputs.type}
                              name="type"
                              onChange={onInputChange}
                           >
                              <option value={""}>
                                 Select type
                              </option>
                              {
                                 spaceInfo?.transactionTypes.map((t) => {
                                    return (
                                       <option value={t.type}>
                                          {t.type.split("_").join(" ")}
                                       </option>
                                    )
                                 })
                              }

                           </select>
                        </div>

                        {/* from */}
                        <div className={inputs.type != "" ? `my-3` : `my-3 hidden`}>
                           <label className="text-text-light-primary dark:text-text-dark-primary font-bold">From space:</label>
                           <select
                              className="w-full p-3 my-3 border border-border-light-primary dark:border-border-dark-primary rounded-md bg-bg-light-primary dark:bg-bg-dark-primary text-text-light-primary dark:text-text-dark-primary focus:border-primary text-sm disabled:opacity-50 disabled *:capitalize capitalize"
                              value={inputs.from || ""}
                              name="from"
                              onChange={onInputChange}
                              disabled={spaceInfo?.transactionTypes.find(t => t.type === inputs.type)?.fromSpaces.some(sp => ["ACTIVE_SPACE", "OUTSIDE_MYWALLET"].includes(sp))}
                           >

                              {
                                 spaceInfo?.transactionTypes.find(t => t.type === inputs.type)?.fromSpaces.includes("ACTIVE_SPACE") ? (
                                    <option value={spaceid}>
                                       {spaces.find(s => s.id == spaceid)?.name.split("-").join(" ").toUpperCase()}
                                    </option>
                                 )
                                    : spaceInfo?.transactionTypes.find(t => t.type === inputs.type)?.fromSpaces.includes("OUTSIDE_MYWALLET") ? (
                                       <option value={undefined}>
                                          OUTSIDE SMARTWALLET
                                       </option>
                                    ) :
                                       (
                                          <option value={""}>
                                             Select Space
                                          </option>
                                       )
                              }
                              {
                                 spaces.filter((s) => {
                                    const transactionInfo = spaceInfo?.transactionTypes.find(t => t.type === inputs.type)
                                    return transactionInfo?.fromSpaces.includes(s.type)
                                 }).map((s) => {
                                    return (
                                       <option value={s.id}>
                                          {s.name.split("_").join(" ")}
                                       </option>
                                    )
                                 })
                              }
                           </select>
                        </div>

                        {/* to */}
                        <div className={inputs.type != "" ? `my-3` : `my-3 hidden`}>
                           <label className="text-text-light-primary dark:text-text-dark-primary font-bold">To space:</label>
                           <select
                              className="w-full p-3 my-3 border border-border-light-primary dark:border-border-dark-primary rounded-md bg-bg-light-primary dark:bg-bg-dark-primary text-text-light-primary dark:text-text-dark-primary focus:border-primary text-sm disabled:opacity-50 *:capitalize capitalize"
                              value={inputs.to || ""}
                              name="to"
                              onChange={onInputChange}
                              disabled={spaceInfo?.transactionTypes.find(t => t.type === inputs.type)?.toSpaces.some(sp => ["ACTIVE_SPACE", "OUTSIDE_MYWALLET"].includes(sp))}
                           >

                              {
                                 spaceInfo?.transactionTypes.find(t => t.type === inputs.type)?.toSpaces.includes("ACTIVE_SPACE") ? (
                                    <option value={spaceid}>
                                       {spaces.find(s => s.id == spaceid)?.name.split("-").join(" ").toUpperCase()}
                                    </option>
                                 )
                                    : spaceInfo?.transactionTypes.find(t => t.type === inputs.type)?.toSpaces.includes("OUTSIDE_MYWALLET") ? (
                                       <option value={undefined}>
                                          OUTSIDE SMARTWALLET
                                       </option>
                                    ) :
                                       (
                                          <option value={""}>
                                             Select Space
                                          </option>
                                       )
                              }
                              {
                                 spaces.filter((s) => {
                                    const transactionInfo = spaceInfo?.transactionTypes.find(t => t.type === inputs.type)
                                    return transactionInfo?.toSpaces.includes(s.type) && s.id != spaceid
                                 }).map((s) => {
                                    return (
                                       <option value={s.id}>
                                          {s.name.split("_").join(" ").toUpperCase()}
                                       </option>
                                    )
                                 })
                              }
                           </select>
                        </div>

                        {/* p category */}
                        <div className={inputs.type == TransactionType.EXPENSE || inputs.type == TransactionType.INCOME || inputs.type == TransactionType.PURCHASE ? `my-3` : `my-3 hidden`}>
                           <label className="text-text-light-primary dark:text-text-dark-primary font-bold">Category:</label>
                           <select
                              className="w-full p-3 my-3 border border-border-light-primary dark:border-border-dark-primary rounded-md bg-bg-light-primary dark:bg-bg-dark-primary text-text-light-primary dark:text-text-dark-primary focus:border-primary text-sm disabled:opacity-50"
                              value={inputs.pcategory || ""}
                              name={"pcategory"}
                              onChange={onInputChange}
                              disabled={inputs.type === TransactionType.INCOME}
                           >
                              {
                                 inputs.type === TransactionType.INCOME ? (
                                    categories
                                       .filter((c) => c.parentCategory === "Income")
                                       .map((c) => {
                                          return (
                                             <option key={c._id} value={c._id}>
                                                {c.parentCategory}
                                             </option>
                                          );
                                       })
                                 ) : (
                                    <>
                                       <option value={""}>Select category</option>
                                       {
                                          categories
                                             .filter(
                                                (c) =>
                                                   c.parentCategory !== "Income" &&
                                                   c.parentCategory !== "loan"
                                             )
                                             .map((c) => {
                                                return (
                                                   <option key={c._id} value={c._id}>
                                                      {c.parentCategory}
                                                   </option>
                                                );
                                             })
                                       }
                                    </>
                                 )
                              }
                           </select>
                        </div>

                        {/* sub category */}
                        <div className={(inputs.type == TransactionType.EXPENSE || inputs.type == TransactionType.INCOME || inputs.type == TransactionType.PURCHASE) && inputs.pcategory != null ? `my-3` : `my-3 hidden`}>
                           <label className="text-text-light-primary dark:text-text-dark-primary font-bold">Sub Category:</label>
                           <select
                              className="w-full p-3 my-3 border border-border-light-primary dark:border-border-dark-primary rounded-md bg-bg-light-primary dark:bg-bg-dark-primary text-text-light-primary dark:text-text-dark-primary focus:border-primary text-sm disabled:opacity-50"
                              value={inputs.scategory || ""}
                              name="scategory"
                              onChange={onInputChange}
                           >
                              <option value={""}>
                                 Select sub category
                              </option>
                              {
                                 categories.find(cat => cat._id === inputs.pcategory)?.subCategories.map(c => {
                                    return (
                                       <option value={c._id}>
                                          {c.name}
                                       </option>
                                    )
                                 })
                              }
                           </select>
                        </div>

                        {/* amount */}
                        <div className={inputs.type != "" ? `my-3` : `my-3 hidden`}>
                           <label className="text-text-light-primary dark:text-text-dark-primary font-bold">Amount:</label>
                           <Input
                              name="amount"
                              type="number"
                              placeholder="Enter amount"
                              value={inputs.amount.toString()}
                              onChange={onInputChange}
                              className="mt-1 mb-1"
                           />
                        </div>

                        {/* frequency */}
                        <div className={inputs.type != "" ? `my-3` : `my-3 hidden`}>
                           <label className="text-text-light-primary dark:text-text-dark-primary font-bold">Frequency:</label>
                           <select
                              className="w-full p-3 my-3 border border-border-light-primary dark:border-border-dark-primary rounded-md bg-bg-light-primary dark:bg-bg-dark-primary text-text-light-primary dark:text-text-dark-primary focus:border-primary text-sm disabled:opacity-50"
                              value={inputs.frequency || ""}
                              name="frequency"
                              onChange={onInputChange}
                           >
                              <option value="">Select frequency</option>
                              {
                                 Object.values(Frequency).map(freq => {
                                    return (
                                       <option value={freq} className="capitalize">
                                          {freq.split("_").join(" ")}
                                       </option>
                                    )
                                 })
                              }
                           </select>
                        </div>

                        {/* date */}
                        <div className={inputs.type != "" ? `my-3` : `my-3 hidden`}>
                           <label className="text-text-light-primary dark:text-text-dark-primary font-bold">{inputs.frequency === Frequency.RECURRENT ? (editId ? "Next due date" : "Start date") : "Date"} :</label>
                           <Input
                              name="startDate"
                              type="date"
                              placeholder="Enter date"
                              value={inputs.startDate.toString()}
                              onChange={onInputChange}
                              className="mt-1 mb-1"
                              id="startDate"
                              min={getTodayDate()}
                           />
                        </div>

                        {/* repeat */}
                        <div className={inputs.type != "" && inputs.frequency === Frequency.RECURRENT ? `my-3` : `my-3 hidden`}>
                           <label className="text-text-light-primary dark:text-text-dark-primary font-bold">Repeat:</label>
                           <div className="flex items-center gap-2">
                              <div className="text-text-light-primary dark:text-text-dark-primary w-full">For every</div>
                              <Input
                                 name="interval"
                                 type="number"
                                 placeholder="Enter interval"
                                 value={inputs.interval.toString()}
                                 onChange={onInputChange}
                                 className="mt-1 mb-1"
                              />
                              <select
                                 className="w-full p-3 my-3 border border-border-light-primary dark:border-border-dark-primary rounded-md bg-bg-light-primary dark:bg-bg-dark-primary text-text-light-primary dark:text-text-dark-primary focus:border-primary text-sm disabled:opacity-50"
                                 value={inputs.repeat || ""}
                                 name="repeat"
                                 onChange={onInputChange}
                              >
                                 {
                                    Object.values(Repeat).map(repeat => {
                                       return (
                                          <option value={repeat} className="capitalize">
                                             {repeat.split("_").join(" ") + (inputs.interval > 1 ? "S" : "")}
                                          </option>
                                       )
                                    })
                                 }
                              </select>
                           </div>
                        </div>

                        {/* Recurring Approval */}
                        <div className={inputs.type != ""  ? `my-3` : `my-3 hidden`}>
                           <label className="text-text-light-primary dark:text-text-dark-primary font-bold">Do you want to create schedules automatically for future schedules?:</label>
                           <div className="mt-2 flex gap-2 items-center justify-start">
                              <input
                                 name="recurringApproval"
                                 type="radio"
                                 placeholder=""
                                 checked={inputs.recurringApproval === RecurringApproval.AUTO}
                                 value={RecurringApproval.AUTO}
                                 onChange={onInputChange}
                                 className="mt-1 mb-1 w-fit"
                                 id={RecurringApproval.AUTO}
                              />
                              <label htmlFor={RecurringApproval.AUTO} className="text-text-light-secondary dark:text-text-dark-secondary">Yes (Upcoming schedules will be converted to schedules automatically.)</label>
                           </div>
                           <div className="flex gap-2 items-center justify-start">
                              <input
                                 name="recurringApproval"
                                 type="radio"
                                 placeholder=""
                                 checked={inputs.recurringApproval === RecurringApproval.MANUAL}
                                 value={RecurringApproval.MANUAL}
                                 onChange={onInputChange}
                                 className="mt-1 mb-1 w-fit"
                                 id={RecurringApproval.MANUAL}
                              />
                              <label htmlFor={RecurringApproval.MANUAL} className="text-text-light-secondary dark:text-text-dark-secondary">No (Upcoming schedules will will wait for your approving.)</label>
                           </div>
                        </div>

                        {/* continue */}
                        <div className={inputs.type != "" && inputs.frequency === Frequency.RECURRENT ? `my-3` : `my-3 hidden`}>
                           <label className="text-text-light-primary dark:text-text-dark-primary font-bold">Continue till:</label>
                           <select
                              className="w-full p-3 my-3 border border-border-light-primary dark:border-border-dark-primary rounded-md bg-bg-light-primary dark:bg-bg-dark-primary text-text-light-primary dark:text-text-dark-primary focus:border-primary text-sm disabled:opacity-50"
                              value={inputs.continue || ""}
                              name="continue"
                              onChange={onInputChange}
                           >
                              {
                                 Object.values(ContinueType).map(freq => {
                                    return (
                                       <option value={freq} className="capitalize">
                                          {freq.split("_").join(" ")}
                                       </option>
                                    )
                                 })
                              }
                           </select>
                        </div>

                        {/* endDate */}
                        <div className={inputs.type != "" && inputs.frequency === Frequency.RECURRENT && inputs.continue === ContinueType.UNTIL_A_DATE ? `my-3` : `my-3 hidden`}>
                           <label className="text-text-light-primary dark:text-text-dark-primary font-bold">End date:</label>
                           <Input
                              name="endDate"
                              type="date"
                              placeholder="Enter date"
                              value={inputs.endDate?.toString() || ""}
                              onChange={onInputChange}
                              className="mt-1 mb-1"
                              id="endDate"
                              min={inputs.startDate}
                           />
                        </div>

                        {/* note */}
                        <div className={inputs.type != "" ? `my-3` : `my-3 hidden`}>
                           <label className="text-text-light-primary dark:text-text-dark-primary font-bold">Note(*) :</label>
                           <Input
                              name="note"
                              type="text"
                              placeholder="Enter Note (optional)"
                              value={inputs.note.toString()}
                              onChange={onInputChange}
                              className="mt-1 mb-1"
                           />
                        </div>
                     </form>
                     <div className="flex shrink-0 flex-wrap items-center pt-4 justify-end">
                        <Button
                           text="Cancel"
                           className="max-w-fit"
                           priority="secondary"
                           onClick={onCancel}
                        />
                        <Button
                           text={editId ? "Save" : "Create"}
                           className="max-w-fit ml-3"
                           onClick={onNewOrEditSubmit}
                        />
                     </div>
                  </div>
               </div>
            )
         }

         {/* View Transaction */}
         {
            viewMode && (
               <div
                  className="fixed top-0 left-0 w-screen h-screen z-[999] grid place-items-center bg-opacity-50 overflow-auto p-4 modal-bg pt-10"
               >
                  <div
                     className="relative w-full max-w-lg rounded-lg bg-bg-light-secondary dark:bg-bg-dark-secondary shadow-sm p-3"
                  >
                     <div className="flex justify-between shrink-0 items-center pb-4 text-xl font-medium text-text-light-primary dark:text-text-dark-primary">
                        View Transaction
                        <div className="flex gap-2">
                           {
                              canEditSchedule && (
                                 <>
                                    <Button
                                       text={<FaEdit />}
                                       onClick={onNewOrEditMode}
                                       className="max-w-fit pt-2 pb-2"
                                    />

                                 </>
                              )
                           }
                           <Button
                              text={<FaTrash />}
                              onClick={onDelete}
                              className="max-w-fit pt-2 pb-2 hover:!bg-red-600 !bg-red-500"
                           />
                           <Button
                              text={<FaTimes />}
                              onClick={onCancel}
                              className="max-w-fit pt-2 pb-2 !bg-transparent border border-border-light-primary dark:border-border-dark-primary hover:!bg-border-light-primary dark:hover:!bg-border-dark-primary"
                           />
                        </div>
                     </div>
                     <form className="border-t border-border-light-primary dark:border-border-dark-primary" onSubmit={onSubmit}>
                        {!canEditSchedule && <div className="w-full text-text-light-primary dark:text-text-dark-primary flex p-1 items-center border border-yellow-700 gap-3 rounded *:text-xs"> <FaInfoCircle /> This schedule is closed.</div>}

                        {/* type */}
                        <div className="my-3">
                           <label className="text-text-light-primary dark:text-text-dark-primary font-bold">Type:</label>
                           <select
                              className="w-full p-3 my-3 border border-border-light-primary dark:border-border-dark-primary rounded-md bg-bg-light-primary dark:bg-bg-dark-primary text-text-light-primary dark:text-text-dark-primary focus:border-primary text-sm disabled:opacity-50"
                              value={inputs.type}
                              name="type"
                              disabled={true}
                           >
                              {
                                 Object.values(TransactionType).map((t) => {
                                    return (
                                       <option value={t} key={t}>
                                          {t.split("_").join(" ")}
                                       </option>
                                    )
                                 })
                              }

                           </select>
                        </div>

                        {/* from */}
                        <div className={inputs.type != "" ? `my-3` : `my-3 hidden`}>
                           <label className="text-text-light-primary dark:text-text-dark-primary font-bold">From space:</label>
                           <select
                              className="w-full p-3 my-3 border border-border-light-primary dark:border-border-dark-primary rounded-md bg-bg-light-primary dark:bg-bg-dark-primary text-text-light-primary dark:text-text-dark-primary focus:border-primary text-sm disabled:opacity-50 *:capitalize capitalize"
                              value={inputs.from || ""}
                              name="from"
                              disabled={true}
                           >
                              {
                                 spaces.map((s) => {
                                    return (
                                       <option value={s.id}>
                                          {s.name.split("_").join(" ")}
                                       </option>
                                    )
                                 })
                              }
                              <option value={""}>
                                 OUTSIDE WALLET
                              </option>
                           </select>
                        </div>

                        {/* to */}
                        <div className={inputs.type != "" ? `my-3` : `my-3 hidden`}>
                           <label className="text-text-light-primary dark:text-text-dark-primary font-bold">To space:</label>
                           <select
                              className="w-full p-3 my-3 border border-border-light-primary dark:border-border-dark-primary rounded-md bg-bg-light-primary dark:bg-bg-dark-primary text-text-light-primary dark:text-text-dark-primary focus:border-primary text-sm *:capitalize capitalize disabled:opacity-50"
                              value={inputs.to || ""}
                              name="to"
                              disabled={true}
                           >
                              {
                                 spaces.map((s) => {
                                    return (
                                       <option value={s.id}>
                                          {s.name.split("_").join(" ").toUpperCase()}
                                       </option>
                                    )
                                 })
                              }
                              <option value="">
                                 OUTSIDE WALLET
                              </option>
                           </select>
                        </div>

                        {/* p category */}
                        <div className={inputs.type == TransactionType.EXPENSE || inputs.type == TransactionType.INCOME || inputs.type == TransactionType.PURCHASE ? `my-3` : `my-3 hidden`}>
                           <label className="text-text-light-primary dark:text-text-dark-primary font-bold">Category:</label>
                           <select
                              className="w-full p-3 my-3 border border-border-light-primary dark:border-border-dark-primary rounded-md bg-bg-light-primary dark:bg-bg-dark-primary text-text-light-primary dark:text-text-dark-primary focus:border-primary text-sm disabled:opacity-50"
                              value={inputs.pcategory || ""}
                              name={"pcategory"}
                              disabled={true}
                           >
                              {categories.map((c) => {
                                 return (
                                    <option key={c._id} value={c._id}>
                                       {c.parentCategory}
                                    </option>
                                 );
                              })
                              }

                           </select>
                        </div>

                        {/* sub category */}
                        <div className={(inputs.type == TransactionType.EXPENSE || inputs.type == TransactionType.INCOME || inputs.type == TransactionType.PURCHASE) && inputs.pcategory != null ? `my-3` : `my-3 hidden`}>
                           <label className="text-text-light-primary dark:text-text-dark-primary font-bold">Sub Category:</label>
                           <select
                              className="w-full p-3 my-3 border border-border-light-primary dark:border-border-dark-primary rounded-md bg-bg-light-primary dark:bg-bg-dark-primary text-text-light-primary dark:text-text-dark-primary focus:border-primary text-sm disabled:opacity-50"
                              value={inputs.scategory || ""}
                              name="scategory"
                              disabled={true}
                           >
                              <option value={""}>
                                 Select sub category
                              </option>
                              {
                                 categories.find(cat => cat._id === inputs.pcategory)?.subCategories.map(c => {
                                    return (
                                       <option value={c._id}>
                                          {c.name}
                                       </option>
                                    )
                                 })
                              }
                           </select>
                        </div>

                        {/* amount */}
                        <div className={inputs.type != "" ? `my-3` : `my-3 hidden`}>
                           <label className="text-text-light-primary dark:text-text-dark-primary font-bold">Amount:</label>
                           <Input
                              name="amount"
                              type="number"
                              placeholder="Enter amount"
                              value={inputs.amount.toString()}
                              onChange={() => { }}
                              className="mt-1 mb-1 disabled:opacity-50"
                              disabled={true}
                           />
                        </div>

                        {/* frequency */}
                        <div className={inputs.type != "" ? `my-3` : `my-3 hidden`}>
                           <label className="text-text-light-primary dark:text-text-dark-primary font-bold">Frequency:</label>
                           <select
                              className="w-full p-3 my-3 border border-border-light-primary dark:border-border-dark-primary rounded-md bg-bg-light-primary dark:bg-bg-dark-primary text-text-light-primary dark:text-text-dark-primary focus:border-primary text-sm disabled:opacity-50"
                              value={inputs.frequency || ""}
                              name="frequency"
                              onChange={onInputChange}
                              disabled={true}
                           >
                              <option value="">Select frequency</option>
                              {
                                 Object.values(Frequency).map(freq => {
                                    return (
                                       <option value={freq} className="capitalize">
                                          {freq.split("_").join(" ")}
                                       </option>
                                    )
                                 })
                              }
                           </select>
                        </div>

                        {/* date */}
                        <div className={inputs.type != "" ? `my-3` : `my-3 hidden`}>
                           <label className="text-text-light-primary dark:text-text-dark-primary font-bold">{inputs.frequency === Frequency.RECURRENT && inputs.isClosed ? "Next Due date" : "Date"} :</label>
                           <Input
                              name="startDate"
                              type="date"
                              placeholder="Enter date"
                              value={inputs.startDate.toString()}
                              onChange={onInputChange}
                              className="mt-1 mb-1 disabled:opacity-50"
                              id="startDate"
                              min={getTodayDate()}
                              disabled={true}
                           />
                        </div>

                        {/* repeat */}
                        <div className={inputs.type != "" && inputs.frequency === Frequency.RECURRENT ? `my-3` : `my-3 hidden`}>
                           <label className="text-text-light-primary dark:text-text-dark-primary font-bold">Repeat:</label>
                           <div className="flex items-center gap-2">
                              <div className="text-text-light-primary dark:text-text-dark-primary w-full">For every</div>
                              <Input
                                 name="interval"
                                 type="number"
                                 placeholder="Enter interval"
                                 value={inputs.interval.toString()}
                                 onChange={onInputChange}
                                 className="mt-1 mb-1 disabled:opacity-50"
                                 disabled={true}
                              />
                              <select
                                 className="w-full p-3 my-3 border border-border-light-primary dark:border-border-dark-primary rounded-md bg-bg-light-primary dark:bg-bg-dark-primary text-text-light-primary dark:text-text-dark-primary focus:border-primary text-sm disabled:opacity-50"
                                 value={inputs.repeat || ""}
                                 name="repeat"
                                 onChange={onInputChange}
                                 disabled={true}
                              >
                                 {
                                    Object.values(Repeat).map(repeat => {
                                       return (
                                          <option value={repeat} className="capitalize">
                                             {repeat.split("_").join(" ") + (inputs.interval > 1 ? "S" : "")}
                                          </option>
                                       )
                                    })
                                 }
                              </select>
                           </div>
                        </div>

                        {/* Recurring Approval */}
                        <div className={inputs.type != "" && inputs.frequency === Frequency.RECURRENT ? `my-3` : `my-3 hidden`}>
                           <label className="text-text-light-primary dark:text-text-dark-primary font-bold">Do you want to create schedules automatically for future schedules?:</label>
                           <div className="mt-2 flex gap-2 items-center justify-start">
                              <input
                                 name="recurringApproval"
                                 type="radio"
                                 placeholder=""
                                 checked={inputs.recurringApproval === RecurringApproval.AUTO}
                                 value={RecurringApproval.AUTO}
                                 onChange={onInputChange}
                                 className="mt-1 mb-1 w-fit"
                                 id={RecurringApproval.AUTO}
                                 disabled={inputs.recurringApproval !== RecurringApproval.AUTO}
                              />
                              <label htmlFor={RecurringApproval.AUTO} className="text-text-light-secondary dark:text-text-dark-secondary">Yes (Upcoming schedules will be converted to schedules automatically.)</label>
                           </div>
                           <div className="flex gap-2 items-center justify-start">
                              <input
                                 name="recurringApproval"
                                 type="radio"
                                 placeholder=""
                                 value={RecurringApproval.MANUAL}
                                 checked={inputs.recurringApproval === RecurringApproval.MANUAL}
                                 onChange={onInputChange}
                                 className="mt-1 mb-1 w-fit"
                                 id={RecurringApproval.MANUAL}
                                 disabled={inputs.recurringApproval !== RecurringApproval.MANUAL}
                              />
                              <label htmlFor={RecurringApproval.MANUAL} className="text-text-light-secondary dark:text-text-dark-secondary">No (Upcoming schedules will will wait for your approving.)</label>
                           </div>
                        </div>

                        {/* continue */}
                        <div className={inputs.type != "" && inputs.frequency === Frequency.RECURRENT ? `my-3` : `my-3 hidden`}>
                           <label className="text-text-light-primary dark:text-text-dark-primary font-bold">Continue till:</label>
                           <select
                              className="w-full p-3 my-3 border border-border-light-primary dark:border-border-dark-primary rounded-md bg-bg-light-primary dark:bg-bg-dark-primary text-text-light-primary dark:text-text-dark-primary focus:border-primary text-sm disabled:opacity-50"
                              value={inputs.continue || ""}
                              name="continue"
                              onChange={onInputChange}
                              disabled={true}
                           >
                              {
                                 Object.values(ContinueType).map(freq => {
                                    return (
                                       <option value={freq} className="capitalize">
                                          {freq.split("_").join(" ")}
                                       </option>
                                    )
                                 })
                              }
                           </select>
                        </div>

                        {/* endDate */}
                        <div className={inputs.type != "" && inputs.frequency === Frequency.RECURRENT && inputs.continue === ContinueType.UNTIL_A_DATE ? `my-3` : `my-3 hidden`}>
                           <label className="text-text-light-primary dark:text-text-dark-primary font-bold">End date:</label>
                           <Input
                              name="endDate"
                              type="date"
                              placeholder="Enter date"
                              value={inputs.endDate?.toString() || ""}
                              onChange={onInputChange}
                              className="mt-1 mb-1"
                              id="endDate"
                              min={inputs.startDate}
                              disabled={true}
                           />
                        </div>

                        {/* note */}
                        <div className={inputs.type != "" ? `my-3` : `my-3 hidden`}>
                           <label className="text-text-light-primary dark:text-text-dark-primary font-bold">Note(*):</label>
                           <Input
                              name="note"
                              type="text"
                              placeholder="Enter note (optional)"
                              value={inputs.note == "" ? "Not provided" : inputs.note}
                              onChange={() => { }}
                              className="mt-1 mb-1 disabled:opacity-50"
                              disabled={true}
                           />
                        </div>
                     </form>
                  </div>
               </div>
            )
         }

         {/* loading */}
         {
            (!loading && schedules?.length == 0) && <h1 className="text-xl text-text-light-primary dark:text-text-dark-primary text-center mt-48">No schedules found!</h1>
         }

         {/* transaction list */}
         <ScheduleList
            schedules={schedules}
            categories={categories}
            onClick={onView}
            onConfirm={onConfirm}
            onSkip={onSkip}
         />
      </>
   )
}

function getTodayDate() {
   const input = new Date();

   const year = input.getFullYear();
   const month = String(input.getMonth() + 1).padStart(2, '0');
   const day = String(input.getDate()).padStart(2, '0');

   const localDate = `${year}-${month}-${day}`;
   return localDate;
}

export default Schedule;