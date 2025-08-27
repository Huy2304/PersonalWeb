import React, { useState, useEffect } from "react";
import "../AdminLayout.css";
import { getAllUsers } from "../../Services/userService.js";

const UserPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
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

    return (
        <div className="admin-page">
            <h2 className="page-title">Danh sách người dùng</h2>

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
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserPage;
