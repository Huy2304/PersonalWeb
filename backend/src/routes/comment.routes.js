import express from "express";

import {addComment,getAllComment,updateComment,deleteComment} from "../controllers/Comment.controllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { commentRateLimit, checkUserBanStatus } from "../middleware/rateLimitMiddleware.js";
import { validateCommentContent } from "../middleware/contentValidation.js";

const router = express.Router();
router.put("/:comment_id", updateComment);
router.delete("/:comment_id", deleteComment);
router.get("/:post_id", getAllComment);
router.post("/", authMiddleware, checkUserBanStatus, validateCommentContent, commentRateLimit, addComment);

export default router;