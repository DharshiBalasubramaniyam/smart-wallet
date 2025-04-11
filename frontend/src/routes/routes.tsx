import React from "react";
import { Routes, Route, } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import OTPVerification from "../pages/auth/OTPVerification";
import Plans from "../pages/Plans";
import Currency from "../pages/auth/Currency";
import RegisterSuccess from "../pages/auth/RegisterSuccess";
import UserPortal from "../pages/protected/UserPortal";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { Navigate } from "react-router-dom";

function AppContainer() {

    function ProtectedRoute({ children }: { children: React.ReactNode }) {
        const { isAuthenticated } = useSelector((state: RootState) => state.auth);

        if (!isAuthenticated) {
            return <Navigate to="/" />;
        }

        return <>{children}</>;
    }

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<OTPVerification />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/currency" element={<Currency />} />
            <Route path="/register-success" element={<RegisterSuccess />} />
            <Route
                path="/user-portal/:view"
                element={
                    <ProtectedRoute>
                        <UserPortal />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default AppContainer;
