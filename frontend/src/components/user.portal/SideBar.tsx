import { useDispatch } from "react-redux";
import SideBarItem from "./SideBarItem";
import { logout } from "../../redux/features/auth";
import { useNavigate } from "react-router-dom";

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
   LOGOUT = "log out"
}

function SideBar({isSideBarOpen, view}: {isSideBarOpen: boolean, view:UserPortalView}) {
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
               <SideBarItem name={UserPortalView.DASHBOARD} isActive={view == UserPortalView.DASHBOARD} />
               <SideBarItem name={UserPortalView.TRANSACTIONS} isActive={view == UserPortalView.TRANSACTIONS} />
               <SideBarItem name={UserPortalView.SPACES} isActive={view == UserPortalView.SPACES} />
               <SideBarItem name={UserPortalView.SCHEDULES} isActive={view == UserPortalView.SCHEDULES} />
               <SideBarItem name={UserPortalView.BUDGETS} isActive={view == UserPortalView.BUDGETS} />
               <SideBarItem name={UserPortalView.GOALS} isActive={view == UserPortalView.GOALS} />
               <SideBarItem name={UserPortalView.CATEGORIES} isActive={view == UserPortalView.CATEGORIES} />
               <SideBarItem name={UserPortalView.NOTIFICATIONS} isActive={view == UserPortalView.NOTIFICATIONS} pc={5} />
               <SideBarItem name={UserPortalView.SETTINGS} isActive={view == UserPortalView.SETTINGS} />
               <SideBarItem name={UserPortalView.LOGOUT} isActive={view == UserPortalView.LOGOUT} onClick={onLogout}/>
            </ul>
         </div>
      </aside>
   )
}

export default SideBar;