import React, { useState, useEffect } from 'react';
import '../../../layouts/AdminLayout.css'; // Reuse admin styles

const UserModal = ({ isOpen, onClose, onSubmit, initialData = null, isEditing = false }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
        status: true // active by default
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                email: initialData.email || '',
                password: '', // Password not shown when editing
                role: initialData.role || 'user',
                status: initialData.status !== undefined ? initialData.status : true
            });
        } else {
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'user',
                status: true
            });
        }
        setErrors({});
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleStatusChange = (e) => {
        setFormData(prev => ({
            ...prev,
            status: e.target.value === 'active'
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Tên là bắt buộc";
        if (!formData.email.trim()) newErrors.email = "Email là bắt buộc";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email không hợp lệ";

        if (!isEditing && !formData.password) newErrors.password = "Mật khẩu là bắt buộc khi tạo mới";
        if (!isEditing && formData.password && formData.password.length < 6) newErrors.password = "Mật khẩu phải ít nhất 6 ký tự";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>{isEditing ? 'Chỉnh sửa User' : 'Thêm mới User'}</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Họ và tên</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nhập tên người dùng"
                            />
                            {errors.name && <span className="error-text">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@email.com"
                                disabled={isEditing} // Prevent email change if backend uses it as ID or simply restrict it
                            />
                            {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>

                        {(!isEditing || (isEditing && formData.password)) && (
                            <div className="form-group">
                                <label>Mật khẩu {isEditing && '(Để trống nếu không đổi)'}</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder={isEditing ? "Nhập mật khẩu mới (nếu có)" : "Nhập mật khẩu"}
                                />
                                {errors.password && <span className="error-text">{errors.password}</span>}
                            </div>
                        )}

                        <div className="form-group">
                            <label>Vai trò (Role)</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="moderator">Moderator</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Trạng thái</label>
                            <select
                                name="status"
                                value={formData.status ? 'active' : 'banned'}
                                onChange={handleStatusChange}
                            >
                                <option value="active">Active</option>
                                <option value="banned">Banned</option>
                            </select>
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="btn-secondary" onClick={onClose}>Hủy</button>
                            <button type="submit" className="btn-primary">
                                {isEditing ? 'Cập nhật' : 'Tạo mới'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .modal-content {
                    background: white;
                    padding: 24px;
                    border-radius: 8px;
                    width: 500px;
                    max-width: 90%;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 10px;
                }
                .close-btn {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                }
                .form-group {
                    margin-bottom: 16px;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 500;
                }
                .form-group input, .form-group select {
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                }
                .error-text {
                    color: #dc3545;
                    font-size: 12px;
                    margin-top: 4px;
                    display: block;
                }
                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                    margin-top: 24px;
                    padding-top: 16px;
                    border-top: 1px solid #eee;
                }
                .btn-primary {
                    background-color: #007bff;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .btn-secondary {
                    background-color: #6c757d;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default UserModal;
