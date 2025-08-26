import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tokenValid, setTokenValid] = useState(true);
  
  const { token } = useParams();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Kiểm tra mật khẩu xác nhận
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setLoading(false);
      return;
    }

    // Kiểm tra độ dài mật khẩu
    if (formData.newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
        token,
        newPassword: formData.newPassword
      });
      
      setSuccess(response.data.message);
      
      // Chuyển hướng về trang đăng nhập sau 3 giây
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Đã có lỗi xảy ra');
      if (error.response?.status === 400) {
        setTokenValid(false);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="auth-container">
        <div className="auth-form">
          <h2>Link không hợp lệ</h2>
          <p className="error-message">
            Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="submit-btn"
          >
            Quay về trang đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Đặt lại mật khẩu</h2>
        <p className="auth-description">
          Nhập mật khẩu mới cho tài khoản của bạn
        </p>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="password"
              name="newPassword"
              placeholder="Mật khẩu mới"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="form-input"
              minLength="6"
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu mới"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="form-input"
              minLength="6"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="submit-btn"
          >
            {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
          </button>
        </form>
        
        <p className="switch-auth">
          <button 
            type="button" 
            onClick={() => navigate('/login')}
            className="switch-btn"
          >
            Quay về trang đăng nhập
          </button>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
