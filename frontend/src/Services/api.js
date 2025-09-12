// src/services/api.js
import axios from 'axios';


const API_URL = process.env.REACT_APP_API_URL; // CRA
// Tạo một instance của axios với cấu hình mặc định
const api = axios.create({
    baseURL: `${API_URL}/api/`,  // URL gốc của API backend
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;

// Thêm interceptor để tự động thêm token vào header
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Thực hiện GET request
export const getData = async (endpoint) => {
    try {
        const response = await api.get(endpoint);
        return response.data;  // trả về dữ liệu từ API
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;  // Ném lỗi để xử lý ở nơi gọi
    }
};

// Thực hiện POST request
export const postData = async (endpoint, data) => {
    try {
        console.log(`Making POST request to: ${api.defaults.baseURL}${endpoint}`);
        console.log('Request data:', data);
        const response = await api.post(endpoint, data);
        console.log('Response received:', response.data);
        return response.data;
    } catch (error) {
        console.error("Error posting data:", error);
        console.error("Error details:", error.response?.data || error.message);
        throw error;
    }
};

// Thực hiện PUT request
export const putData = async (endpoint, data) => {
    try {
        const response = await api.put(endpoint, data);
        return response.data;
    } catch (error) {
        console.error("Error updating data:", error);
        throw error;
    }
};

// Các API khác như DELETE có thể viết tương tự
