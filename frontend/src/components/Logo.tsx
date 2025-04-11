import { Link } from "react-router-dom";

function Logo() {
   return (
      <Link to="/" className="flex ms-2 md:me-24">
         <img src="https://flowbite.com/docs/images/logo.svg" className="h-8 me-3" alt="FlowBite Logo" />
         <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">SmartWallet</span>
      </Link>
   )
}

export default Logo;