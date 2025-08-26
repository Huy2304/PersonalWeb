// services/comment.service.js
import mongoose from "mongoose";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

const oid = (id)=>{ if(!mongoose.Types.ObjectId.isValid(id)){const e=new Error("ID không hợp lệ");e.status=400;throw e;} return id; };

export async function addComment({ post_id, user_id, parent_id, content, created_at }) {
    oid(post_id);
    const c = await Comment.create({ post_id, user_id, parent_id, content, created_at });
    await Post.findByIdAndUpdate(post_id, { $inc: { comments_count: 1 } });
    return c;
}

export async function listCommentsByPost(post_id, { page=1, limit=50 } = {}) {
    oid(post_id);
    return Comment.find({ post_id })
        .sort({ created_at: -1, _id: -1 })
        .skip((page-1)*limit).limit(limit)
        .lean();
}

export async function updateComment(comment_id, { content, created_at }) {
    const doc = await Comment.findByIdAndUpdate(
        oid(comment_id),
        { $set: { ...(content!==undefined&&{content}), ...(created_at!==undefined&&{created_at}) } },
        { new: true }
    );
    if (!doc) { const e=new Error("Không tìm thấy"); e.status=404; throw e; }
    return doc;
}

export async function deleteComment(comment_id) {
    const c = await Comment.findByIdAndDelete(oid(comment_id));
    if (!c) { const e=new Error("Không tìm thấy"); e.status=404; throw e; }
    await Post.findByIdAndUpdate(c.post_id, { $inc: { comments_count: -1 } });
    return { message: "Đã xóa" };
}
