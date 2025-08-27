import React from "react";
import { Outlet } from "react-router-dom";
import "./AdminLayout.css";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

const AdminLayout = () => {
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

export default AdminLayout;
