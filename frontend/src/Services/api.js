// src/services/api.js
import axios from 'axios';

// Tạo một instance của axios với cấu hình mặc định
const api = axios.create({
    baseURL: 'https://localhost:5000/api/',  // URL gốc của API backend
    headers: {
        'Content-Type': 'application/json',
    },
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
        const response = await api.post(endpoint, data);
        return response.data;
    } catch (error) {
        console.error("Error posting data:", error);
        throw error;
    }
};

// Các API khác như PUT, DELETE có thể viết tương tự
