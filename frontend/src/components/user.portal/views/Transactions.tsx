import { AuthService } from "../../../services/auth/auth.service";
import Button from "../../Button";

function Transactions() {
   const {protectedRoute} = AuthService()
   return (
      <>
         <h1 className="text-xl text-text-light-primary dark:text-text-dark-primary">Transactions</h1>
         <Button text="Click me" onClick={protectedRoute}/>
      </>
   )
}

export default Transactions;