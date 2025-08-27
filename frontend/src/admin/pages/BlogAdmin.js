import React, { useState, useEffect } from "react";
import "../AdminLayout.css";

const BlogAdmin = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        // giả lập danh sách bài viết
        const data = [
            { id: 1, title: "React cơ bản", author: "Admin", date: "2023-06-01" },
            { id: 2, title: "Node.js nâng cao", author: "User A", date: "2023-07-15" },
            { id: 3, title: "Tips CSS hay", author: "User B", date: "2023-08-20" },
        ];
        setBlogs(data);
    }, []);

    return (
        <div className="admin-page">
            <h2 className="page-title">Danh sách bài viết</h2>

            <table className="user-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Tiêu đề</th>
                    <th>Tác giả</th>
                    <th>Ngày đăng</th>
                </tr>
                </thead>
                <tbody>
                {blogs.map((b) => (
                    <tr key={b.id}>
                        <td>{b.id}</td>
                        <td>{b.title}</td>
                        <td>{b.author}</td>
                        <td>{b.date}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default BlogAdmin;
