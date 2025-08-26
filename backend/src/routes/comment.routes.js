import express from "express";

import {addComment,getAllComment,updateComment,deleteComment} from "../controllers/Comment.controllers.js";

const router = express.Router();
router.put("/:comment_id", updateComment);
router.delete("/:comment_id", deleteComment);
router.get("/:post_id", getAllComment);
router.post("/", addComment);

export default router;