import { DashBoardIcon } from "../icons";

function SideBarItem({ name, pc, onClick, isActive }: { name: string, pc?: number, onClick?: () => void, isActive: boolean }) {
   return (
      <li className="mb-3" onClick={onClick}>
         <a href="#" className={`flex items-center p-2 text-text-light-primary rounded-lg dark:text-text-dark-primary hover:bg-hover-light-primary dark:hover:bg-hover-dark-primary group transition ${isActive ? "bg-primary" : ""}`}>
            <DashBoardIcon />
            <span className="flex-1 ms-3 capitalize">{name}</span>
            {
               pc && <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-text-light-primary bg-primary rounded-full dark:bg-primary dark:text-text-dark-primary">3</span>
            }
         </a>
      </li>
   )
}

export default SideBarItem;