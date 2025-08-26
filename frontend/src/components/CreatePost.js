import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreatePost.css';

const CreatePost = ({ user, onPostCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    post: '',
    category_id: '',
    img_path: '',
    status: true
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/category');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const postData = {
        ...formData,
        user_id: user._id || user.id // Thêm user_id từ user đã đăng nhập
      };

      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:4000/api/blogs', postData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setSuccess('Bài viết đã được tạo thành công!');
      setFormData({
        title: '',
        post: '',
        category_id: '',
        img_path: '',
        status: true
      });
      
      // Gọi callback để cập nhật danh sách bài viết
      if (onPostCreated) {
        onPostCreated(response.data);
      }
      
    } catch (error) {
      setError(error.response?.data?.message || 'Đã có lỗi xảy ra khi tạo bài viết');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <div className="create-post-form">
        <h2>Tạo bài viết mới</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Tiêu đề</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Nhập tiêu đề bài viết"
              value={formData.title}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category_id">Danh mục</label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="post">Nội dung</label>
            <textarea
              id="post"
              name="post"
              placeholder="Nhập nội dung bài viết"
              value={formData.post}
              onChange={handleChange}
              required
              className="form-textarea"
              rows="10"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="img_path">URL hình ảnh (tùy chọn)</label>
            <input
              type="url"
              id="img_path"
              name="img_path"
              placeholder="https://example.com/image.jpg"
              value={formData.img_path}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="status"
                checked={formData.status}
                onChange={handleChange}
                className="form-checkbox"
              />
              Xuất bản ngay
            </label>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="submit-btn"
          >
            {loading ? 'Đang tạo bài viết...' : 'Tạo bài viết'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
