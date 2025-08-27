import React from "react";
import { Outlet } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import "./AdminLayout.css";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./context/ThemeContext";
import { AdminAuthProvider, useAdminAuth } from "./context/AdminAuthContext";
import AdminLogin from "./components/AdminLogin";

const AdminContent = () => {
    const { isAuthenticated, loading, login } = useAdminAuth();

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
            >
                <CircularProgress size={60} sx={{ color: 'white' }} />
            </Box>
        );
    }

    if (!isAuthenticated()) {
        return <AdminLogin onLoginSuccess={login} />;
    }

    return (
        <div className="admin-container">
            {/* Sidebar bên trái */}
            <Sidebar />

            {/* Phần bên phải: Navbar + Content */}
            <div className="admin-content">
                <Navbar />
                <main className="admin-main">
                    {/* Đây là nơi hiển thị các trang con (Dashboard, Users, Settings) */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

const AdminLayout = () => {
    return (
        <AdminAuthProvider>
            <ThemeProvider>
                <AdminContent />
            </ThemeProvider>
        </AdminAuthProvider>
    );
};

export default AdminLayout;
