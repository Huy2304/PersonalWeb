import express from "express";
import { toggleFollow } from "../controllers/Follow.controllers.js";

const router = express.Router();

// Route để follow/unfollow người dùng
router.post("/", toggleFollow);

export default router;
