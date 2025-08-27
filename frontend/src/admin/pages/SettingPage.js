import React, { useState, useEffect } from "react";
import "../AdminLayout.css";
import { useTheme } from "../context/ThemeContext";

const SettingsPage = () => {
    const { darkMode, toggleTheme } = useTheme();
    const [settings, setSettings] = useState({
        siteName: 'Personal Blog',
        siteDescription: 'Trang blog cá nhân chia sẻ kiến thức và kinh nghiệm',
        postsPerPage: 10,
        allowComments: true,
        requireApproval: true,
        allowRegistration: true,
        maintenanceMode: false,
        emailNotifications: true,
        autoBackup: false
    });

    const [saved, setSaved] = useState(false);

    const handleInputChange = (field, value) => {
        setSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        // TODO: Implement API call to save settings
        localStorage.setItem('adminSettings', JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    useEffect(() => {
        // Load settings from localStorage or API
        const savedSettings = localStorage.getItem('adminSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    return (
        <div className="admin-page">
            <h2 className="page-title">⚙️ Cài đặt hệ thống</h2>

            {/* Website Settings */}
            <div className="settings-card">
                <div className="setting-section">
                    <h3>🌐 Cài đặt website</h3>
                    
                    <div className="setting-item">
                        <label>Tên website:</label>
                        <input
                            type="text"
                            className="admin-filter-input"
                            value={settings.siteName}
                            onChange={(e) => handleInputChange('siteName', e.target.value)}
                            placeholder="Nhập tên website"
                        />
                    </div>

                    <div className="setting-item">
                        <label>Mô tả website:</label>
                        <textarea
                            className="admin-filter-input"
                            rows="3"
                            value={settings.siteDescription}
                            onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                            placeholder="Nhập mô tả website"
                        />
                    </div>

                    <div className="setting-item">
                        <label>Số bài viết mỗi trang:</label>
                        <select
                            className="admin-filter-select"
                            value={settings.postsPerPage}
                            onChange={(e) => handleInputChange('postsPerPage', parseInt(e.target.value))}
                        >
                            <option value={5}>5 bài</option>
                            <option value={10}>10 bài</option>
                            <option value={15}>15 bài</option>
                            <option value={20}>20 bài</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Content Settings */}
            <div className="settings-card">
                <div className="setting-section">
                    <h3>📝 Cài đặt nội dung</h3>
                    
                    <div className="setting-item">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={settings.allowComments}
                                onChange={(e) => handleInputChange('allowComments', e.target.checked)}
                            />
                            Cho phép bình luận
                        </label>
                    </div>

                    <div className="setting-item">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={settings.requireApproval}
                                onChange={(e) => handleInputChange('requireApproval', e.target.checked)}
                            />
                            Yêu cầu duyệt bình luận
                        </label>
                    </div>

                    <div className="setting-item">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={settings.allowRegistration}
                                onChange={(e) => handleInputChange('allowRegistration', e.target.checked)}
                            />
                            Cho phép đăng ký thành viên mới
                        </label>
                    </div>
                </div>
            </div>

            {/* System Settings */}
            <div className="settings-card">
                <div className="setting-section">
                    <h3>🛠️ Cài đặt hệ thống</h3>
                    
                    <div className="setting-item">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={settings.maintenanceMode}
                                onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                            />
                            <span className="danger-text">Chế độ bảo trì (tắt website)</span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={settings.emailNotifications}
                                onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                            />
                            Gửi thông báo email
                        </label>
                    </div>

                    <div className="setting-item">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={settings.autoBackup}
                                onChange={(e) => handleInputChange('autoBackup', e.target.checked)}
                            />
                            Tự động sao lưu dữ liệu
                        </label>
                    </div>
                </div>
            </div>

            {/* Theme Settings */}
            <div className="settings-card">
                <div className="setting-section">
                    <h3>🎨 Giao diện</h3>
                    <div className="setting-item">
                        <label>Chế độ hiển thị:</label>
                        <div className="theme-toggle-container">
                            <span className="theme-status">
                                <strong>{darkMode ? "🌙 Chế độ tối" : "☀️ Chế độ sáng"}</strong>
                            </span>
                            <button
                                className="btn-toggle"
                                onClick={toggleTheme}
                            >
                                Đổi sang {darkMode ? "Sáng" : "Tối"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="settings-actions">
                <button 
                    className="btn-save"
                    onClick={handleSave}
                >
                    💾 Lưu cài đặt
                </button>
                {saved && (
                    <span className="save-success">✅ Đã lưu thành công!</span>
                )}
            </div>
        </div>
    );
};

export default SettingsPage;
