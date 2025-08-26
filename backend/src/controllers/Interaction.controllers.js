import Interaction from "../models/Interaction.js";
import Post from "../models/Post.js";
import express from "express";
const router = express.Router();

export const toggleInteraction = async (req, res) => {
    const { postId, userId, type } = req.body; // `type` có thể là "like" hoặc "favorite"

    try {
        // Kiểm tra nếu loại tương tác hợp lệ
        if (!['like', 'favorite'].includes(type)) {
            return res.status(400).send({ message: "Loại tương tác không hợp lệ" });
        }

        // Kiểm tra xem người dùng đã tương tác với bài viết chưa
        const existingInteraction = await Interaction.findOne({ post_id: postId, user_id: userId, type });

        if (existingInteraction) {
            // Nếu đã tương tác, xóa
            await Interaction.findByIdAndDelete(existingInteraction._id);

            // Giảm số lượt like/favorite của bài viết
            if (type === 'like') {
                await Post.findByIdAndUpdate(postId, { $inc: { likes_count: -1 } });
            } else {
                await Post.findByIdAndUpdate(postId, { $inc: { favorites_count: -1 } });
            }

            return res.status(200).send({ message: `Đã hủy ${type} bài viết.` });
        } else {
            // Nếu chưa tương tác, tạo mới
            const newInteraction = new Interaction({
                post_id: postId,
                user_id: userId,
                type
            });

            await newInteraction.save();

            // Tăng số lượt like/favorite của bài viết
            if (type === 'like') {
                await Post.findByIdAndUpdate(postId, { $inc: { likes_count: 1 } });
            } else {
                await Post.findByIdAndUpdate(postId, { $inc: { favorites_count: 1 } });
            }

            return res.status(200).send({ message: `Đã ${type} bài viết.` });
        }
    } catch (err) {
        res.status(500).send({ message: "Có lỗi xảy ra." });
    }
};

export default router;
