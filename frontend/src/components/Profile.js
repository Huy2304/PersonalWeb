import React, { useState, useEffect } from 'react';
import { getUser, updateProfile, changePassword } from '../Services/userService';
import './Profile.css';

const Profile = ({ user, onUpdateUser }) => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user && user._id) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await getUser(user._id);
      if (response.user) {
        setProfileData({
          name: response.user.name || '',
          email: response.user.email || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage('Không thể tải thông tin profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage('');

      const response = await updateProfile(user._id, profileData);

      if (response.message) {
        setMessage(response.message);

        // Cập nhật thông tin user trong localStorage và parent component
        const updatedUser = { ...user, ...profileData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        onUpdateUser(updatedUser);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const response = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (response.message) {
        setMessage(response.message);
        // Reset form
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage(error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading && !profileData.name) {
    return <div className="profile-loading">Đang tải...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Trang Cá Nhân</h2>
        <p>Quản lý thông tin cá nhân của bạn</p>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Thông Tin Cá Nhân
        </button>
        <button
          className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          Đổi Mật Khẩu
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {activeTab === 'profile' && (
        <form className="profile-form" onSubmit={handleProfileSubmit}>
          <div className="form-group">
            <label htmlFor="name">Họ tên:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={profileData.name}
              onChange={handleProfileChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              required
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Đang cập nhật...' : 'Cập Nhật Thông Tin'}
          </button>
        </form>
      )}

      {activeTab === 'password' && (
        <form className="password-form" onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword">Mật khẩu hiện tại:</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">Mật khẩu mới:</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu mới:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
              minLength="6"
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Đang đổi mật khẩu...' : 'Đổi Mật Khẩu'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;
