import React from 'react';
import './Header.css';
import SearchBox from './SearchBox';
import { useTheme } from '../context/ThemeContext';

const Header = ({ user, onLogout, currentView, setCurrentView, onSearch, onClearSearch, searchQuery }) => {
    const { darkMode, toggleTheme } = useTheme();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        onLogout();
    };

    return (
        <header className={`header ${!darkMode ? 'light-theme' : ''}`}>
            <div className="header-container">
                <div className="logo" onClick={() => setCurrentView('home')} style={{ cursor: 'pointer' }}>
                    <h1>BlogPersonal</h1>
                </div>

                {/* Search Box - hiển thị khi đã đăng nhập và không ở trang tạo bài viết */}
                {user && currentView !== 'create' && (
                    <div className="header-search">
                        <SearchBox
                            placeholder="🔍 Tìm kiếm bài viết, câu chuyện..."
                            onSearch={onSearch}
                            onClear={onClearSearch}
                            size="small"
                            className="header-search-box"
                        />
                    </div>
                )}

                {user ? (
                    <nav className="nav">
                        <div className="nav-links">
                            <button
                                className={`nav-btn ${currentView === 'create' ? 'active' : ''}`}
                                onClick={() => setCurrentView('create')}
                            >
                                Tạo bài viết
                            </button>
                            <button
                                className={`nav-btn ${currentView === 'drafts' ? 'active' : ''}`}
                                onClick={() => setCurrentView('drafts')}
                            >
                                Bài viết nháp
                            </button>
                        </div>
                        <div className="user-info">
                            <button
                                className="profile-btn"
                                onClick={() => setCurrentView('profile')}
                                title="Chỉnh sửa trang cá nhân"
                            >
                                Xin chào, {user.email}
                            </button>
                            <button className="logout-btn" onClick={handleLogout}>
                                Đăng xuất
                            </button>
                            <button
                                className="theme-toggle-btn"
                                onClick={toggleTheme}
                                title={darkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
                                style={{
                                    backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
                                    color: darkMode ? '#f0f0f0' : '#333333',
                                    border: `1px solid ${darkMode ? '#404040' : '#ddd'}`,
                                    padding: '8px 12px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    marginLeft: '10px'
                                }}
                            >
                                {darkMode ? '☀️' : '🌙'}
                            </button>
                        </div>
                    </nav>
                ) : (
                    <div className="auth-info">
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
