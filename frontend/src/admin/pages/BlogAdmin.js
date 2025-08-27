import React, { useState, useEffect } from "react";
import "../AdminLayout.css";
import { getAllPost } from "../../Services/BlogService.js";

const BlogAdmin = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getAllPost();
                setBlogs(data.posts || data || []);
            } catch (err) {
                console.error("Lỗi khi lấy danh sách bài viết:", err);
            }
        };

        fetchPosts();
    }, []);

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

            <table className="user-table">
                <thead>
                <tr>
                    <th>STT</th>
                    <th>Tiêu đề</th>
                    <th>Tác giả</th>
                    <th>Danh mục</th>
                    <th>Ngày đăng</th>
                </tr>
                </thead>
                <tbody>
                {blogs.map((b, index) => (
                    <tr key={b._id || index}>
                        <td>{index + 1}</td> {/* STT thay cho ID */}
                        <td>{b.title}</td>
                        <td>{b.user_id?.name || b.user_id?.username || "Ẩn danh"}</td>
                        <td>{b.category_id?.name || "Không có"}</td>
                        <td>{formatDate(b.date_published)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default BlogAdmin;
