import { useState } from "react";
import NavBar from "../../components/user.portal/NavBar";
import SideBar, { UserPortalView } from "../../components/user.portal/SideBar";
import { useNavigate, useParams } from "react-router-dom";
import DashBoard from "../../components/user.portal/views/Dashboard";

function UserPortal() {

   const [isSideBarOpen, setSideBarOpen] = useState<boolean>(false)
   const { view } = useParams()
   const navigate = useNavigate()

   if (!view) {
      navigate("/")
   }

   console.log(view)

   const ViewComponent = () => {
      switch (view) {
         case UserPortalView.DASHBOARD:
            return <DashBoard/>
         default:
            return <h1 className="text-xl text-text-light-primary dark:text-text-dark-primary">Default</h1>
      }
   }

   return (
      <main className="font-main dark bg-bg-light-primary dark:bg-bg-dark-primary">
         <NavBar isSideBarOpen={isSideBarOpen} setSideBarOpen={setSideBarOpen} />
         <SideBar isSideBarOpen={isSideBarOpen} view={view as UserPortalView ?? UserPortalView.DASHBOARD}/>

         <div className="p-4 sm:ml-64">
            <div className="p-4 border-1 border-border-light-primary rounded-lg dark:border-border-dark-primary mt-14 min-h-screen">
               <ViewComponent/>
            </div>
         </div>

      </main>
   )
}

export default UserPortal;

