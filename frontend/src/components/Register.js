import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

const Register = ({ onRegisterSuccess, switchToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

    // Kiểm tra mật khẩu khớp
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/auth/register', {
        email: formData.email,
        password: formData.password
      });
      
      setSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
      setFormData({ email: '', password: '', confirmPassword: '' });
      
      // Chuyển sang form đăng nhập sau 2 giây
      setTimeout(() => {
        switchToLogin();
      }, 2000);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Đăng ký</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
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
              placeholder="Xác nhận mật khẩu"
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
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>
        
        <p className="switch-auth">
          Đã có tài khoản? 
          <button 
            type="button" 
            onClick={switchToLogin}
            className="switch-btn"
          >
            Đăng nhập ngay
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
