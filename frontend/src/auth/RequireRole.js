import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ROLES } from './roles';

const RequireRole = ({ allowedRoles }) => {
    const { user } = useAuth();
    const location = useLocation();

    const role = user?.role || ROLES.GUEST; // Assume 'guest' if no user

    if (allowedRoles.includes(role)) {
        return <Outlet />;
    }

    // Handle redirections
    if (user) {
        // User is logged in but doesn't have permission
        return <Navigate to="/forbidden" state={{ from: location }} replace />;
    } else {
        // User is not logged in and asks for protected route
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
};

export default RequireRole;
