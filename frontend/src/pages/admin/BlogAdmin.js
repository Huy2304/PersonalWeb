import React, { useState, useEffect } from "react";
import "../../layouts/AdminLayout.css";
import { getAllPost } from "../../Services/BlogService.js";

const BlogAdmin = () => {
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedAuthor, setSelectedAuthor] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [isSearching, setIsSearching] = useState(false);
    const [selectedPosts, setSelectedPosts] = useState([]);
    const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);

    const API_URL = process.env.REACT_APP_API_URL; // CRA

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getAllPost();
                const postsData = data.posts || data || [];
                setBlogs(postsData);
                setFilteredBlogs(postsData);
            } catch (err) {
                console.error("Lỗi khi lấy danh sách bài viết:", err);
            }
        };

        fetchPosts();
    }, []);

    // Hàm tìm kiếm và filter
    const handleSearch = () => {
        setIsSearching(true);

        let results = blogs.filter(blog => {
            // Tìm kiếm theo từ khóa
            const matchesSearch = !searchQuery ||
                blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                blog.post?.toLowerCase().includes(searchQuery.toLowerCase());

            // Filter theo danh mục
            const matchesCategory = !selectedCategory ||
                blog.category_id?._id === selectedCategory ||
                blog.category_id === selectedCategory;

            // Filter theo tác giả
            const matchesAuthor = !selectedAuthor ||
                blog.user_id?.name?.toLowerCase().includes(selectedAuthor.toLowerCase()) ||
                blog.user_id?.email?.toLowerCase().includes(selectedAuthor.toLowerCase());

            // Filter theo khoảng thời gian
            let matchesDate = true;
            if (dateRange.start || dateRange.end) {
                const publishDate = new Date(blog.date_published);
                if (dateRange.start) {
                    const startDate = new Date(dateRange.start);
                    matchesDate = matchesDate && publishDate >= startDate;
                }
                if (dateRange.end) {
                    const endDate = new Date(dateRange.end);
                    endDate.setHours(23, 59, 59); // Đến cuối ngày
                    matchesDate = matchesDate && publishDate <= endDate;
                }
            }

            return matchesSearch && matchesCategory && matchesAuthor && matchesDate;
        });

        setFilteredBlogs(results);
        setIsSearching(false);
    };

    // Xử lý thay đổi từ khóa tìm kiếm
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Xử lý thay đổi danh mục
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    // Xử lý thay đổi tác giả
    const handleAuthorChange = (e) => {
        setSelectedAuthor(e.target.value);
    };

    // Xử lý thay đổi ngày bắt đầu
    const handleStartDateChange = (e) => {
        setDateRange(prev => ({ ...prev, start: e.target.value }));
    };

    // Xử lý thay đổi ngày kết thúc
    const handleEndDateChange = (e) => {
        setDateRange(prev => ({ ...prev, end: e.target.value }));
    };

    // Xử lý chọn/bỏ chọn một bài viết
    const handlePostSelection = (postId) => {
        setSelectedPosts(prevSelected => {
            if (prevSelected.includes(postId)) {
                return prevSelected.filter(id => id !== postId);
            } else {
                return [...prevSelected, postId];
            }
        });
    };

    // Bật/tắt chế độ chọn nhiều
    const toggleMultiSelectMode = () => {
        setIsMultiSelectMode(!isMultiSelectMode);
        if (isMultiSelectMode) {
            setSelectedPosts([]); // Reset selected posts when turning off multi-select
        }
    };

    // Xóa nhiều bài viết
    const handleDeleteMultiplePosts = async () => {
        if (selectedPosts.length === 0) {
            alert('Vui lòng chọn ít nhất một bài viết để xóa');
            return;
        }

        if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedPosts.length} bài viết đã chọn?`)) {
            return;
        }

        try {
            await Promise.all(selectedPosts.map(postId =>
                fetch(`${API_URL}/api/blogs/${postId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
            ));

            // Cập nhật state sau khi xóa
            setBlogs(prevBlogs => prevBlogs.filter(blog => !selectedPosts.includes(blog._id)));
            setFilteredBlogs(prevBlogs => prevBlogs.filter(blog => !selectedPosts.includes(blog._id)));
            setSelectedPosts([]);
            setIsMultiSelectMode(false);
            alert(`Đã xóa thành công ${selectedPosts.length} bài viết!`);
        } catch (error) {
            console.error('Lỗi khi xóa bài viết:', error);
            alert('Có lỗi xảy ra khi xóa bài viết');
        }
    };

    // Xóa tất cả filter
    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setSelectedAuthor('');
        setDateRange({ start: '', end: '' });
        setFilteredBlogs(blogs);
    };

    // Tự động tìm kiếm khi có thay đổi
    useEffect(() => {
        handleSearch();
    }, [searchQuery, selectedCategory, selectedAuthor, dateRange, blogs]);

    // Lấy danh sách danh mục duy nhất
    const getUniqueCategories = () => {
        const categories = blogs.map(blog => blog.category_id).filter(Boolean);
        return [...new Map(categories.map(item => [item._id || item, item])).values()];
    };

    // Lấy danh sách tác giả duy nhất
    const getUniqueAuthors = () => {
        const authors = blogs.map(blog => blog.user_id).filter(Boolean);
        return [...new Map(authors.map(item => [item._id || item.email, item])).values()];
    };

    // Hàm format ngày ISO -> dd/MM/yyyy
    const formatDate = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <div className="admin-page">
            <h2 className="page-title">Danh sách bài viết</h2>

            {/* Search and Filter Section */}
            <div className="admin-search-section">
                <div className="search-filters">
                    {/* Search Input */}
                    <div className="search-input-group">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="🔍 Tìm theo tiêu đề hoặc nội dung..."
                            className="admin-search-input"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="filter-group">
                        <select
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            className="admin-filter-select"
                        >
                            <option value="">Tất cả danh mục</option>
                            {getUniqueCategories().map(category => (
                                <option key={category._id || category} value={category._id || category}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Author Filter */}
                    <div className="filter-group">
                        <input
                            type="text"
                            value={selectedAuthor}
                            onChange={handleAuthorChange}
                            placeholder="👤 Tác giả..."
                            className="admin-filter-input"
                        />
                    </div>

                    {/* Date Range Filters */}
                    <div className="filter-group">
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={handleStartDateChange}
                            className="admin-date-input"
                            placeholder="Từ ngày"
                        />
                    </div>

                    <div className="filter-group">
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={handleEndDateChange}
                            className="admin-date-input"
                            placeholder="Đến ngày"
                        />
                    </div>

                    {/* Multi-select Mode Button */}
                    <button
                        onClick={toggleMultiSelectMode}
                        className={`multi-select-btn ${isMultiSelectMode ? 'active' : ''}`}
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

                    {/* Delete Multiple Posts Button */}
                    {isMultiSelectMode && selectedPosts.length > 0 && (
                        <button
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

                    {/* Clear Filters Button */}
                    <button
                        onClick={clearFilters}
                        className="clear-filters-btn"
                        disabled={!searchQuery && !selectedCategory && !selectedAuthor && !dateRange.start && !dateRange.end}
                    >
                        🗑️ Xóa bộ lọc
                    </button>
                </div>

                {/* Search Results Info */}
                {isSearching && (
                    <div className="search-loading">
                        <span className="loading-spinner">⏳</span> Đang tìm kiếm...
                    </div>
                )}

                {(searchQuery || selectedCategory || selectedAuthor || dateRange.start || dateRange.end) && (
                    <div className="search-results-info">
                        <span className="results-count">
                            Hiển thị {filteredBlogs.length} / {blogs.length} bài viết
                        </span>
                        {filteredBlogs.length === 0 && (
                            <span className="no-results">
                                Không tìm thấy kết quả nào
                            </span>
                        )}
                    </div>
                )}
            </div>

            <table className="user-table">
                <thead>
                <tr>
                    {isMultiSelectMode && <th>Chọn</th>}
                    <th>STT</th>
                    <th>Tiêu đề</th>
                    <th>Tác giả</th>
                    <th>Danh mục</th>
                    <th>Ngày đăng</th>
                    <th>Trạng thái</th>
                </tr>
                </thead>
                <tbody>
                {filteredBlogs.map((b, index) => (
                    <tr
                        key={b._id || index}
                        style={{
                            backgroundColor: selectedPosts.includes(b._id) ? '#e3f2fd' : 'inherit',
                            cursor: isMultiSelectMode ? 'pointer' : 'default'
                        }}
                        onClick={() => isMultiSelectMode && handlePostSelection(b._id)}
                    >
                        {isMultiSelectMode && (
                            <td style={{ textAlign: 'center' }}>
                                <input
                                    type="checkbox"
                                    checked={selectedPosts.includes(b._id)}
                                    onChange={() => handlePostSelection(b._id)}
                                    style={{ cursor: 'pointer' }}
                                />
                            </td>
                        )}
                        <td>{index + 1}</td>
                        <td>{b.title}</td>
                        <td>{b.user_id?.name || b.user_id?.username || "Ẩn danh"}</td>
                        <td>{b.category_id?.name || "Không có"}</td>
                        <td>{formatDate(b.date_published)}</td>
                        <td style={{
                            color: b.status ? 'green' : 'orange',
                            fontWeight: 'bold'
                        }}>
                            {b.status ? '✓ Đã đăng' : '⌛ Chưa đăng'}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default BlogAdmin;
