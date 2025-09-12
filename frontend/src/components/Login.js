import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

const Login = ({ onLoginSuccess, switchToRegister, switchToForgotPassword }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL; // CRA

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

    console.log('Login data being sent:', formData);

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, formData);

      // Lưu token vào localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.result));

      // Gọi callback để cập nhật state ở component cha
      onLoginSuccess(response.data.result, response.data.token);

      setFormData({ email: '', password: '' });
    } catch (error) {
      setError(error.response?.data?.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="auth-container">
        <div className="auth-form">
          <div className="welcome-message">Chào mừng đến với BlogPersonal</div>
          <h2>Đăng nhập</h2>
          {error && <div className="error-message">{error}</div>}

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
              />
            </div>

            <div className="forgot-password-link">
              <button
                  type="button"
                  onClick={switchToForgotPassword}
                  className="forgot-btn"
              >
                Quên mật khẩu?
              </button>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="submit-btn"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

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
  );
};

export default Login;
