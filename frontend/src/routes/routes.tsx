import React from "react";
import { Routes, Route,  } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import OTPVerification from "../pages/auth/OTPVerification";
import Plans from "../pages/Plans";
import Currency from "../pages/auth/Currency";
import RegisterSuccess from "../pages/auth/RegisterSuccess";

function AppContainer() {

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<OTPVerification />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/currency" element={<Currency />} />
            <Route path="/register-success" element={<RegisterSuccess />} />
        </Routes>
    )
}

export default AppContainer;
