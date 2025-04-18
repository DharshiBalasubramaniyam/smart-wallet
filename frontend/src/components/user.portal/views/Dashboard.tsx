import { Link } from "react-router-dom";
import { AuthService } from "../../../services/auth/auth.service";
import Button from "../../Button";
import { UserPortalView } from "../SideBar";

function DashBoard() {
   const {protectedRoute} = AuthService()
   return (
      <>
         <h1 className="text-xl text-text-light-primary dark:text-text-dark-primary">Dashboard</h1>
         <Button text="Click me" onClick={protectedRoute}/>
         <Link to={`/user-portal/${UserPortalView.TRANSACTIONS}`}><Button text="go to transactions"/></Link>
      </>
   )
}

export default DashBoard;