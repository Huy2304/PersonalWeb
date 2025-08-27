import express from "express";
import {
    getProfile,
    getAllUsers,
    updateProfile,
    deleteProfile
} from "../controllers/Profile.controllers.js"; // Import controller

const router = express.Router();

// Lấy thông tin chi tiết 1 user theo userId
router.get("/:userId", getProfile);

// Lấy danh sách tất cả user
router.get("/", getAllUsers);

// Cập nhật thông tin user
router.put("/update/:userId", updateProfile);

// Xóa user
router.delete("/delete/:userId", deleteProfile);

export default router;
