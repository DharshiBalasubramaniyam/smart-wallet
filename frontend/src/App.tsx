import { BrowserRouter } from "react-router-dom"
import AppContainer from "./routes/routes"
import { ToastContainer } from 'react-toastify';
import { Provider } from "react-redux";
import store from "./redux/store/store";

function App() {

  return (
    <BrowserRouter>
      <Provider store={store}>
        <AppContainer />
        <ToastContainer theme="dark" />
      </Provider>
    </BrowserRouter>
  )
}

export default App
