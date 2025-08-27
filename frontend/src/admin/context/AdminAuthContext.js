import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    }
    return context;
};

export const AdminAuthProvider = ({ children }) => {
    const [adminUser, setAdminUser] = useState(null);
    const [adminToken, setAdminToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Kiểm tra admin đã đăng nhập chưa khi app khởi động
    useEffect(() => {
        const checkAdminAuth = () => {
            try {
                const savedToken = localStorage.getItem('adminToken');
                const savedUser = localStorage.getItem('adminUser');

                if (savedToken && savedUser) {
                    const user = JSON.parse(savedUser);
                    // Kiểm tra token còn hạn không
                    if (isTokenValid(savedToken) && user.role === 'admin') {
                        setAdminToken(savedToken);
                        setAdminUser(user);
                    } else {
                        // Token hết hạn hoặc không hợp lệ
                        logout();
                    }
                }
            } catch (error) {
                console.error('Error checking admin auth:', error);
                logout();
            } finally {
                setLoading(false);
            }
        };

        checkAdminAuth();
    }, []);

    const isTokenValid = (token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp > currentTime;
        } catch (error) {
            return false;
        }
    };

    const login = (user, token) => {
        if (user.role !== 'admin') {
            throw new Error('Tài khoản không có quyền admin');
        }
        
        setAdminUser(user);
        setAdminToken(token);
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(user));
    };

    const logout = () => {
        setAdminUser(null);
        setAdminToken(null);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
    };

    const isAuthenticated = () => {
        return adminUser && adminToken && adminUser.role === 'admin';
    };

    const value = {
        adminUser,
        adminToken,
        login,
        logout,
        isAuthenticated,
        loading
    };

    return (
        <AdminAuthContext.Provider value={value}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export default AdminAuthContext;

