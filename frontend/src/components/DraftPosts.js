import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PostList.css';

const DraftPosts = ({ user }) => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const response = await axios.get('https://personalweb-5cn1.onrender.com/api/blogs');
      console.log('All posts:', response.data);
      console.log('Current user ID:', user._id);
      console.log('Current user object:', user);
      
      // Chỉ lấy bài viết nháp (status: false) của user hiện tại
      const userDrafts = response.data.filter(post => {
        const isDraft = post.status === false;
        
        // Debug: Log chi tiết để xem cấu trúc dữ liệu
        console.log('=== DEBUG POST ===');
        console.log('Post title:', post.title);
        console.log('Post user_id:', post.user_id);
        console.log('Post user_id type:', typeof post.user_id);
        console.log('Post user_id value:', post.user_id);
        
        console.log('=== DEBUG USER ===');
        console.log('User _id:', user._id);
        console.log('User id:', user.id);
        console.log('User _id type:', typeof user._id);
        console.log('User id type:', typeof user.id);
        
        // So sánh với nhiều cách khác nhau
        const isOwner1 = post.user_id === user._id;
        const isOwner2 = post.user_id === user.id;
        const isOwner3 = post.user_id && user._id && post.user_id.toString() === user._id.toString();
        const isOwner4 = post.user_id && user.id && post.user_id.toString() === user.id.toString();
        
        console.log('=== COMPARISON RESULTS ===');
        console.log('isOwner1 (===):', isOwner1);
        console.log('isOwner2 (===):', isOwner2);
        console.log('isOwner3 (toString):', isOwner3);
        console.log('isOwner4 (toString):', isOwner4);
        
        // Xử lý trường hợp post.user_id có thể là object (do populate) hoặc string
        let finalIsOwner = false;
        
        if (post.user_id && typeof post.user_id === 'object' && post.user_id._id) {
          // Trường hợp post.user_id là object (do populate)
          finalIsOwner = post.user_id._id === user._id || post.user_id._id === user.id;
        } else if (post.user_id) {
          // Trường hợp post.user_id là string
          finalIsOwner = isOwner1 || isOwner2 || isOwner3 || isOwner4;
        }
        
        console.log('Final isOwner:', finalIsOwner);
        console.log('Match:', isDraft && finalIsOwner);
        
        return isDraft && finalIsOwner;
      });
      
      console.log('Filtered drafts:', userDrafts);
      console.log('User ID being compared:', user._id || user.id);
      
      console.log('User drafts:', userDrafts);
      setDrafts(userDrafts);
    } catch (error) {
      console.error('Error fetching drafts:', error);
      setError('Không thể tải danh sách bài viết nháp');
    } finally {
      setLoading(false);
    }
  };

  const publishDraft = async (draftId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`https://personalweb-5cn1.onrender.com/api/blogs/${draftId}`, {
        status: true
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Refresh danh sách nháp
      fetchDrafts();
      alert('Bài viết đã được xuất bản!');
    } catch (error) {
      alert('Có lỗi xảy ra khi xuất bản bài viết');
    }
  };

  const deleteDraft = async (draftId) => {
    if (window.confirm('Bạn có chắc muốn xóa bài viết nháp này?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://personalweb-5cn1.onrender.com/api/blogs/${draftId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Refresh danh sách nháp
        fetchDrafts();
        alert('Bài viết nháp đã được xóa!');
      } catch (error) {
        alert('Có lỗi xảy ra khi xóa bài viết');
      }
    }
  };

  if (loading) {
    return <div className="loading">Đang tải bài viết nháp...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="draft-posts-container">
      <h2>Bài viết nháp của bạn</h2>
      
      {drafts.length === 0 ? (
        <div className="no-drafts">
          <p>Bạn chưa có bài viết nháp nào.</p>
          <p>Để tạo bài viết nháp, hãy bỏ tích "Xuất bản ngay" khi tạo bài viết mới.</p>
        </div>
      ) : (
        <div className="drafts-list">
          {drafts.map((draft) => (
            <div key={draft._id} className="draft-item">
              <div className="draft-content">
                <h3>{draft.title}</h3>
                <p className="draft-excerpt">
                  {draft.post.substring(0, 150)}...
                </p>
                <div className="draft-meta">
                  <span>Ngày tạo: {new Date(draft.date_updated).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
              <div className="draft-actions">
                <button 
                  className="publish-btn"
                  onClick={() => publishDraft(draft._id)}
                >
                  Xuất bản
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => deleteDraft(draft._id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DraftPosts;
