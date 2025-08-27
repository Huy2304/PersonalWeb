import express from "express";
import {
  getHighSpamUsers,
  banUser,
  unbanUser,
  getPendingPosts,
  approvePost,
  rejectPost,
  getSpamStats,
  resetSpamScore
} from "../controllers/Admin.controllers.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Middleware kiểm tra quyền admin
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Chỉ admin mới có quyền truy cập' });
  }
  next();
};

// Áp dụng auth middleware cho tất cả routes
router.use(authMiddleware);
router.use(adminOnly);

// User management
router.get("/spam-users", getHighSpamUsers);
router.post("/ban/:userId", banUser);
router.post("/unban/:userId", unbanUser);
router.post("/reset-spam/:userId", resetSpamScore);

// Post moderation
router.get("/pending-posts", getPendingPosts);
router.post("/approve-post/:postId", approvePost);
router.delete("/reject-post/:postId", rejectPost);

// Statistics
router.get("/spam-stats", getSpamStats);

export default router;

