// services/share.service.js
import mongoose from "mongoose";
import Share from "../models/Share.js";
import Post from "../models/Post.js";
const oid=(id)=>{ if(!mongoose.Types.ObjectId.isValid(id)){const e=new Error("ID không hợp lệ"); e.status=400; throw e;} return id; };

export async function sharePost({ post_id, user_id, platform, message, visibility }) {
    oid(post_id);
    const post = await Post.findById(post_id);
    if (!post) { const e=new Error("Bài viết không tồn tại"); e.status=404; throw e; }
    const s = await Share.create({ post_id, user_id, platform, message, visibility });
    await Post.findByIdAndUpdate(post_id, { $inc: { shares_count: 1 } });
    return s;
}

export async function listSharesByUser(user_id) {
    const q = Share.find({ user_id })
        .populate("post_id", "title post")
        .populate("user_id", "name")
        .populate({ path:"post_id", populate:{ path:"user_id", select:"name" } })
        .sort({ created_at: -1 });
    const data = await q.exec();
    if (!data.length) { const e=new Error("Không có chia sẻ"); e.status=404; throw e; }
    return data;
}

export async function deleteShare(share_id) {
    const s = await Share.findById(oid(share_id));
    if (!s) { const e=new Error("Không tìm thấy chia sẻ"); e.status=404; throw e; }
    await Share.findByIdAndDelete(share_id);
    await Post.findByIdAndUpdate(s.post_id, { $inc: { shares_count: -1 } });
    return { message: "Đã xóa chia sẻ" };
}

export async function updateShare({ share_id, message, visibility }) {
    oid(share_id);
    const $set = {};
    if (message) $set.message = message;
    if (visibility) $set.visibility = visibility;
    if (!Object.keys($set).length) { const e=new Error("Thiếu dữ liệu để cập nhật"); e.status=400; throw e; }
    const doc = await Share.findByIdAndUpdate(share_id, { $set }, { new: true });
    if (!doc) { const e=new Error("Không tìm thấy"); e.status=404; throw e; }
    return { message: "Đã cập nhật", data: doc };
}
