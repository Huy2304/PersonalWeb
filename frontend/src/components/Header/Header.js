import React from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import './Header.css';
import SearchBox from '../SearchBox/SearchBox';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../auth/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    const { darkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSearch = (query) => {
        if (query) {
            setSearchParams({ q: query });
            // If not on home page, navigate to home with search param
            if (location.pathname !== '/') {
                navigate(`/?q=${encodeURIComponent(query)}`);
            }
        } else {
            setSearchParams({});
        }
    };

    const handleClearSearch = () => {
        setSearchParams({});
    };

    return (
        <header className={`header ${!darkMode ? 'light-theme' : ''}`}>
            <div className="header-container">
                <div className="logo" style={{ cursor: 'pointer' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h1>BlogPersonal</h1>
                    </Link>
                </div>

                {/* Search Box - hiển thị khi đã đăng nhập và không ở trang tạo bài viết */}
                {user && location.pathname !== '/create-post' && (
                    <div className="header-search">
                        <SearchBox
                            placeholder="🔍 Tìm kiếm bài viết, câu chuyện..."
                            onSearch={handleSearch}
                            onClear={handleClearSearch}
                            size="small"
                            className="header-search-box"
                        />
                    </div>
                )}

                {user ? (
                    <nav className="nav">
                        <div className="nav-links">
                            <Link to="/create-post">
                                <button className={`nav-btn ${location.pathname === '/create-post' ? 'active' : ''}`}>
                                    Tạo bài viết
                                </button>
                            </Link>
                            <Link to="/drafts">
                                <button className={`nav-btn ${location.pathname === '/drafts' ? 'active' : ''}`}>
                                    Bài viết nháp
                                </button>
                            </Link>
                            {user.role === 'admin' && (
                                <Link to="/admin">
                                    <button className={`nav-btn ${location.pathname.startsWith('/admin') ? 'active' : ''}`}>
                                        Admin
                                    </button>
                                </Link>
                            )}
                        </div>
                        <div className="user-info">
                            <Link to="/profile">
                                <button
                                    className="profile-btn"
                                    title="Chỉnh sửa trang cá nhân"
                                >
                                    Xin chào, {user.email}
                                </button>
                            </Link>
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
                        <Link to="/login">
                            <button className="nav-btn">Đăng nhập</button>
                        </Link>
                        <Link to="/register">
                            <button className="nav-btn">Đăng ký</button>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
