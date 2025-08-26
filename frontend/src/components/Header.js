import React from 'react';
import './Header.css';

const Header = ({ user, onLogout, currentView, setCurrentView }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>BlogPersonal</h1>
        </div>
        
        {user ? (
          <nav className="nav">
            <div className="nav-links">
              <button 
                className={`nav-btn ${currentView === 'home' ? 'active' : ''}`}
                onClick={() => setCurrentView('home')}
              >
                Trang chủ
              </button>
              <button 
                className={`nav-btn ${currentView === 'create' ? 'active' : ''}`}
                onClick={() => setCurrentView('create')}
              >
                Tạo bài viết
              </button>
            </div>
            <div className="user-info">
              <span className="user-email">Xin chào, {user.email}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Đăng xuất
              </button>
            </div>
          </nav>
        ) : (
          <div className="auth-info">
            <span>Chào mừng đến với BlogPersonal</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
