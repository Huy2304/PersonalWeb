// routes/blogPosts.routes.js
import express from "express";

import {
  getAllPosts,
  addPost,
  getSinglePost,
  updateSinglePost,
  removeSinglePost,
} from "../controllers/Posts.controllers.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { postRateLimit, checkUserBanStatus } from "../../../../../../../../xampp/htdocs/PersonalWeb/backend/src/middleware/rateLimitMiddleware.js";
import { validatePostContent } from "../../../../../../../../xampp/htdocs/PersonalWeb/backend/src/middleware/contentValidation.js";

const router = express.Router();

// Lấy tất cả bài viết
router.get("/", getAllPosts);

// Thêm bài viết mới (cần xác thực + rate limiting + kiểm tra ban + validate content)
router.post("/", authMiddleware, checkUserBanStatus, validatePostContent, postRateLimit, addPost);

// Lấy thông tin bài viết theo ID
router.get("/:id", getSinglePost);

// Cập nhật bài viết theo ID (cần xác thực)
router.patch("/:id", authMiddleware, updateSinglePost);

// Xóa bài viết theo ID (cần xác thực)
router.delete("/:id", authMiddleware, removeSinglePost);

export default router;
