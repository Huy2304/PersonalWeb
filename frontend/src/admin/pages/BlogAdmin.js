import React, { useState, useEffect } from "react";
import "../AdminLayout.css";
import { getAllPost, deletePost } from "../../Services/BlogService.js";

const BlogAdmin = () => {
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedAuthor, setSelectedAuthor] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [isSearching, setIsSearching] = useState(false);

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
                    <th>STT</th>
                    <th>Tiêu đề</th>
                    <th>Tác giả</th>
                    <th>Danh mục</th>
                    <th>Trạng thái</th>
                    <th>Ngày đăng</th>
                </tr>
                </thead>
                <tbody>
                {filteredBlogs.map((b, index) => (
                    <tr key={b._id || index}>
                        <td>{index + 1}</td> {/* STT thay cho ID */}
                        <td>{b.title}</td>
                        <td>{b.user_id?.name || b.user_id?.username || "Ẩn danh"}</td>
                        <td>{b.category_id?.name || "Không có"}</td>
                        <td>{b.status ? "Đã duyệt" : "Chưa duyệt"}</td>
                        <td>{formatDate(b.date_published)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default BlogAdmin;
