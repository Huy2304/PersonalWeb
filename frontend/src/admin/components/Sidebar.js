import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <div style={{ width: '250px', height: '100vh', background: '#333', color: 'white', padding: '20px' }}>
            <h2>Admin Dashboard</h2>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                <li><Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link></li>
                <li><Link to="/admin/users" style={{ color: 'white', textDecoration: 'none' }}>Users</Link></li>
                <li><Link to="/admin/settings" style={{ color: 'white', textDecoration: 'none' }}>Settings</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;
