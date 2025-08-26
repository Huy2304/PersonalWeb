import express from "express";
import mongoose from "mongoose";

import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

export const addComment = async (req, res) => {
    const {post_id, user_id, parent_id, content, created_at} = req.body;

    const comment = new Comment({
        post_id,
        user_id,
        parent_id,
        content,
        created_at,
    })
    try {
        await comment.save();
        await Post.findByIdAndUpdate(post_id, { $inc: { comments_count: +1 } });
        res.status(201).json({
            success: true,
        })
    } catch (err) {
        res.status(500).json({error: err})
    }
}

export const getAllComment = async (req, res) => {
    const { post_id } = req.params;
    try {
        const data = await Comment.find({ post_id: post_id }); // Tìm tất cả bình luận của bài viết
        res.status(200).json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const deleteComment = async (req, res) => {
    const { comment_id } = req.params;
    console.log('Received comment_id:', comment_id);

    try {
        // Kiểm tra id hợp lệ
        if (!mongoose.Types.ObjectId.isValid(comment_id)) {
            return res.status(400).json({ error: "Invalid comment_id" });
        }

        // Tìm bình luận cần xóa
        const comment = await Comment.findByIdAndDelete(comment_id);

        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        // Giảm số lượng comment trong bài viết
        await Post.findByIdAndUpdate(comment.post_id, { $inc: { comments_count: -1 } });

        res.status(200).json({ data: comment, success: true, message: "Comment deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateComment = async (req, res) => {
    const { comment_id } = req.params;
    const { content, created_at } = req.body;

    if (!mongoose.Types.ObjectId.isValid(comment_id)) {
        return res.status(400).json({ error: "Invalid comment_id" });
    }

    try {
        const data = await Comment.findByIdAndUpdate(
            comment_id,
            { content, created_at },
            { new: true }
        );

        if (!data) {
            return res.status(404).json({ error: "Comment not found" });
        }

        res.status(200).json({ data, success: true, message: "Comment updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
