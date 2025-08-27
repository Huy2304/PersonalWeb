// src/services/userService.js
import { getData, postData } from './api';

// Lấy thông tin người dùng
export const getUser = async (userId) => {
    try {
        return await getData(`profile/${userId}`);
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
};

export const getAllUsers = async () => {
    try{
        return await getData('profile');
    }catch(error){
        console.error("Error fetching user:", error);
        throw error;
    }
}

// Đăng ký người dùng mới
export const createUser = async (userData) => {
    try {
        return await postData('users', userData);
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};
