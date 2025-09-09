import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

const ForgotPassword = ({ switchToLogin, switchToRegister }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('https://personalweb-5cn1.onrender.com/api/auth/forgot-password', { email });
      setSuccess(response.data.message);
      setEmail('');
    } catch (error) {
      setError(error.response?.data?.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Quên mật khẩu</h2>
        <p className="auth-description">
          Nhập email của bạn để nhận link đặt lại mật khẩu
        </p>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="submit-btn"
          >
            {loading ? 'Đang gửi...' : 'Gửi email đặt lại mật khẩu'}
          </button>
        </form>
        
        <div className="auth-links">
          <p className="switch-auth">
            Nhớ mật khẩu? 
            <button 
              type="button" 
              onClick={switchToLogin}
              className="switch-btn"
            >
              Đăng nhập
            </button>
          </p>
          
          <p className="switch-auth">
            Chưa có tài khoản? 
            <button 
              type="button" 
              onClick={switchToRegister}
              className="switch-btn"
            >
              Đăng ký ngay
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
