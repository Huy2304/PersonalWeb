// routes/blogPosts.routes.js
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

import {register, login, forgotPassword, resetPassword, changePassword} from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", authMiddleware, changePassword);

export default router;