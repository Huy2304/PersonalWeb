import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PostList.css';

const PostList = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/blogs');
      setPosts(response.data);
    } catch (error) {
      setError('Không thể tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  };


  const fetchComments = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/comment/post/${postId}`);
      setComments(response.data);
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
        comment: newComment.trim()
      };

      await axios.post('http://localhost:4000/api/comment', commentData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setNewComment('');
      fetchComments(selectedPost._id);
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:4000/api/blogs/${postId}/like`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchPosts(); // Refresh posts to show updated likes
    } catch (error) {
      console.error('Error liking post:', error);
    }
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

  if (loading) {
    return <div className="loading">Đang tải bài viết...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="post-list-container">
      {selectedPost ? (
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
              <span>Tác giả: {selectedPost.user_id?.email || 'Ẩn danh'}</span>
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
                disabled={!user}
              >
                👍 {selectedPost.likes_count || 0} Thích
              </button>
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
                      <strong>{comment.user_id?.email || 'Ẩn danh'}</strong>
                      <span className="comment-date">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="comment-content">{comment.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="posts-grid">
          <h2>Danh sách bài viết</h2>
          {posts.length === 0 ? (
            <p className="no-posts">Chưa có bài viết nào.</p>
          ) : (
            posts.map((post) => (
              <article 
                key={post._id} 
                className="post-card"
                onClick={() => handlePostClick(post)}
              >
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
                    <span>Tác giả: {post.user_id?.email || 'Ẩn danh'}</span>
                    <span>{formatDate(post.date_published)}</span>
                  </div>
                  <div className="post-stats">
                    <span>👍 {post.likes_count || 0}</span>
                    <span>Danh mục: {post.category_id?.name || 'Không có'}</span>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PostList;
