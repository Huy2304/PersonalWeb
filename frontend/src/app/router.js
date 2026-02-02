import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout'; // Optional, if you want nested admin layout
import RequireRole from '../auth/RequireRole';
import { ROLES } from '../auth/roles';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

// Post Pages
import PostList from '../pages/posts/PostList';
import CreatePost from '../pages/posts/CreatePost';
import EditPost from '../pages/posts/EditPost';
import DraftPosts from '../pages/posts/DraftPosts';

// User Pages
import Profile from '../pages/user/Profile';

// Admin Pages
import Dashboard from '../pages/admin/Dashboard';
import UsersPage from '../pages/admin/UsersPage';
import BlogAdmin from '../pages/admin/BlogAdmin';
import SettingPage from '../pages/admin/SettingPage';
import LogsPage from '../pages/admin/LogsPage';

// Common Pages
import Forbidden from '../pages/common/Forbidden';
import NotFound from '../pages/common/NotFound';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            // Public Routes
            { index: true, element: <PostList /> },
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
            { path: 'forgot-password', element: <ForgotPassword /> },
            { path: 'reset-password/:token', element: <ResetPassword /> },
            { path: 'forbidden', element: <Forbidden /> },

            // User Routes
            {
                element: <RequireRole allowedRoles={[ROLES.USER, ROLES.ADMIN]} />,
                children: [
                    { path: 'create-post', element: <CreatePost /> },
                    { path: 'edit-post/:id', element: <EditPost /> },
                    { path: 'drafts', element: <DraftPosts /> },
                    { path: 'profile', element: <Profile /> },
                ]
            },

            // Admin Routes
            {
                path: 'admin',
                element: <RequireRole allowedRoles={[ROLES.ADMIN]} />,
                children: [
                    {
                        element: <AdminLayout />, // Nested layout for admin sidebar etc
                        children: [
                            { index: true, element: <Dashboard /> },
                            { path: 'users', element: <UsersPage /> },
                            { path: 'blogs', element: <BlogAdmin /> },
                            { path: 'settings', element: <SettingPage /> },
                            { path: 'logs', element: <LogsPage /> },
                        ]
                    }
                ]
            },

            // 404
            { path: '*', element: <NotFound /> }
        ]
    }
]);

export default router;
