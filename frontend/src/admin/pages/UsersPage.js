import React, { useState, useEffect } from "react";
import "../AdminLayout.css";
import { getAllUsers } from "../../Services/userService.js";

const UserPage = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers();
                // Backend trả về { users: [...] }
                setUsers(data.users || []);
            } catch (err) {
                console.error("Lỗi khi lấy danh sách user:", err);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="admin-page">
            <h2 className="page-title">Danh sách người dùng</h2>

            <div className="table-wrapper">
                <table className="user-table">
                    <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Trạng thái</th>
                        <th>Role</th>
                        <th>Theo dõi</th>
                        <th>Người theo dõi</th>
                        <th>Ngày tham gia</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((u, index) => (
                        <tr key={u.id}>
                            <td>{index + 1}</td>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td
                                className={u.status ? "status-active" : "status-banned"}
                            >
                                {u.status ? "Active" : "Banned"}
                            </td>
                            <td>{u.role}</td>
                            <td>{u.follow}</td>
                            <td>{u.follower}</td>
                            <td>{new Date(u.created_at).toLocaleDateString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserPage;
