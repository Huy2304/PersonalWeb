import React from "react";
import { NavLink } from "react-router-dom";
import {
    FaTachometerAlt,
    FaUsers,
    FaCog,
    FaCheckCircle,
    FaBlog
} from "react-icons/fa";
import "../AdminLayout.css";

const Sidebar = () => {
    return (
        <aside className="admin-sidebar">
            <h2>Admin</h2>
            <nav className="admin-nav">
                <NavLink 
                    to="/admin" 
                    end
                    className={({ isActive }) => 
                        `admin-link ${isActive ? 'active' : ''}`
                    }
                >
                    <FaTachometerAlt className="icon" />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink 
                    to="/admin/users" 
                    className={({ isActive }) => 
                        `admin-link ${isActive ? 'active' : ''}`
                    }
                >
                    <FaUsers className="icon" />
                    <span>Users</span>
                </NavLink>
                <NavLink 
                    to="/admin/settings" 
                    className={({ isActive }) => 
                        `admin-link ${isActive ? 'active' : ''}`
                    }
                >
                    <FaCog className="icon" />
                    <span>Settings</span>
                </NavLink>
                <NavLink 
                    to="/admin/check" 
                    className={({ isActive }) => 
                        `admin-link ${isActive ? 'active' : ''}`
                    }
                >
                    <FaCheckCircle className="icon" />
                    <span>Check</span>
                </NavLink>
                <NavLink 
                    to="/admin/blog" 
                    className={({ isActive }) => 
                        `admin-link ${isActive ? 'active' : ''}`
                    }
                >
                    <FaBlog className="icon" />
                    <span>Blog</span>
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;
