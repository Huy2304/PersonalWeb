import React, { useState, useEffect } from "react";
import "../AdminLayout.css";

const SettingsPage = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        document.body.className = darkMode ? "dark-mode" : "light-mode";
    }, [darkMode]);

    return (
        <div className="admin-page">
            <h2 className="page-title">Cài đặt</h2>

            <div className="settings-card">
                <p>Chế độ hiển thị: <b>{darkMode ? "Tối" : "Sáng"}</b></p>
                <button
                    className="btn-toggle"
                    onClick={() => setDarkMode(!darkMode)}
                >
                    Đổi sang {darkMode ? "Sáng" : "Tối"}
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;
