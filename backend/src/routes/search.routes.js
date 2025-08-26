import express from 'express';
import { searchPosts } from '../controllers/Search.controllers.js';

const router = express.Router();

// Định nghĩa route tìm kiếm
router.get('/search', searchPosts);

export default router;
