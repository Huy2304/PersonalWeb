import React, { useState, useEffect } from "react";
import "../AdminLayout.css";

const CheckAdmin = () => {
    const [bannedUsers, setBannedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = process.env.REACT_APP_API_URL; // CRA

    useEffect(() => {
        // Fetch banned users
        const fetchBannedUsers = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('adminToken');
                const response = await fetch(`${API_URL}/api/admin/users`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch banned users');
                }

                const users = await response.json();
                // Filter out only banned users
                const banned = users.filter(user => user.isBanned);
                setBannedUsers(banned);
            } catch (err) {
                console.error("Error fetching banned users:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBannedUsers();
    }, []);

    const handleUnban = async (userId) => {
        if (!window.confirm('Bạn có chắc muốn gỡ lệnh cấm cho người dùng này?')) {
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/api/admin/unban/${userId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to unban user');
            }

            // Remove user from the banned users list
            setBannedUsers(bannedUsers.filter(user => user._id !== userId));
            alert('Đã gỡ lệnh cấm thành công!');
        } catch (err) {
            console.error("Error unbanning user:", err);
            alert(`Lỗi: ${err.message}`);
        }
    };

    if (loading) {
        return <div className="admin-page"><p>Đang tải dữ liệu...</p></div>;
    }

    if (error) {
        return <div className="admin-page"><p>Lỗi: {error}</p></div>;
    }

    return (
        <div className="admin-page">
            <h2 className="page-title">🚫 Quản lý tài khoản bị cấm</h2>

            {bannedUsers.length === 0 ? (
                <div className="empty-state">
                    <p>Không có tài khoản nào đang bị cấm.</p>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table className="user-table">
                        <thead>
                        <tr>
                            <th>Email</th>
                            <th>Username</th>
                            <th>Lý do cấm</th>
                            <th>Thời hạn cấm</th>
                            <th>Spam Score</th>
                            <th>Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {bannedUsers.map((user) => (
                            <tr key={user._id}>
                                <td>{user.email}</td>
                                <td>{user.username}</td>
                                <td>{user.banReason || 'Vi phạm quy định'}</td>
                                <td>
                                    {user.banUntil
                                        ? new Date(user.banUntil).toLocaleString()
                                        : 'Vĩnh viễn'}
                                </td>
                                <td>{user.spamScore}</td>
                                <td>
                                    <button
                                        className="btn-approve"
                                        onClick={() => handleUnban(user._id)}
                                    >
                                        Gỡ cấm
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CheckAdmin;
