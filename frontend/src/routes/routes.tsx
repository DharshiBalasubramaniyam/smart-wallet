import React from "react";
import { Routes, Route,  } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import OTPVerification from "../pages/auth/OTPVerification";
import Plans from "../pages/Plans";

function AppContainer() {

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<OTPVerification />} />
            <Route path="/plans" element={<Plans />} />
        </Routes>
    )
}

export default AppContainer;
