import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import CreatePost from './components/CreatePost';
import PostList from './components/PostList';
import DraftPosts from './components/DraftPosts';
import Dashboard from "./admin/pages/Dashboard";
import UserPage from "./admin/pages/UsersPage";
import AdminLayout from "./admin/AdminLayout";
import CheckAdmin from "./admin/pages/CheckAdmin";
import BlogAdmin from "./admin/pages/BlogAdmin";
import SettingPage from "./admin/pages/SettingPage";

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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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

  const switchToForgotPassword = () => {
    setCurrentView('forgot-password');
  };

  const handlePostCreated = () => {
    setCurrentView('home');
  };

  const renderAuthContent = () => {
    switch (currentView) {
      case 'register':
        return <Register switchToLogin={switchToLogin} />;
      case 'forgot-password':
        return <ForgotPassword switchToLogin={switchToLogin} switchToRegister={switchToRegister} />;
      case 'login':
      default:
        return (
            <Login
                onLoginSuccess={handleLoginSuccess}
                switchToLogin={switchToLogin}
                switchToRegister={switchToRegister}
                switchToForgotPassword={switchToForgotPassword}
            />
        );
    }
  };

  const renderMainContent = () => {
    if (!user) {
      return renderAuthContent();
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
      case 'drafts':
        return <DraftPosts user={user} />;
      case 'home':
      default:
        return <PostList user={user} />;
    }
  };

  return (
      <Router>
        <div className="App">
          <Routes>
            {/* Route cho reset password - không cần header */}
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Các route chính */}
            <Route path="*" element={
              <>
                <Header
                    user={user}
                    onLogout={handleLogout}
                    currentView={currentView}
                    setCurrentView={setCurrentView}
                />
                <main className="main-content">
                  {renderMainContent()}
                </main>
              </>
            } />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />   {/* tương đương /admin */}
              <Route path="users" element={<UserPage />} />
              <Route path="settings" element={<SettingPage />} />
              <Route path="blog" element={<BlogAdmin />} />
              <Route path="check" element={<CheckAdmin />} />
            </Route>
          </Routes>

        </div>
      </Router>
  );
}

export default App;
