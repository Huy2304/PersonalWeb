import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        // Lấy theme từ localStorage
        const savedTheme = localStorage.getItem('admin-theme');
        return savedTheme === 'dark';
    });

    useEffect(() => {
        // Lưu theme vào localStorage
        localStorage.setItem('admin-theme', darkMode ? 'dark' : 'light');
        
        // Áp dụng theme cho document
        if (darkMode) {
            document.documentElement.classList.add('dark-theme');
            document.documentElement.classList.remove('light-theme');
        } else {
            document.documentElement.classList.add('light-theme');
            document.documentElement.classList.remove('dark-theme');
        }
        
        // Debug: log để kiểm tra
        console.log('Theme changed to:', darkMode ? 'dark' : 'light');
        console.log('Document classes:', document.documentElement.classList);
    }, [darkMode]);

    const toggleTheme = () => {
        setDarkMode(prev => !prev);
    };

    const value = {
        darkMode,
        toggleTheme
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
