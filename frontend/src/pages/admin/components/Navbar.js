import React, { useState, useEffect } from "react";
import "../AdminLayout.css";
import { useTheme } from "../context/ThemeContext";
import { useAdminAuth } from "../context/AdminAuthContext";

const Navbar = ({ collapsed }) => { // ✅ nhận collapsed từ AdminLayout
    const { darkMode, toggleTheme } = useTheme();
    const { adminUser, logout } = useAdminAuth();

    const [show, setShow] = useState(true);
    const [lastScroll, setLastScroll] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;

            if (currentScroll > lastScroll && currentScroll > 60) {
                // cuộn xuống → ẩn
                setShow(false);
            } else {
                // cuộn lên → hiện
                setShow(true);
            }

            setLastScroll(currentScroll);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScroll]);

    const handleLogout = () => {
        if (window.confirm("Bạn có chắc muốn đăng xuất khỏi admin panel?")) {
            logout();
        }
    };

    return (
        <header className={`admin-navbar ${show ? "show" : "hide"} ${collapsed ? "collapsed" : ""}`}>
            <div className="navbar-left">
                <h3>Admin Panel</h3>
            </div>
            <div className="navbar-right">
                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    title={`Chuyển sang chế độ ${darkMode ? "sáng" : "tối"}`}
                >
                    {darkMode ? "☀️" : "🌙"}
                </button>
                <button className="bell">🔔</button>
                <div className="admin-user">
                    <img
                        src="https://i.pravatar.cc/40"
                        alt="avatar"
                        className="avatar"
                    />
                    <span>{adminUser?.email || "Admin"}</span>
                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                        title="Đăng xuất"
                        style={{
                            marginLeft: "10px",
                            padding: "5px 10px",
                            background: "#ff4757",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "12px",
                        }}
                    >
                        Đăng xuất
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
