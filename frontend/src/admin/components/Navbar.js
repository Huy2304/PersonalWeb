import React from "react";
import "../AdminLayout.css";

const Navbar = () => {
    return (
        <header className="admin-navbar">
            <button className="bell">🔔</button>
            <div className="admin-user">
                <img
                    src="https://i.pravatar.cc/40"
                    alt="avatar"
                    className="avatar"
                />
                <span>Admin</span>
            </div>
        </header>
    );
};

export default Navbar;
