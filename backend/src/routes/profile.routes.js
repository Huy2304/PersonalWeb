import express from "express";
import { getProfile, updateProfile, deleteProfile } from "../controllers/Profile.controllers.js"; // Import controller

const router = express.Router();

router.get("/:userId", getProfile);
// Route để cập nhật thông tin người dùng
router.put("/update/:userId", updateProfile);
// Route để xóa người dùng
router.delete("/delete/:userId", deleteProfile);

export default router;
