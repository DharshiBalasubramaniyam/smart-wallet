import { useState } from "react";
import { MenuIcon } from "../icons";
import Logo from "../Logo";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

function NavBar({ setSideBarOpen, isSideBarOpen }: { setSideBarOpen: (isopen: boolean) => void, isSideBarOpen:boolean }) {

   const [isUserMenuOpen, setUserMenuOpen] = useState<boolean>(false)
   const {email, username} = useSelector((state: RootState) => state.auth)

   return (
      <nav className="fixed top-0 z-50 w-full bg-bg-light-primary dark:bg-bg-dark-primary border-b border-border-light-primary dark:border-border-dark-primary">
         <div className="px-3 py-3 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
               <div className="flex items-center justify-start rtl:justify-end">
                  <button
                     type="button"
                     className="inline-flex items-center p-2 text-sm rounded-lg sm:hidden hover:bg-hover-light-primary focus:outline-none focus:ring-2 focus:ring-gray-200 active:ring-hover-light-primary dark:text-gray-400 dark:hover:bg-hover-dark-primary dark:focus:ring-gray-600 dark:active:ring-hover-dark-primary"
                     onClick={() => setSideBarOpen(!isSideBarOpen)}
                  >
                     <MenuIcon />
                  </button>
                  <Logo/>
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
                              {/* <ul className="py-1" role="none">
                                 <li>
                                    <a href="#" className="block px-4 py-2 text-sm text-text-light-primary hover:bg-hover-light-primary dark:text-text-dark-primary dark:hover:bg-hover-dark-primary dark:hover:text-text-dark-primary" role="menuitem">Dashboard</a>
                                 </li>
                                 <li>
                                    <a href="#" className="block px-4 py-2 text-sm text-text-light-primary hover:bg-hover-light-primary dark:text-text-dark-primary dark:hover:bg-hover-dark-primary dark:hover:text-text-dark-primary" role="menuitem">Settings</a>
                                 </li>
                                 <li>
                                    <a href="#" className="block px-4 py-2 text-sm text-text-light-primary hover:bg-hover-light-primary dark:text-text-dark-primary dark:hover:bg-hover-dark-primary dark:hover:text-text-dark-primary" role="menuitem">Earnings</a>
                                 </li>
                                 <li>
                                    <a href="#" className="block px-4 py-2 text-sm text-text-light-primary hover:bg-hover-light-primary dark:text-text-dark-primary dark:hover:bg-hover-dark-primary dark:hover:text-text-dark-primary" role="menuitem">Sign out</a>
                                 </li>
                              </ul> */}
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