import express from "express";
import mongoose from "mongoose";
import Notification from "../models/Notification.js";

const router = express.Router();

// Thêm thông báo mới
export const addNotification = async (req, res) => {
    const { user_id, type, data } = req.body;
    try {
        const newNotification = new Notification({
            user_id,
            type,
            data
        });

        await newNotification.save();
        res.status(201).send({ message: "Thành công" });
    } catch (err) {
        res.status(500).send({ error: "Oops!" });
    }
};

// Xóa thông báo
export const deleteNotification = async (req, res) => {
    const id = req.params.id;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: "ID không hợp lệ" });
        }

        const data = await Notification.findByIdAndDelete(id);
        if (!data) {
            return res.status(404).send({ message: "Thông báo không tồn tại" });
        }

        res.status(200).send({ message: "Đã xóa thành công" });
    } catch (err) {
        res.status(500).send({ error: "Oops!" });
    }
};

// Lấy tất cả thông báo của người dùng
export const getAllNotifications = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Notification.find({ user_id: id });
        res.status(200).json({ data });
    } catch (err) {
        res.status(500).send({ error: "Oops!" });
    }
};

// Lấy thông báo theo ID
export const getNotificationById = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Notification.findById(id);
        if (!data) {
            return res.status(404).send({ message: "Không tìm thấy thông báo" });
        }
        res.status(200).json({ data });
    } catch (err) {
        res.status(500).send({ error: "Oops!" });
    }
};

export default router;
