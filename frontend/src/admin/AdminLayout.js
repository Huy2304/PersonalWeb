import React, {useState} from "react";
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
    const [collapsed, setCollapsed] = useState(false);

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
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            <div className="admin-content">
                <Navbar collapsed={collapsed} />
                <main className="admin-main">
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
