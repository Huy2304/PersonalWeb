import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../auth/AuthContext';
import './CreatePost.css';

const CreatePost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    post: '',
    category_id: '',
    img_path: '',
    status: false,
    is_anonymous: false,
    is_story: false // Đánh dấu rõ ràng là bài viết không phải story
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL; // CRA

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/category`);
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

  const handleImageUpload = (file) => {
    if (file) {
      // Kiểm tra loại file
      if (!file.type.startsWith('image/')) {
        setError('Vui lòng chọn file hình ảnh hợp lệ');
        return;
      }

      // Kiểm tra kích thước file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Kích thước file không được vượt quá 5MB');
        return;
      }

      // Tạo preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setFormData({
          ...formData,
          img_path: e.target.result // Sử dụng base64 cho preview
        });
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleImageUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData({
      ...formData,
      img_path: ''
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const postData = {
        ...formData,
        user_id: user._id || user.id
      };

      if (!postData.category_id) {
        setError('Vui lòng chọn danh mục cho bài viết');
        setLoading(false);
        return;
      }

      console.log('Post data being sent:', postData);
      console.log('Status:', postData.status);

      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/api/blogs`, postData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setSuccess(formData.status
        ? 'Bài viết đã được tạo và xuất bản thành công!'
        : 'Bài viết đã được lưu nháp thành công!'
      );

      // Reset form
      setFormData({
        title: '',
        post: '',
        category_id: '',
        img_path: '',
        status: false,
        is_anonymous: false,
        is_story: false
      });
      setImagePreview(null);

      setSuccess(formData.status
        ? 'Bài viết đã được tạo và xuất bản thành công!'
        : 'Bài viết đã được lưu nháp thành công!'
      );

      // Navigate after short delay or immediately
      alert(formData.status ? 'Đã xuất bản!' : 'Đã lưu nháp!');
      navigate(formData.status ? '/' : '/drafts');

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
              <option value="">-- Chọn danh mục --</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {formData.category_id && (
              <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                Đã chọn: {categories.find(cat => cat._id === formData.category_id)?.name}
              </small>
            )}
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
            <label>Hình ảnh bài viết (tùy chọn)</label>
            <div
              className={`image-upload-area ${isDragOver ? 'drag-over' : ''} ${imagePreview ? 'has-image' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {imagePreview ? (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={handleRemoveImage}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <div className="upload-icon">📷</div>
                  <p>Kéo thả hình ảnh vào đây hoặc</p>
                  <button
                    type="button"
                    className="upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Chọn file
                  </button>
                  <p className="upload-hint">Hỗ trợ: JPG, PNG, GIF (tối đa 5MB)</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="status"
                checked={!formData.status}
                onChange={(e) => setFormData({ ...formData, status: !e.target.checked })}
                className="form-checkbox"
              />
              Lưu nháp
            </label>

          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_anonymous"
                checked={formData.is_anonymous}
                onChange={handleChange}
                className="form-checkbox"
              />
              Đăng bài ẩn danh
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
