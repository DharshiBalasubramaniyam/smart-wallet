import { useDispatch } from "react-redux";
import SideBarItem from "./SideBarItem";
import { logout } from "../../redux/features/auth";
import { useNavigate } from "react-router-dom";
import SidebarDropdownItem from "./SideBarDropDownItem";
import { BudgetIcon, CategoryIcon, DashBoardIcon, GoalIcon, LogoutIcon, NotificationIcon, ScheduleIcon, SettingsIcon, SpaceIcon, TransactionIcon } from "../icons";

export enum UserPortalView {
   DASHBOARD = "dashboard",
   TRANSACTIONS = "transactions",
   SPACES = "spaces",
   SCHEDULES = "schedules",
   BUDGETS = "budgets",
   GOALS = "goals",
   CATEGORIES = "categories",
   NOTIFICATIONS = "notifications",
   SETTINGS = "settings",
   SETTINGS_PROFILE = "profile",
   SETTINGS_BILLING = "billing",
   LOGOUT = "log out"
}

function SideBar({ isSideBarOpen, view }: { isSideBarOpen: boolean, view: UserPortalView }) {
   const sideBarStyleSM = isSideBarOpen ? "" : "-translate-x-full"

   const dispatch = useDispatch()
   const navigate = useNavigate()

   const onLogout = () => {
      dispatch(logout())
      navigate("/")
   }

   return (
      <aside id="logo-sidebar" className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${sideBarStyleSM} bg-bg-light-primary border-r border-border-light-primary dark:bg-bg-dark-primary dark:border-border-dark-primary sm:translate-x-0`} aria-label="Sidebar">
         <div className="h-full px-3 pb-4 overflow-y-auto bg-bg-light-primary dark:bg-bg-dark-primary">
            <ul className="space-y-2 font-medium">
               <SideBarItem name={UserPortalView.DASHBOARD} isActive={view == UserPortalView.DASHBOARD} Icon={DashBoardIcon} />
               <SideBarItem name={UserPortalView.TRANSACTIONS} isActive={view == UserPortalView.TRANSACTIONS} Icon={TransactionIcon} />
               <SideBarItem name={UserPortalView.SPACES} isActive={view == UserPortalView.SPACES} Icon={SpaceIcon} />
               <SideBarItem name={UserPortalView.SCHEDULES} isActive={view == UserPortalView.SCHEDULES} Icon={ScheduleIcon} />
               <SideBarItem name={UserPortalView.BUDGETS} isActive={view == UserPortalView.BUDGETS} Icon={BudgetIcon} />
               <SideBarItem name={UserPortalView.GOALS} isActive={view == UserPortalView.GOALS} Icon={GoalIcon} />
               <SideBarItem name={UserPortalView.CATEGORIES} isActive={view == UserPortalView.CATEGORIES} Icon={CategoryIcon} />
               <SideBarItem name={UserPortalView.NOTIFICATIONS} isActive={view == UserPortalView.NOTIFICATIONS} pc={5} Icon={NotificationIcon} />
               <SidebarDropdownItem name={UserPortalView.SETTINGS} Icon={SettingsIcon}>
                  <SideBarItem name={UserPortalView.SETTINGS_PROFILE} isActive={view == UserPortalView.SETTINGS_PROFILE} />
                  <SideBarItem name={UserPortalView.SETTINGS_BILLING} isActive={view == UserPortalView.SETTINGS_BILLING} />
               </SidebarDropdownItem>
               <SideBarItem name={UserPortalView.LOGOUT} isActive={view == UserPortalView.LOGOUT} onClick={onLogout} Icon={LogoutIcon} />
            </ul>
         </div>
      </aside>
   )
}

export default SideBar;