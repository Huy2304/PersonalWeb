import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    FaTachometerAlt,
    FaUsers,
    FaCog,
    FaCheckCircle,
    FaBlog
} from "react-icons/fa";
import "../AdminLayout.css";

const Sidebar = () => {
    const [openSidebar, setOpenSidebar] = useState(true);

    return (
        <>
            {/* Nút toggle */}
            <button
                className="sidebar-toggle"
                onClick={() => setOpenSidebar(!openSidebar)}
            >
                {openSidebar ? "❮" : "❯"}
            </button>

            {/* Sidebar */}
            <aside className={`admin-sidebar ${openSidebar ? "open" : "collapsed"}`}>
                {openSidebar && <h2>Admin</h2>}
                <nav className="admin-nav">
                    <Link to="/admin" className="admin-link">
                        <FaTachometerAlt className="icon" />
                        {openSidebar && <span>Dashboard</span>}
                    </Link>
                    <Link to="/admin/users" className="admin-link">
                        <FaUsers className="icon" />
                        {openSidebar && <span>Users</span>}
                    </Link>
                    <Link to="/admin/settings" className="admin-link">
                        <FaCog className="icon" />
                        {openSidebar && <span>Settings</span>}
                    </Link>
                    <Link to="/admin/check" className="admin-link">
                        <FaCheckCircle className="icon" />
                        {openSidebar && <span>Check</span>}
                    </Link>
                    <Link to="/admin/blog" className="admin-link">
                        <FaBlog className="icon" />
                        {openSidebar && <span>Blog</span>}
                    </Link>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
