import React from 'react';
import './Header.css';
import SearchBox from './SearchBox';

const Header = ({ user, onLogout, currentView, setCurrentView, onSearch, onClearSearch, searchQuery }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  return (
      <header className="header">
        <div className="header-container">
          <div className="logo" onClick={() => setCurrentView('home')} style={{ cursor: 'pointer' }}>
            <h1>BlogPersonal</h1>
          </div>
          
          {/* Search Box - chỉ hiển thị khi đã đăng nhập và ở trang home */}
          {user && currentView === 'home' && (
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
