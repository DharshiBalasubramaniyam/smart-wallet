import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../redux/store/store"
import Button from "../components/Button"
import { Link } from "react-router-dom"
import { logout } from "../redux/features/auth"

function Home() {

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const username = useSelector((state: RootState) => state.auth.username)
  const dispatch = useDispatch()

  function onLogout(): void {
    dispatch(logout())
  }

  return (
      isAuthenticated ? (
        <>
          <h1>Welcome {username}</h1>
          <Button text="Logout" onClick={onLogout}></Button>
        </>
      ) : (
        <Link to="/login"><Button text="Login" /></Link>
        
      )
  )
}

export default Home
