// Admin API Service với token authentication

const API_BASE_URL = 'http://localhost:5000/api';

// Helper function để lấy admin token
const getAdminToken = () => {
    return localStorage.getItem('adminToken');
};

// Helper function để tạo headers với token
const getAuthHeaders = () => {
    const token = getAdminToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

// Generic function để gọi API với error handling
const apiCall = async (url, options = {}) => {
    try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers: {
                ...getAuthHeaders(),
                ...options.headers
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Admin API call failed:', error);
        
        // Nếu token hết hạn hoặc không hợp lệ, logout
        if (error.message.includes('Token') || error.message.includes('401')) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            window.location.reload();
        }
        
        throw error;
    }
};

// Admin User Management
export const adminService = {
    // User management
    async getUsers() {
        return apiCall('/admin/users');
    },

    async banUser(userId) {
        return apiCall(`/admin/ban/${userId}`, {
            method: 'POST'
        });
    },

    async unbanUser(userId) {
        return apiCall(`/admin/unban/${userId}`, {
            method: 'POST'
        });
    },

    async getHighSpamUsers() {
        return apiCall('/admin/spam-users');
    },

    async resetSpamScore(userId) {
        return apiCall(`/admin/users/${userId}/reset-spam`, {
            method: 'POST'
        });
    },

    // Post management
    async getPendingPosts() {
        return apiCall('/admin/pending-posts');
    },

    async approvePost(postId) {
        return apiCall(`/admin/posts/${postId}/approve`, {
            method: 'POST'
        });
    },

    async rejectPost(postId) {
        return apiCall(`/admin/posts/${postId}/reject`, {
            method: 'POST'
        });
    },

    // Statistics
    async getSpamStats() {
        return apiCall('/admin/spam-stats');
    },

    async getDashboardStats() {
        return apiCall('/admin/dashboard-stats');
    },

    // Test admin connection
    async testConnection() {
        return apiCall('/admin/test');
    }
};

export default adminService;

