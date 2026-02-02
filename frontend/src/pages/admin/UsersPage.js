import React, { useState, useEffect } from "react";
import "../../layouts/AdminLayout.css";
import { getAllUsers } from "../../Services/userService";
import { adminService } from "../../Services/adminService";
import UserModal from "./components/UserModal";

const UserPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAction, setCurrentAction] = useState('create'); // 'create' or 'edit'
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers();
            // Backend trả về { users: [...] }
            const usersData = data.users || [];
            setUsers(usersData);
            setFilteredUsers(usersData);
        } catch (err) {
            console.error("Lỗi khi lấy danh sách user:", err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Hàm tìm kiếm và filter
    const handleSearch = () => {
        setIsSearching(true);

        let results = users.filter(user => {
            const matchesSearch = !searchQuery ||
                user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesRole = !selectedRole || user.role === selectedRole;
            const matchesStatus = selectedStatus === '' || user.status === (selectedStatus === 'active');

            return matchesSearch && matchesRole && matchesStatus;
        });

        setFilteredUsers(results);
        setIsSearching(false);
    };

    // Xử lý thay đổi từ khóa tìm kiếm
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Xử lý thay đổi role
    const handleRoleChange = (e) => {
        setSelectedRole(e.target.value);
    };

    // Xử lý thay đổi trạng thái
    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    // Xóa tất cả filter
    const clearFilters = () => {
        setSearchQuery('');
        setSelectedRole('');
        setSelectedStatus('');
        setFilteredUsers(users);
    };

    // Tự động tìm kiếm khi có thay đổi
    useEffect(() => {
        handleSearch();
    }, [searchQuery, selectedRole, selectedStatus, users]);

    // --- CRUD Handlers ---

    const handleCreateClick = () => {
        setCurrentAction('create');
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (user) => {
        setCurrentAction('edit');
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (userId) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.")) {
            try {
                await adminService.deleteUser(userId);
                alert("Xóa thành công!");
                fetchUsers(); // Reload list
            } catch (error) {
                console.error("Delete failed:", error);
                alert("Xóa thất bại: " + error.message);
            }
        }
    };

    const handleModalSubmit = async (formData) => {
        try {
            if (currentAction === 'create') {
                await adminService.createUser(formData);
                alert("Tạo người dùng thành công!");
            } else {
                await adminService.updateUser(selectedUser.id || selectedUser._id, formData);
                alert("Cập nhật người dùng thành công!");
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error("Operation failed:", error);
            alert((currentAction === 'create' ? "Tạo" : "Cập nhật") + " thất bại: " + error.message);
        }
    };

    return (
        <div className="admin-page">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className="page-title" style={{ margin: 0 }}>Danh sách người dùng</h2>
                <button
                    className="btn-create-user"
                    onClick={handleCreateClick}
                    style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    ➕ Thêm mới
                </button>
            </div>

            {/* Search and Filter Section */}
            <div className="admin-search-section">
                <div className="search-filters">
                    {/* Search Input */}
                    <div className="search-input-group">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="🔍 Tìm theo tên hoặc email..."
                            className="admin-search-input"
                        />
                    </div>

                    {/* Role Filter */}
                    <div className="filter-group">
                        <select
                            value={selectedRole}
                            onChange={handleRoleChange}
                            className="admin-filter-select"
                        >
                            <option value="">Tất cả vai trò</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="moderator">Moderator</option>
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div className="filter-group">
                        <select
                            value={selectedStatus}
                            onChange={handleStatusChange}
                            className="admin-filter-select"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="active">Active</option>
                            <option value="banned">Banned</option>
                        </select>
                    </div>

                    {/* Clear Filters Button */}
                    <button
                        onClick={clearFilters}
                        className="clear-filters-btn"
                        disabled={!searchQuery && !selectedRole && selectedStatus === ''}
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

                {(searchQuery || selectedRole || selectedStatus !== '') && (
                    <div className="search-results-info">
                        <span className="results-count">
                            Hiển thị {filteredUsers.length} / {users.length} người dùng
                        </span>
                        {filteredUsers.length === 0 && (
                            <span className="no-results">
                                Không tìm thấy kết quả nào
                            </span>
                        )}
                    </div>
                )}
            </div>

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
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((u, index) => (
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
                                <td>
                                    <div className="action-buttons" style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => handleEditClick(u)}
                                            style={{
                                                backgroundColor: '#ffc107',
                                                border: 'none',
                                                padding: '5px 10px',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                            title="Sửa"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(u.id || u._id)}
                                            style={{
                                                backgroundColor: '#dc3545',
                                                border: 'none',
                                                padding: '5px 10px',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                color: 'white'
                                            }}
                                            title="Xóa"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={selectedUser}
                isEditing={currentAction === 'edit'}
            />
        </div>
    );
};

export default UserPage;
