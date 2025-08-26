import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import CreatePost from './components/CreatePost';
import PostList from './components/PostList';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [currentView, setCurrentView] = useState('login');

  useEffect(() => {
    // Kiểm tra xem user đã đăng nhập chưa khi app load
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setCurrentView('home');
    }
  }, []);

  const handleLoginSuccess = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    setCurrentView('home');
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setCurrentView('login');
  };

  const switchToRegister = () => {
    setCurrentView('register');
  };

  const switchToLogin = () => {
    setCurrentView('login');
  };

  const handlePostCreated = () => {
    setCurrentView('home');
  };

  const renderContent = () => {
    if (!user) {
      // Nếu chưa đăng nhập
      if (currentView === 'register') {
        return (
          <Register
            switchToLogin={switchToLogin}
          />
        );
      }
      return (
        <Login
          onLoginSuccess={handleLoginSuccess}
          switchToRegister={switchToRegister}
        />
      );
    }

    // Nếu đã đăng nhập
    switch (currentView) {
      case 'create':
        return (
          <CreatePost 
            user={user}
            onPostCreated={handlePostCreated}
          />
        );
      case 'home':
      default:
        return <PostList user={user} />;
    }
  };

  return (
    <div className="App">
      <Header 
        user={user}
        onLogout={handleLogout}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
