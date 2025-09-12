import React, { useState, useEffect } from "react";
import "../AdminLayout.css";
import { FaDownload, FaFilter, FaSync } from "react-icons/fa";

const LOG_TYPES = [
    { value: "all", label: "Tất cả" },
    { value: "auth", label: "Xác thực" },
    { value: "user", label: "Người dùng" },
    { value: "content", label: "Nội dung" },
    { value: "admin", label: "Admin" },
    { value: "system", label: "Hệ thống" }
];

const SEVERITY_LEVELS = [
    { value: "all", label: "Tất cả" },
    { value: "info", label: "Thông tin", color: "#4facfe" },
    { value: "warning", label: "Cảnh báo", color: "#feb240" },
    { value: "error", label: "Lỗi", color: "#f5576c" },
    { value: "critical", label: "Nghiêm trọng", color: "#dc3545" }
];

// Mock data cho logs
const MOCK_LOGS = [
    { 
        id: "log1",
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(), 
        type: "auth", 
        severity: "info",
        message: "Người dùng user@example.com đã đăng nhập thành công",
        details: { userId: "user123", ip: "192.168.1.1", userAgent: "Mozilla/5.0" }
    },
    { 
        id: "log2",
        timestamp: new Date(Date.now() - 10 * 60000).toISOString(), 
        type: "auth", 
        severity: "warning",
        message: "Nhiều lần đăng nhập thất bại từ IP 192.168.1.100",
        details: { attempts: 5, ip: "192.168.1.100" }
    },
    { 
        id: "log3",
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(), 
        type: "content", 
        severity: "error",
        message: "Không thể đăng bài viết ID: post123",
        details: { postId: "post123", userId: "user456", error: "Database connection failed" }
    },
    { 
        id: "log4",
        timestamp: new Date(Date.now() - 60 * 60000).toISOString(), 
        type: "admin", 
        severity: "info",
        message: "Admin đã thay đổi cấu hình hệ thống",
        details: { adminId: "admin1", changes: { allowComments: true } }
    },
    { 
        id: "log5",
        timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(), 
        type: "system", 
        severity: "critical",
        message: "Hệ thống database tạm thời không khả dụng",
        details: { duration: "5 phút", affectedServices: ["posts", "comments"] }
    },
    { 
        id: "log6",
        timestamp: new Date(Date.now() - 5 * 60 * 60000).toISOString(), 
        type: "user", 
        severity: "warning",
        message: "Người dùng user@example.com đã vượt quá giới hạn đăng bài",
        details: { userId: "user789", postCount: 25, limit: 20 }
    },
    { 
        id: "log7",
        timestamp: new Date(Date.now() - 8 * 60 * 60000).toISOString(), 
        type: "content", 
        severity: "info",
        message: "Bài viết ID: post456 đã được duyệt",
        details: { postId: "post456", approvedBy: "admin2" }
    }
];

const LogsPage = () => {
    const [logs, setLogs] = useState(MOCK_LOGS);
    const [filteredLogs, setFilteredLogs] = useState(MOCK_LOGS);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        type: "all",
        severity: "all",
        startDate: "",
        endDate: "",
        searchQuery: ""
    });
    const [selectedLog, setSelectedLog] = useState(null);

    // Xử lý thay đổi bộ lọc
    const handleFilterChange = (field, value) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);
        applyFilters(newFilters);
    };

    // Áp dụng bộ lọc
    const applyFilters = (currentFilters) => {
        let filtered = [...logs];

        // Lọc theo loại
        if (currentFilters.type !== "all") {
            filtered = filtered.filter(log => log.type === currentFilters.type);
        }

        // Lọc theo mức độ nghiêm trọng
        if (currentFilters.severity !== "all") {
            filtered = filtered.filter(log => log.severity === currentFilters.severity);
        }

        // Lọc theo ngày bắt đầu
        if (currentFilters.startDate) {
            const startDate = new Date(currentFilters.startDate);
            filtered = filtered.filter(log => new Date(log.timestamp) >= startDate);
        }

        // Lọc theo ngày kết thúc
        if (currentFilters.endDate) {
            const endDate = new Date(currentFilters.endDate);
            endDate.setHours(23, 59, 59, 999); // Đặt về cuối ngày
            filtered = filtered.filter(log => new Date(log.timestamp) <= endDate);
        }

        // Lọc theo từ khóa tìm kiếm
        if (currentFilters.searchQuery.trim()) {
            const searchLower = currentFilters.searchQuery.toLowerCase();
            filtered = filtered.filter(log => 
                log.message.toLowerCase().includes(searchLower) || 
                JSON.stringify(log.details).toLowerCase().includes(searchLower)
            );
        }

        setFilteredLogs(filtered);
    };

    // Reset bộ lọc
    const resetFilters = () => {
        const defaultFilters = {
            type: "all",
            severity: "all",
            startDate: "",
            endDate: "",
            searchQuery: ""
        };
        setFilters(defaultFilters);
        setFilteredLogs(logs);
    };

    // Xuất logs dưới dạng JSON
    const exportLogs = () => {
        const exportData = JSON.stringify(filteredLogs, null, 2);
        const blob = new Blob([exportData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `system-logs-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Làm mới logs
    const refreshLogs = () => {
        setLoading(true);
        // Ở đây sẽ là API call thực tế để lấy logs mới
        setTimeout(() => {
            setLoading(false);
            // Giả lập thêm log mới
            const newLog = {
                id: `log${logs.length + 1}`,
                timestamp: new Date().toISOString(),
                type: "system",
                severity: "info",
                message: "Logs đã được làm mới",
                details: { refreshedAt: new Date().toISOString() }
            };
            const updatedLogs = [newLog, ...logs];
            setLogs(updatedLogs);
            applyFilters({ ...filters });
        }, 1000);
    };

    // Xem chi tiết log
    const viewLogDetails = (log) => {
        setSelectedLog(log);
    };

    // Định dạng thời gian
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    // Lấy màu cho mức độ nghiêm trọng
    const getSeverityColor = (severity) => {
        const level = SEVERITY_LEVELS.find(level => level.value === severity);
        return level ? level.color : "#333";
    };

    return (
        <div className="admin-page">
            <div className="logs-header">
                <h2 className="page-title">📋 Quản lý logs hệ thống</h2>
                <div className="logs-actions">
                    <button 
                        className="btn-secondary"
                        onClick={refreshLogs}
                        disabled={loading}
                    >
                        <FaSync className={loading ? "icon-spin" : ""} /> Làm mới
                    </button>
                    <button 
                        className="btn-primary"
                        onClick={exportLogs}
                    >
                        <FaDownload /> Xuất logs
                    </button>
                </div>
            </div>
            
            <div className="admin-search-section">
                <div className="search-filters">
                    <div className="search-input-group">
                        <input
                            type="text"
                            placeholder="🔍 Tìm kiếm logs..."
                            className="admin-search-input"
                            value={filters.searchQuery}
                            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                        />
                    </div>
                    
                    <div className="filter-group">
                        <select
                            className="admin-filter-select"
                            value={filters.type}
                            onChange={(e) => handleFilterChange('type', e.target.value)}
                        >
                            {LOG_TYPES.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="filter-group">
                        <select
                            className="admin-filter-select"
                            value={filters.severity}
                            onChange={(e) => handleFilterChange('severity', e.target.value)}
                        >
                            {SEVERITY_LEVELS.map(level => (
                                <option key={level.value} value={level.value}>
                                    {level.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="filter-group">
                        <input
                            type="date"
                            className="admin-date-input"
                            value={filters.startDate}
                            onChange={(e) => handleFilterChange('startDate', e.target.value)}
                            placeholder="Từ ngày"
                        />
                    </div>
                    
                    <div className="filter-group">
                        <input
                            type="date"
                            className="admin-date-input"
                            value={filters.endDate}
                            onChange={(e) => handleFilterChange('endDate', e.target.value)}
                            placeholder="Đến ngày"
                        />
                    </div>
                    
                    <button 
                        className="clear-filters-btn"
                        onClick={resetFilters}
                        disabled={Object.values(filters).every(v => !v || v === 'all')}
                    >
                        🗑️ Xóa bộ lọc
                    </button>
                </div>
                
                <div className="search-results-info">
                    <p>Hiển thị {filteredLogs.length} kết quả {filteredLogs.length !== logs.length && `(đã lọc từ ${logs.length} logs)`}</p>
                </div>
            </div>
            
            <div className="logs-container">
                <div className="table-wrapper">
                    <table className="logs-table">
                        <thead>
                            <tr>
                                <th style={{width: '180px'}}>Thời gian</th>
                                <th style={{width: '100px'}}>Loại</th>
                                <th style={{width: '120px'}}>Mức độ</th>
                                <th>Thông tin</th>
                                <th style={{width: '80px'}}>Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.length > 0 ? (
                                filteredLogs.map((log) => (
                                    <tr key={log.id}>
                                        <td>{formatTimestamp(log.timestamp)}</td>
                                        <td>
                                            <span className="log-type">{log.type}</span>
                                        </td>
                                        <td>
                                            <span 
                                                className={`log-severity log-${log.severity}`}
                                                style={{backgroundColor: getSeverityColor(log.severity)}}
                                            >
                                                {SEVERITY_LEVELS.find(level => level.value === log.severity)?.label || log.severity}
                                            </span>
                                        </td>
                                        <td>{log.message}</td>
                                        <td>
                                            <button 
                                                className="btn-view"
                                                onClick={() => viewLogDetails(log)}
                                            >
                                                Xem
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="no-results">
                                        Không tìm thấy logs nào phù hợp với bộ lọc
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {selectedLog && (
                    <div className="log-details-modal">
                        <div className="log-details-content">
                            <div className="log-details-header">
                                <h3>Chi tiết log</h3>
                                <button 
                                    className="close-button"
                                    onClick={() => setSelectedLog(null)}
                                >
                                    ×
                                </button>
                            </div>
                            <div className="log-details-body">
                                <p><strong>Thời gian:</strong> {formatTimestamp(selectedLog.timestamp)}</p>
                                <p><strong>Loại:</strong> {selectedLog.type}</p>
                                <p>
                                    <strong>Mức độ:</strong> 
                                    <span 
                                        className={`log-severity log-${selectedLog.severity}`}
                                        style={{
                                            backgroundColor: getSeverityColor(selectedLog.severity),
                                            display: 'inline-block',
                                            marginLeft: '8px'
                                        }}
                                    >
                                        {SEVERITY_LEVELS.find(level => level.value === selectedLog.severity)?.label}
                                    </span>
                                </p>
                                <p><strong>Thông tin:</strong> {selectedLog.message}</p>
                                <div className="log-json">
                                    <strong>Chi tiết:</strong>
                                    <pre>{JSON.stringify(selectedLog.details, null, 2)}</pre>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LogsPage;
