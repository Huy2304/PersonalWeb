import React, { useState } from "react";
import "../AdminLayout.css";

const CheckAdmin = () => {
    const [posts, setPosts] = useState([
        { id: 1, title: "Bài viết A", author: "Nguyen Van A", status: "Pending" },
        { id: 2, title: "Bài viết B", author: "Tran Thi B", status: "Pending" },
    ]);

    const handleApprove = (id) => {
        setPosts(posts.map(p => p.id === id ? { ...p, status: "Approved" } : p));
    };

    const handleReject = (id) => {
        setPosts(posts.map(p => p.id === id ? { ...p, status: "Rejected" } : p));
    };

    return (
        <div className="admin-page">
            <h2 className="page-title">Duyệt bài viết</h2>

            <table className="user-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Tiêu đề</th>
                    <th>Tác giả</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                </tr>
                </thead>
                <tbody>
                {posts.map((p) => (
                    <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.title}</td>
                        <td>{p.author}</td>
                        <td
                            className={
                                p.status === "Approved"
                                    ? "status-active"
                                    : p.status === "Rejected"
                                        ? "status-banned"
                                        : ""
                            }
                        >
                            {p.status}
                        </td>
                        <td>
                            {p.status === "Pending" && (
                                <>
                                    <button className="btn-approve" onClick={() => handleApprove(p.id)}>Duyệt</button>
                                    <button className="btn-reject" onClick={() => handleReject(p.id)}>Từ chối</button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default CheckAdmin;
