import { BrowserRouter } from "react-router-dom"
import AppContainer from "./routes/routes"
import { ToastContainer } from 'react-toastify';

function App() {

  return (
    <BrowserRouter>
      <AppContainer />
      <ToastContainer theme="dark"/>
    </BrowserRouter>
  )
}

export default App
