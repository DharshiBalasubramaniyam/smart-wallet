import { Routes, Route,  } from "react-router-dom";
import Home from "../pages/Home";

function AppContainer() {

    return (
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
    )
}

export default AppContainer;
