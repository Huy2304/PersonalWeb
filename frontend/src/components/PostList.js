import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditPost from '../../../../../../../../xampp/htdocs/PersonalWeb/frontend/src/components/EditPost';
import './PostList.css';

const PostList = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentAnonymous, setCommentAnonymous] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [likeLoading, setLikeLoading] = useState({});
  const [editingPost, setEditingPost] = useState(null);
  const [storyContent, setStoryContent] = useState('');
  const [storyLoading, setStoryLoading] = useState(false);
  const [newStoryId, setNewStoryId] = useState(null);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterPostsByCategory();
  }, [selectedCategory, allPosts]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blogs');
      // Chỉ hiển thị bài viết đã xuất bản (status: true)
      const publishedPosts = response.data.filter(post => post.status === true);

      // Sắp xếp theo thời gian đăng - mới nhất ở trên đầu
      const sortedPosts = publishedPosts.sort((a, b) => {
        const dateA = new Date(a.date_published || a.date_updated);
        const dateB = new Date(b.date_published || b.date_updated);
        return dateB - dateA; // Sắp xếp giảm dần (mới nhất trước)
      });

      setAllPosts(sortedPosts);
      setPosts(sortedPosts);
    } catch (error) {
      setError('Không thể tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/category');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filterPostsByCategory = () => {
    let filteredPosts;
    if (!selectedCategory || selectedCategory === '') {
      filteredPosts = allPosts;
    } else {
      filteredPosts = allPosts.filter(post =>
          post.category_id?._id === selectedCategory || post.category_id === selectedCategory
      );
    }

    // Đảm bảo sắp xếp theo thời gian sau khi filter
    const sortedFilteredPosts = filteredPosts.sort((a, b) => {
      const dateA = new Date(a.date_published || a.date_updated);
      const dateB = new Date(b.date_published || b.date_updated);
      return dateB - dateA; // Mới nhất ở trên đầu
    });

    setPosts(sortedFilteredPosts);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Utility function để xử lý token hết hạn
  const handleTokenExpired = (error) => {
    if (error.response?.status === 401 && error.response?.data?.error === 'jwt expired') {
      localStorage.removeItem('token');
      alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      window.location.reload();
      return true;
    }
    return false;
  };

  // Utility function để check xem post có phải story không
  const isStory = (post) => {
    return post.is_story === true || (post.title && post.post && post.title.length <= 50 && post.post.length <= 256);
  };

  const handleStorySubmit = async (e) => {
    e.preventDefault();
    if (!storyContent.trim() || !user) return;

    // Kiểm tra độ dài tối thiểu theo yêu cầu backend validation
    if (storyContent.trim().length < 10) {
      alert('Story phải có ít nhất 10 ký tự');
      return;
    }

    setStoryLoading(true);

    const token = localStorage.getItem('token');
    // Tạo title từ nội dung story, đảm bảo ít nhất 5 ký tự
    const content = storyContent.trim();
    let title = content.length > 50
        ? content.substring(0, 47) + '...'
        : content;

    // Đảm bảo title có ít nhất 5 ký tự
    if (title.length < 5) {
      title = content.substring(0, Math.min(content.length, 50));
    }

    const storyData = {
      title: title,
      post: content,
      status: true, // Story luôn xuất bản ngay, không có nháp
      is_anonymous: false, // Story không ẩn danh
      is_story: true // Đánh dấu đây là story để bypass auto-moderation
    };

    // Thêm category_id nếu có (sử dụng category đầu tiên làm mặc định cho story)
    if (categories.length > 0) {
      storyData.category_id = categories[0]._id;
    }

    try {

      await axios.post('http://localhost:5000/api/blogs', storyData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Tạo story object mới để hiển thị ngay
      const tempId = Date.now().toString();
      const newStory = {
        _id: tempId,
        title: storyData.title,
        post: storyData.post,
        user_id: { email: user.email, _id: user._id || user.id },
        category_id: storyData.category_id ? {
          _id: storyData.category_id,
          name: categories.find(cat => cat._id === storyData.category_id)?.name || 'Không có'
        } : null,
        status: true,
        is_anonymous: false,
        likes_count: 0,
        date_published: new Date().toISOString(),
        img_path: null,
        is_story: true // Đánh dấu là story để render khác biệt
      };

      // Đánh dấu story mới để thêm animation
      setNewStoryId(tempId);

      // Thêm story mới vào đầu danh sách (đã có thời gian mới nhất)
      setAllPosts(prevPosts => {
        const updatedPosts = [newStory, ...prevPosts];
        // Sắp xếp lại để đảm bảo thứ tự đúng
        return updatedPosts.sort((a, b) => {
          const dateA = new Date(a.date_published || a.date_updated);
          const dateB = new Date(b.date_published || b.date_updated);
          return dateB - dateA;
        });
      });

      setPosts(prevPosts => {
        const updatedPosts = [newStory, ...prevPosts];
        // Sắp xếp lại để đảm bảo thứ tự đúng
        return updatedPosts.sort((a, b) => {
          const dateA = new Date(a.date_published || a.date_updated);
          const dateB = new Date(b.date_published || b.date_updated);
          return dateB - dateA;
        });
      });

      setStoryContent('');

      // Bỏ highlight sau 3 giây
      setTimeout(() => {
        setNewStoryId(null);
      }, 3000);

      // Fetch lại để cập nhật ID thật từ server
      setTimeout(() => {
        fetchPosts();
      }, 1500);
    } catch (error) {
      console.error('Error posting story:', error);
      console.error('Story data sent:', storyData);

      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);

        // Xử lý token hết hạn
        if (handleTokenExpired(error)) return;

        alert(`Lỗi đăng story: ${error.response.data?.message || 'Lỗi không xác định'}`);
      } else {
        alert('Có lỗi xảy ra khi đăng story. Vui lòng thử lại.');
      }
    } finally {
      setStoryLoading(false);
    }
  };


  const fetchComments = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/comment/${postId}`);
      setComments(response.data.data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    fetchComments(post._id);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setCommentLoading(true);
    try {
      const token = localStorage.getItem('token');
      const commentData = {
        post_id: selectedPost._id,
        user_id: user._id || user.id,
        content: newComment.trim(),
        is_anonymous: commentAnonymous
      };

      await axios.post('http://localhost:5000/api/comment', commentData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setNewComment('');
      setCommentAnonymous(false);
      fetchComments(selectedPost._id);
    } catch (error) {
      console.error('Error posting comment:', error);

      // Xử lý token hết hạn
      if (handleTokenExpired(error)) return;

      alert('Có lỗi xảy ra khi đăng bình luận. Vui lòng thử lại.');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleLike = async (postId) => {
    if (!user) {
      alert('Vui lòng đăng nhập để thích bài viết');
      return;
    }

    // Set loading state cho post này
    setLikeLoading(prev => ({ ...prev, [postId]: true }));

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/interaction', {
        postId,
        userId: user._id || user.id,
        type: 'like'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Kiểm tra response để xác định là thích hay bỏ thích
      const isLiked = response.data.message.includes('Đã like');

      // Cập nhật ngay lập tức số like trên giao diện
      setPosts(prevPosts =>
          prevPosts.map(post =>
              post._id === postId
                  ? {
                    ...post,
                    likes_count: isLiked
                        ? (post.likes_count || 0) + 1
                        : Math.max(0, (post.likes_count || 0) - 1)
                  }
                  : post
          )
      );

      // Cập nhật selectedPost nếu đang xem chi tiết bài viết
      if (selectedPost && selectedPost._id === postId) {
        setSelectedPost(prev => ({
          ...prev,
          likes_count: isLiked
              ? (prev.likes_count || 0) + 1
              : Math.max(0, (prev.likes_count || 0) - 1)
        }));
      }

    } catch (error) {
      console.error('Error liking post:', error);

      // Xử lý token hết hạn
      if (handleTokenExpired(error)) return;
    } finally {
      // Clear loading state
      setLikeLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/blogs/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Quay về danh sách và refresh posts
      setSelectedPost(null);
      fetchPosts();
      alert('Bài viết đã được xóa thành công!');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Không thể xóa bài viết. Vui lòng thử lại.');
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
  };

  const handlePostUpdated = (updatedPost) => {
    // Cập nhật bài viết trong danh sách
    setPosts(prevPosts =>
        prevPosts.map(post =>
            post._id === updatedPost._id ? updatedPost : post
        )
    );

    // Nếu đang xem bài viết này, cập nhật selectedPost
    if (selectedPost && selectedPost._id === updatedPost._id) {
      setSelectedPost(updatedPost);
    }

    setEditingPost(null);
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  const handleDeleteMultiplePosts = async () => {
    if (selectedPosts.length === 0) {
      alert('Vui lòng chọn ít nhất một bài viết để xóa.');
      return;
    }

    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedPosts.length} bài viết đã chọn?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const deletePromises = selectedPosts.map(postId =>
          axios.delete(`http://localhost:5000/api/blogs/${postId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
      );

      await Promise.all(deletePromises);

      setSelectedPosts([]);
      setIsMultiSelectMode(false);
      fetchPosts();
      alert(`Đã xóa thành công ${selectedPosts.length} bài viết!`);
    } catch (error) {
      console.error('Error deleting multiple posts:', error);
      alert('Có lỗi xảy ra khi xóa một số bài viết. Vui lòng thử lại.');
    }
  };

  const handlePostSelection = (postId) => {
    setSelectedPosts(prev => {
      if (prev.includes(postId)) {
        return prev.filter(id => id !== postId);
      } else {
        return [...prev, postId];
      }
    });
  };

  const toggleMultiSelectMode = () => {
    setIsMultiSelectMode(!isMultiSelectMode);
    setSelectedPosts([]);
  };

  const canDeletePost = (post) => {
    // Nếu không có user đăng nhập, không có quyền xóa
    if (!user) return false;

    // Nếu không có thông tin bài viết, không có quyền xóa
    if (!post) return false;

    // Admin có thể xóa tất cả bài viết
    if (user.role === 'admin') return true;

    // User thường chỉ có thể xóa bài viết của chính mình
    const userId = user._id || user.id;
    const postUserId = post.user_id?._id || post.user_id?.id;

    const canDelete = userId && postUserId && userId.toString() === postUserId.toString();

    // Debug log (có thể xóa sau khi test xong)
    console.log('Delete permission check:', {
      postTitle: post.title,
      userId: userId,
      postUserId: postUserId,
      userRole: user.role,
      canDelete: canDelete
    });

    return canDelete;
  };

  const canEditPost = (post) => {
    // Nếu không có user đăng nhập, không có quyền chỉnh sửa
    if (!user) return false;

    // Nếu không có thông tin bài viết, không có quyền chỉnh sửa
    if (!post) return false;

    // Admin có thể chỉnh sửa tất cả bài viết
    if (user.role === 'admin') return true;

    // User thường chỉ có thể chỉnh sửa bài viết của chính mình
    const userId = user._id || user.id;
    const postUserId = post.user_id?._id || post.user_id?.id;

    const canEdit = userId && postUserId && userId.toString() === postUserId.toString();

    return canEdit;
  };

  const canDeleteMultiple = () => {
    return user && user.role === 'admin';
  };

  const hasDeletePermission = () => {
    // Kiểm tra xem có ít nhất 1 bài viết mà user có quyền xóa không
    return posts.some(post => canDeletePost(post));
  };



  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatLikeCount = (count) => {
    if (count === 0) return '0';
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(1)}M`;
  };

  if (loading) {
    return <div className="loading">Đang tải bài viết...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
      <div className="post-list-container">
        {editingPost ? (
            <EditPost
                post={editingPost}
                user={user}
                onPostUpdated={handlePostUpdated}
                onCancel={handleCancelEdit}
            />
        ) : selectedPost ? (
            <div className="post-detail">
              <button
                  className="back-btn"
                  onClick={() => setSelectedPost(null)}
              >
                ← Quay lại danh sách
              </button>

              <article className="post-detail-content">
                {selectedPost.img_path && (
                    <img
                        src={selectedPost.img_path}
                        alt={selectedPost.title}
                        className="post-image"
                    />
                )}
                <h1>{selectedPost.title}</h1>
                <div className="post-meta">
                  <span>Tác giả: {selectedPost.is_anonymous ? 'Ẩn danh' : (selectedPost.user_id?.email || 'Ẩn danh')}</span>
                  <span>Ngày: {formatDate(selectedPost.date_published)}</span>
                  <span>Danh mục: {selectedPost.category_id?.name || 'Không có'}</span>
                </div>
                <div className="post-content">
                  {selectedPost.post.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                  ))}
                </div>

                <div className="post-actions">
                  <button
                      className="like-btn"
                      onClick={() => handleLike(selectedPost._id)}
                      disabled={!user || likeLoading[selectedPost._id]}
                      style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: (user && !likeLoading[selectedPost._id]) ? 'pointer' : 'not-allowed',
                        opacity: (user && !likeLoading[selectedPost._id]) ? 1 : 0.6,
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (user && !likeLoading[selectedPost._id]) {
                          e.target.style.backgroundColor = '#0056b3';
                          e.target.style.transform = 'scale(1.05)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (user && !likeLoading[selectedPost._id]) {
                          e.target.style.backgroundColor = '#007bff';
                          e.target.style.transform = 'scale(1)';
                        }
                      }}
                  >
                    {likeLoading[selectedPost._id] ? '⏳' : '👍'} {formatLikeCount(selectedPost.likes_count || 0)} Thích
                  </button>

                  {canEditPost(selectedPost) && (
                      <button
                          className="edit-btn"
                          onClick={() => handleEditPost(selectedPost)}
                          style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            marginLeft: '10px',
                            cursor: 'pointer'
                          }}
                      >
                        ✏️ Chỉnh sửa
                      </button>
                  )}

                  {canDeletePost(selectedPost) && (
                      <button
                          className="delete-btn"
                          onClick={() => handleDeletePost(selectedPost._id)}
                          style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            marginLeft: '10px',
                            cursor: 'pointer'
                          }}
                      >
                        🗑️ Xóa bài viết
                      </button>
                  )}
                </div>
              </article>

              {/* Comments Section */}
              <div className="comments-section">
                <h3>Bình luận ({comments.length})</h3>

                {user && (
                    <form onSubmit={handleCommentSubmit} className="comment-form">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Viết bình luận của bạn..."
                    rows="3"
                    required
                />
                      <div className="comment-options">
                        <label className="checkbox-label">
                          <input
                              type="checkbox"
                              checked={commentAnonymous}
                              onChange={(e) => setCommentAnonymous(e.target.checked)}
                              className="form-checkbox"
                          />
                          Bình luận ẩn danh
                        </label>
                      </div>
                      <button
                          type="submit"
                          disabled={commentLoading || !newComment.trim()}
                          className="submit-comment-btn"
                      >
                        {commentLoading ? 'Đang gửi...' : 'Gửi bình luận'}
                      </button>
                    </form>
                )}

                <div className="comments-list">
                  {comments.length === 0 ? (
                      <p className="no-comments">Chưa có bình luận nào.</p>
                  ) : (
                      comments.map((comment) => (
                          <div key={comment._id} className="comment-item">
                            <div className="comment-header">
                              <strong>{comment.is_anonymous ? 'Ẩn danh' : (comment.user_id?.email || 'Ẩn danh')}</strong>
                              <span className="comment-date">
                        {formatDate(comment.created_at)}
                      </span>
                            </div>
                            <p className="comment-content">{comment.content}</p>
                          </div>
                      ))
                  )}
                </div>
              </div>
            </div>
        ) : (
            <div className="posts-layout">
              {/* Sidebar với danh mục */}
              <div className="categories-sidebar">
                <h3>Danh mục</h3>
                <div className="category-list">
                  <button
                      className={`category-item ${selectedCategory === '' ? 'active' : ''}`}
                      onClick={() => handleCategorySelect('')}
                  >
                    <span className="category-icon">📋</span>
                    Tất cả bài viết
                    <span className="post-count">({allPosts.length})</span>
                  </button>
                  {categories.map((category) => {
                    const categoryPostCount = allPosts.filter(post =>
                        post.category_id?._id === category._id || post.category_id === category._id
                    ).length;
                    return (
                        <button
                            key={category._id}
                            className={`category-item ${selectedCategory === category._id ? 'active' : ''}`}
                            onClick={() => handleCategorySelect(category._id)}
                        >
                          <span className="category-icon">📁</span>
                          {category.name}
                          <span className="post-count">({categoryPostCount})</span>
                        </button>
                    );
                  })}
                </div>
              </div>

              {/* Main content */}
              <div className="posts-main">
                {/* Story Input Box */}
                {user && (
                    <div className="story-box">
                      <form onSubmit={handleStorySubmit} className="story-form">
                        <div className="story-input-container">
                    <textarea
                        value={storyContent}
                        onChange={(e) => {
                          if (e.target.value.length <= 256) {
                            setStoryContent(e.target.value);
                          }
                        }}
                        placeholder={`${user.email?.split('@')[0] || 'Bạn'} ơi, bạn đang nghĩ gì?`}
                        className="story-input"
                        rows="3"
                        maxLength="256"
                    />
                          <div className="story-controls">
                      <span className={`char-count ${
                          storyContent.length > 230 ? 'warning' :
                              storyContent.length < 10 ? 'insufficient' : ''
                      }`}>
                        {storyContent.length}/256
                      </span>
                            <button
                                type="submit"
                                disabled={storyLoading || !storyContent.trim() || storyContent.trim().length < 10}
                                className="story-submit-btn"
                            >
                              {storyLoading ? 'Đang đăng...' : 'Đăng'}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                )}

                <div className="posts-header">
                  <h2>
                    {selectedCategory === ''
                        ? 'Bài viết'
                        : categories.find(cat => cat._id === selectedCategory)?.name || 'Bài viết'
                    }
                    <span className="posts-count">({posts.length})</span>
                  </h2>

                  {(canDeleteMultiple() || hasDeletePermission()) && (
                      <div className="admin-controls">
                        {canDeleteMultiple() && (
                            <>
                              <button
                                  className={`multi-select-btn ${isMultiSelectMode ? 'active' : ''}`}
                                  onClick={toggleMultiSelectMode}
                                  style={{
                                    backgroundColor: isMultiSelectMode ? '#007bff' : '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    marginRight: '10px',
                                    cursor: 'pointer'
                                  }}
                              >
                                {isMultiSelectMode ? '✓ Đang chọn nhiều' : '☑️ Chọn nhiều bài viết'}
                              </button>

                              {isMultiSelectMode && selectedPosts.length > 0 && (
                                  <button
                                      className="delete-multiple-btn"
                                      onClick={handleDeleteMultiplePosts}
                                      style={{
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 16px',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                      }}
                                  >
                                    🗑️ Xóa {selectedPosts.length} bài viết
                                  </button>
                              )}
                            </>
                        )}
                      </div>
                  )}
                </div>

                <div className="posts-grid">
                  {posts.length === 0 ? (
                      <p className="no-posts">
                        {selectedCategory === ''
                            ? 'Chưa có bài viết nào.'
                            : `Chưa có bài viết nào trong danh mục "${categories.find(cat => cat._id === selectedCategory)?.name}".`
                        }
                      </p>
                  ) : (
                      posts.map((post) => {
                        // Render khác biệt cho Story vs Bài viết thường
                        if (isStory(post)) {
                          // STORY DESIGN - Compact và focus vào text
                          return (
                              <article
                                  key={post._id}
                                  className={`story-card ${selectedPosts.includes(post._id) ? 'selected' : ''} ${newStoryId === post._id ? 'new-story' : ''}`}
                                  onClick={() => {
                                    if (isMultiSelectMode && canDeletePost(post)) {
                                      handlePostSelection(post._id);
                                    } else if (!isMultiSelectMode) {
                                      handlePostClick(post);
                                    }
                                  }}
                                  style={{
                                    cursor: isMultiSelectMode
                                        ? (canDeletePost(post) ? 'pointer' : 'not-allowed')
                                        : 'pointer',
                                    border: selectedPosts.includes(post._id) ? '3px solid #007bff' : 'none',
                                    position: 'relative',
                                    opacity: isMultiSelectMode && !canDeletePost(post) ? 0.6 : 1
                                  }}
                              >
                                {/* Story Header */}
                                <div className="story-header">
                                  <div className="story-avatar">
                                    {post.is_anonymous ? '👤' : (post.user_id?.email?.charAt(0).toUpperCase() || '👤')}
                                  </div>
                                  <div className="story-author-info">
                                    <div className="story-author-name">
                                      {post.is_anonymous ? 'Ẩn danh' : (post.user_id?.email?.split('@')[0] || 'Ẩn danh')}
                                    </div>
                                    <div className="story-time">{formatDate(post.date_published)} • 📖 Story</div>
                                  </div>

                                  {/* Multi-select indicators */}
                                  {isMultiSelectMode && canDeletePost(post) && (
                                      <div className="multi-select-indicator">
                                        {selectedPosts.includes(post._id) ? '✓' : ''}
                                      </div>
                                  )}

                                  {isMultiSelectMode && !canDeletePost(post) && (
                                      <div className="multi-select-disabled">🚫</div>
                                  )}
                                </div>

                                {/* Story Content */}
                                <div className="story-content">
                                  <p>{post.post}</p>
                                </div>

                                {/* Story Actions */}
                                <div className="story-actions">
                                  <button
                                      className="story-like-btn"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleLike(post._id);
                                      }}
                                      disabled={!user || likeLoading[post._id]}
                                  >
                                    {likeLoading[post._id] ? '⏳' : '❤️'} {formatLikeCount(post.likes_count || 0)}
                                  </button>

                                  <button
                                      className="story-comment-btn"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePostClick(post);
                                      }}
                                  >
                                    💬 Bình luận
                                  </button>

                                  {!isMultiSelectMode && (
                                      <div className="story-post-actions">
                                        {canEditPost(post) && (
                                            <button
                                                className="story-edit-btn"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleEditPost(post);
                                                }}
                                            >
                                              ✏️
                                            </button>
                                        )}

                                        {canDeletePost(post) && (
                                            <button
                                                className="story-delete-btn"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleDeletePost(post._id);
                                                }}
                                            >
                                              🗑️
                                            </button>
                                        )}
                                      </div>
                                  )}
                                </div>
                              </article>
                          );
                        } else {
                          // REGULAR POST DESIGN - Giữ nguyên như cũ
                          return (
                              <article
                                  key={post._id}
                                  className={`post-card ${selectedPosts.includes(post._id) ? 'selected' : ''} ${newStoryId === post._id ? 'new-story' : ''}`}
                                  onClick={() => {
                                    if (isMultiSelectMode && canDeletePost(post)) {
                                      handlePostSelection(post._id);
                                    } else if (!isMultiSelectMode) {
                                      handlePostClick(post);
                                    }
                                  }}
                                  style={{
                                    cursor: isMultiSelectMode
                                        ? (canDeletePost(post) ? 'pointer' : 'not-allowed')
                                        : 'pointer',
                                    border: selectedPosts.includes(post._id) ? '3px solid #007bff' : '1px solid #ddd',
                                    position: 'relative',
                                    opacity: isMultiSelectMode && !canDeletePost(post) ? 0.6 : 1
                                  }}
                              >

                                {isMultiSelectMode && canDeletePost(post) && (
                                    <div style={{
                                      position: 'absolute',
                                      top: '10px',
                                      right: '10px',
                                      background: selectedPosts.includes(post._id) ? '#007bff' : '#fff',
                                      color: selectedPosts.includes(post._id) ? '#fff' : '#000',
                                      border: '2px solid #007bff',
                                      borderRadius: '50%',
                                      width: '24px',
                                      height: '24px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '12px',
                                      fontWeight: 'bold'
                                    }}>
                                      {selectedPosts.includes(post._id) ? '✓' : ''}
                                    </div>
                                )}

                                {isMultiSelectMode && !canDeletePost(post) && (
                                    <div style={{
                                      position: 'absolute',
                                      top: '10px',
                                      right: '10px',
                                      background: '#ccc',
                                      color: '#666',
                                      border: '2px solid #ccc',
                                      borderRadius: '50%',
                                      width: '24px',
                                      height: '24px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '12px',
                                      fontWeight: 'bold'
                                    }}>
                                      🚫
                                    </div>
                                )}

                                {post.img_path && (
                                    <img
                                        src={post.img_path}
                                        alt={post.title}
                                        className="post-thumbnail"
                                    />
                                )}
                                <div className="post-card-content">
                                  <h3>{post.title}</h3>
                                  <p className="post-excerpt">
                                    {post.post.substring(0, 150)}...
                                  </p>
                                  <div className="post-card-meta">
                                    <span>Tác giả: {post.is_anonymous ? 'Ẩn danh' : (post.user_id?.email || 'Ẩn danh')}</span>
                                    <span>{formatDate(post.date_published)}</span>
                                  </div>
                                  <div className="post-stats">
                                    <span>👍 {formatLikeCount(post.likes_count || 0)}</span>
                                    <span>Danh mục: {post.category_id?.name || 'Không có'}</span>
                                  </div>

                                  {!isMultiSelectMode && (
                                      <div className="post-card-actions">
                                        {canEditPost(post) && (
                                            <button
                                                className="post-edit-btn"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleEditPost(post);
                                                }}
                                                style={{
                                                  backgroundColor: '#28a745',
                                                  color: 'white',
                                                  border: 'none',
                                                  padding: '4px 8px',
                                                  borderRadius: '4px',
                                                  marginTop: '8px',
                                                  marginRight: '8px',
                                                  cursor: 'pointer',
                                                  fontSize: '12px'
                                                }}
                                            >
                                              ✏️ Sửa
                                            </button>
                                        )}

                                        {canDeletePost(post) && (
                                            <button
                                                className="post-delete-btn"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleDeletePost(post._id);
                                                }}
                                                style={{
                                                  backgroundColor: '#dc3545',
                                                  color: 'white',
                                                  border: 'none',
                                                  padding: '4px 8px',
                                                  borderRadius: '4px',
                                                  marginTop: '8px',
                                                  cursor: 'pointer',
                                                  fontSize: '12px'
                                                }}
                                            >
                                              🗑️ Xóa
                                            </button>
                                        )}
                                      </div>
                                  )}
                                </div>
                              </article>
                          );
                        }
                      })
                  )}
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default PostList;
