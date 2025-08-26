// services/notification.service.js
import mongoose from "mongoose";
import Notification from "../models/Notification.js";

const oid=(id)=>{ if(!mongoose.Types.ObjectId.isValid(id)){const e=new Error("ID không hợp lệ"); e.status=400; throw e;} return id; };

export async function addNotification({ user_id, type, data }) {
    return Notification.create({ user_id, type, data });
}

export async function deleteNotification(id) {
    const ok = await Notification.findByIdAndDelete(oid(id));
    if (!ok) { const e=new Error("Không tồn tại"); e.status=404; throw e; }
    return { message: "Đã xóa thành công" };
}

export async function listNotificationsByUser(user_id) {
    return Notification.find({ user_id }).sort({ _id: -1 }).lean();
}

export async function getNotificationById(id) {
    const doc = await Notification.findById(oid(id)).lean();
    if (!doc) { const e=new Error("Không tìm thấy"); e.status=404; throw e; }
    return doc;
}
