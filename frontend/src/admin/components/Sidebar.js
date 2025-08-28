import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    FaTachometerAlt,
    FaUsers,
    FaCog,
    FaCheckCircle,
    FaBlog,
    FaBars
} from "react-icons/fa";
import "../AdminLayout.css";

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
            <div className="sidebar-header">
                {!collapsed && <h2>Menu</h2>}
                <button
                    className="collapse-btn"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <FaBars />
                </button>
            </div>

            <nav className="admin-nav">
                <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) =>
                        `admin-link ${isActive ? 'active' : ''}`
                    }
                >
                    <FaTachometerAlt className="icon" />
                    {!collapsed && <span>Dashboard</span>}
                </NavLink>
                <NavLink
                    to="/admin/users"
                    className={({ isActive }) =>
                        `admin-link ${isActive ? 'active' : ''}`
                    }
                >
                    <FaUsers className="icon" />
                    {!collapsed && <span>Users</span>}
                </NavLink>
                <NavLink
                    to="/admin/settings"
                    className={({ isActive }) =>
                        `admin-link ${isActive ? 'active' : ''}`
                    }
                >
                    <FaCog className="icon" />
                    {!collapsed && <span>Settings</span>}
                </NavLink>
                <NavLink
                    to="/admin/check"
                    className={({ isActive }) =>
                        `admin-link ${isActive ? 'active' : ''}`
                    }
                >
                    <FaCheckCircle className="icon" />
                    {!collapsed && <span>Check</span>}
                </NavLink>
                <NavLink
                    to="/admin/blog"
                    className={({ isActive }) =>
                        `admin-link ${isActive ? 'active' : ''}`
                    }
                >
                    <FaBlog className="icon" />
                    {!collapsed && <span>Blog</span>}
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;
