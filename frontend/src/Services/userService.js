// src/services/userService.js
import { getData, postData, putData } from './api';

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

// Cập nhật thông tin profile
export const updateProfile = async (userId, profileData) => {
    try {
        return await putData(`profile/update/${userId}`, profileData);
    } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
    }
};

// Đổi mật khẩu
export const changePassword = async (passwordData) => {
    try {
        return await postData('auth/change-password', passwordData);
    } catch (error) {
        console.error("Error changing password:", error);
        throw error;
    }
};