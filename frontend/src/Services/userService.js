// src/services/userService.js
import { getData, postData } from './api';

// Lấy thông tin người dùng
export const getUser = async (userId) => {
    try {
        const data = await getData(`profile/${userId}`);
        return data;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
};

export const getAllUsers = async () => {
    try{
        const data = await getData('profile');
        return data;
    }catch(error){
        console.error("Error fetching user:", error);
    }
}

// Đăng ký người dùng mới
export const createUser = async (userData) => {
    try {
        const data = await postData('users', userData);
        return data;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};
