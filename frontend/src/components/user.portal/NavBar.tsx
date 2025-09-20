import { Dispatch, useState } from "react";
import { MenuIcon } from "../icons";
import Logo from "../Logo";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { UserPortalView } from "./SideBar";
import { capitalize, toLocalSpaceType } from "../../utils/utils";
import { useNavigate, useParams } from "react-router-dom";
import DropDown from "../Dropdown";

function NavBar({ setSideBarOpen, isSideBarOpen, view, spaceId, setSpaceFormToggle }: { setSideBarOpen: (isopen: boolean) => void, isSideBarOpen: boolean, view: UserPortalView, spaceId: string, setSpaceFormToggle: Dispatch<React.SetStateAction<boolean>> }) {

   const [isUserMenuOpen, setUserMenuOpen] = useState<boolean>(false)
   const { email, username, spaces } = useSelector((state: RootState) => state.auth)
   // const {spaceid} = useParams();
   const navigate = useNavigate();

   console.log(spaces)

   // const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
   //    const { name, value } = e.target as HTMLInputElement;
   //    if (value === "new") {
   //       setSpaceFormToggle(true)
   //       return
   //    }
   //    const valueParts = value.split("-")
   //    navigate(`/user-portal/${valueParts[1].toLowerCase().split("_").join("-")}/${valueParts[0]}/${view}`);
   // }

   const onInputChange = (text: string) => {
      // const { name, value } = e.target as HTMLInputElement;
      if (text === "New Space") {
         setSpaceFormToggle(true)
         return
      }
      const selectedSpace = spaces.find(sp => sp.name===text)
      if (!selectedSpace) return
      navigate(`/user-portal/${toLocalSpaceType(selectedSpace.type)}/${selectedSpace.id}/${view}`);
   }

   return (
      <nav className="fixed top-0 z-50 w-full bg-bg-light-primary dark:bg-bg-dark-primary border-b border-border-light-primary dark:border-border-dark-primary h-20">
         <div className="px-3 py-3 lg:px-5 lg:pl-3 h-full">
            <div className="flex items-center justify-between h-full">
               <div className="flex items-center justify-start rtl:justify-end w-65">
                  <button
                     type="button"
                     className="inline-flex items-center p-2 text-sm rounded-lg sm:hidden hover:bg-hover-light-primary focus:outline-none focus:ring-2 focus:ring-gray-200 active:ring-hover-light-primary dark:text-gray-400 dark:hover:bg-hover-dark-primary dark:focus:ring-gray-600 dark:active:ring-hover-dark-primary"
                     onClick={() => setSideBarOpen(!isSideBarOpen)}
                  >
                     <MenuIcon />
                  </button>
                  <Logo />
               </div>
               <div className="flex-1 relative">
                  <input
                     className="bg-bg-light-primary dark:bg-bg-dark-primary w-full p-2 rounded border-2 border-border-light-primary dark:border-border-dark-primary text-text-light-primary dark:text-text-dark-primary outline-none focus:border-primary focus:bg-transparent text-sm"
                     placeholder={`Search ${view}`}
                  />
               </div>
               <div className="max-w-sm ml-3">
                  <DropDown
                     title={spaces.find(sp => sp.id === spaceId)?.name || ""}
                     dropdownItems={spaces.map(sp => `${sp.name}`)}
                     lastItem={"New Space"}
                     onClick={(text) => onInputChange(text)}
                  />
               </div>
               <div className="flex items-center relative">
                  <div className="flex items-center ms-3">
                     <div onClick={() => { setUserMenuOpen(!isUserMenuOpen) }}>
                        <button type="button" className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" aria-expanded="false" data-dropdown-toggle="dropdown-user">
                           <span className="sr-only">Open user menu</span>
                           <img className="w-8 h-8 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="user photo" />
                        </button>
                     </div>
                     {
                        isUserMenuOpen && (
                           <div className="absolute top-1/2 right-0 z-50 my-4 text-base list-none bg-bg-light-primary divide-y divide-gray-100 rounded-sm shadow-sm dark:bg-bg-dark-primary dark:divide-gray-600" id="dropdown-user">
                              <div className="px-4 py-3" role="none">
                                 <p className="text-sm text-text-light-primary dark:text-text-dark-primary" role="none">
                                    {username}
                                 </p>
                                 <p className="text-sm font-medium text-text-light-primary dark:text-text-dark-primary truncate" role="none">
                                    {email}
                                 </p>
                              </div>
                           </div>
                        )
                     }
                  </div>
               </div>
            </div>
         </div>
      </nav>
   )
}

export default NavBar;