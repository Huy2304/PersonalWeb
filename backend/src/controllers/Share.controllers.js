import express from "express";
import mongoose from "mongoose";

import Share from "../models/Share.js";
import Post from "../models/Post.js";

 const router = express.Router();

export const sharePost = async (req, res) => {
    const { post_id, user_id, platform, message, visibility } = req.body;  // Truy xuất đúng post_id

    // Kiểm tra xem post_id có tồn tại trong body không
    if (!post_id) {
        return res.status(400).send("post_id không được để trống.");
    }

    // Kiểm tra nếu post_id là ObjectId hợp lệ
    if (!mongoose.Types.ObjectId.isValid(post_id)) {
        return res.status(400).send("post_id không hợp lệ.");
    }

    try {
        const post = await Post.findById(post_id);  // Sử dụng post_id đúng
        if (!post) {
            return res.status(404).send("Bài viết không tồn tại.");
        }

        // Tạo bản ghi chia sẻ trong cơ sở dữ liệu
        const share = new Share({
            post_id: post_id,
            user_id: user_id,
            message: message,
            platform: platform,
            visibility: visibility,
        });

        await share.save();

        // Cập nhật số lượt chia sẻ cho bài viết
        await Post.findByIdAndUpdate(post_id, {
            $inc: { shares_count: 1 }  // Tăng số lượng chia sẻ
        });

        res.status(200).send({ message: "Bài viết đã được chia sẻ!", share });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: err.message });
    }
};


export const getAllShares = async (req, res) => {
    const { user_id } = req.params;
    try {
        const shares = await Share.find({ user_id })
            .populate("post_id", "title post")  // Lấy thông tin bài viết (title, post)
            .populate("user_id", "name")  // Lấy thông tin người chia sẻ
            .populate({
                path: "post_id",
                populate: { path: "user_id", select: "name" }  // Lấy thông tin người tạo bài viết từ Post
            })
            .sort({ created_at: -1 });  // Sắp xếp theo thời gian chia sẻ (mới nhất trước)

        if (!shares.length) {
            return res.status(404).send("Không có bài viết chia sẻ nào.");
        }

        res.status(200).json(shares);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};


export const deleteSharePost = async (req, res) => {
    const { share_id } = req.params;
    try {
        const share = await Share.findById(share_id);
        if (!share) {
            return res.status(404).send("Không tìm thấy chia sẻ này.");
        }

        // Xóa bản ghi chia sẻ
        await Share.findByIdAndDelete(share_id);

        // Cập nhật số lượt chia sẻ cho bài viết
        await Post.findByIdAndUpdate(share.post_id, {
            $inc: { shares_count: -1 }  // Giảm số lượng chia sẻ
        });

        res.status(200).send({ message: "Đã xóa bài viết chia sẻ thành công!" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};


export const updateSharePost = async (req, res) => {
    const { share_id, message, visibility } = req.body;

    // Kiểm tra ObjectId hợp lệ
    if (!mongoose.Types.ObjectId.isValid(share_id)) {
        return res.status(400).send({ message: "ID chia sẻ không hợp lệ" });
    }

    // Tạo đối tượng cập nhật, chỉ cập nhật trường có giá trị
    const updateShare = {};
    if (message) updateShare.message = message;
    if (visibility) updateShare.visibility = visibility;

    if (Object.keys(updateShare).length === 0) {
        return res.status(400).send({ message: "Cần cung cấp ít nhất một trường để cập nhật." });
    }

    try {
        // Cập nhật bản ghi chia sẻ
        const data = await Share.findByIdAndUpdate(share_id, updateShare, { new: true });

        if (!data) {
            return res.status(404).send({ message: "Không tìm thấy chia sẻ để cập nhật." });
        }

        res.status(200).json({ message: "Đã thay đổi thành công", data });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};


 export default router;