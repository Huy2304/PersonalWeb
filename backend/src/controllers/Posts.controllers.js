//controllers/Posts.controllers.js
import express from "express";
import mongoose from "mongoose";

import Post from "../models/Post.js";

const router = express.Router();

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('user_id').populate('category_id');
    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const addPost = async (req, res) => {
  const { title, post, category_id, img_path, status, user_id, is_anonymous, is_story } = req.body;

  // Auto-moderation: Nếu user có spam score cao, tự động đặt bài viết ở trạng thái chờ duyệt
  // NHƯNG bỏ qua cho story
  let postStatus = status;
  if (req.user && req.user.role !== 'admin' && !is_story) {
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(req.user.id);

    if (user && user.spamScore >= 5) {
      postStatus = false; // Bài viết cần được duyệt trước khi xuất bản
      console.log(`Auto-moderation: Post by user ${user.email} set to pending due to high spam score (${user.spamScore})`);
    }
  }

  // Prepare post data
  const postData = {
    title,
    post,
    img_path,
    status: postStatus, // Sử dụng postStatus đã được kiểm tra
    user_id: req.user?.id || user_id, // Ưu tiên user từ token
    is_anonymous: is_anonymous || false,
    date_updated: new Date(),
    date_published: postStatus ? new Date() : null,
    is_story: is_story || false, // Đánh dấu rõ là story hay không
  };

  // Add category_id if provided and not a story
  if (category_id && !is_story) {
    postData.category_id = category_id;
  }

  const createNewPost = new Post(postData);

  try {
    await createNewPost.save();

    // Thông báo cho user về trạng thái bài viết
    const message = postStatus
        ? 'Bài viết đã được tạo và xuất bản thành công!'
        : 'Bài viết đã được tạo và đang chờ duyệt. Bài viết sẽ được hiển thị sau khi admin phê duyệt.';

    res.status(201).json({
      ...createNewPost.toObject(),
      message,
      needsModeration: !postStatus
    });
  } catch (error) {
    console.log('Error creating post:', error);
    res.status(409).json({ message: error.message });
  }
};

export const getSinglePost = async (req, res) => {
  const { id } = req.params;

  try {
    const singlePost = await Post.findById(id).populate('user_id').populate('category_id');

    if (!singlePost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(singlePost);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateSinglePost = async (req, res) => {
  const { id } = req.params;
  const { title, post, category_id, img_path, status, user_id, is_anonymous } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`Post with id: ${id} not found`);

  const updatedPost = {
    title,
    post,
    category_id,
    img_path,
    status,
    is_anonymous: is_anonymous !== undefined ? is_anonymous : false,
    date_updated: new Date(),
    date_published: status ? new Date() : null,
  };

  // Thêm user_id nếu được cung cấp (có thể là null để đặt thành Ẩn danh)
  if (user_id !== undefined) {
    updatedPost.user_id = user_id;
  }

  try {
    const result = await Post.findByIdAndUpdate(id, updatedPost, { new: true });
    if (!result) {
      return res.status(404).send("Post not found");
    }
    res.json(result);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  try {
    const post = await Post.findById(id);

    const updatedPost = await Post.findByIdAndUpdate(
        id,
        { likes_count: post.likes_count + 1 },
        { new: true }
    );

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeSinglePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`Post with id: ${id} not found`);

  try {
    console.log("=== DELETE POST REQUEST ===");
    console.log("Post ID:", id);
    console.log("User from token:", req.user);

    // Kiểm tra xem có user trong request không
    if (!req.user) {
      return res.status(401).json({ message: "Không có thông tin người dùng" });
    }

    // Tìm bài viết trước khi xóa để kiểm tra quyền
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Kiểm tra quyền: chỉ admin hoặc tác giả bài viết mới có thể xóa
    const userId = req.user.id || req.user._id;
    const isAdmin = req.user.role === 'admin';
    const isAuthor = post.user_id && userId && post.user_id.toString() === userId.toString();

    console.log("Delete post debug:", {
      userId: userId ? userId.toString() : 'undefined',
      postUserId: post.user_id ? post.user_id.toString() : 'undefined',
      isAdmin,
      isAuthor,
      userRole: req.user.role
    });

    if (!isAdmin && !isAuthor) {
      return res.status(403).json({ message: "Bạn không có quyền xóa bài viết này" });
    }

    await Post.findByIdAndDelete(id);
    res.json({ message: "Bài viết đã được xóa thành công" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: error.message });
  }
};

export default router;