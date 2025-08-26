import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
    content: { type: String, required: true },
    is_anonymous: { type: Boolean, default: false }, // true = ẩn danh, false = hiển thị tên
    created_at: { type: Date, default: Date.now }
});

export default mongoose.model("Comment", commentSchema);
  