import React, { useState, useEffect } from "react";
import "../AdminLayout.css";

const UserPage = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Giả lập data người dùng
        const data = [
            {
                id: 1,
                name: "Nguyen Van A",
                email: "a@example.com",
                status: "Active",
                role: "Admin",
                posts: 12,
                level: 5,
                joined: "2023-01-15",
            },
            {
                id: 2,
                name: "Tran Thi B",
                email: "b@example.com",
                status: "Banned",
                role: "User",
                posts: 3,
                level: 2,
                joined: "2023-03-10",
            },
            {
                id: 3,
                name: "Le Van C",
                email: "c@example.com",
                status: "Active",
                role: "Moderator",
                posts: 7,
                level: 4,
                joined: "2022-11-25",
            },
        ];
        setUsers(data);
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
                        <th>Số bài đăng</th>
                        <th>Level</th>
                        <th>Ngày tham gia</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((u, index) => (
                        <tr key={u.id}>
                            <td>{index + 1}</td>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td className={u.status === "Banned" ? "status-banned" : "status-active"}>
                                {u.status}
                            </td>
                            <td>{u.role}</td>
                            <td>{u.posts}</td>
                            <td>{u.level}</td>
                            <td>{u.joined}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserPage;
