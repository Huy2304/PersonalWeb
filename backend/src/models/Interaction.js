import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema({
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },  // Bài viết
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },  // Người tương tác
    type: { type: String, enum: ['like', 'favorite'], required: true }, // Loại tương tác (like hoặc favorite)
    created_at: { type: Date, default: Date.now }
});

interactionSchema.index({ user_id: 1, post_id: 1, type: 1 }, { unique: true }); // Đảm bảo mỗi người chỉ thích 1 lần hoặc yêu thích 1 lần cho mỗi bài viết

export default mongoose.model("Interaction", interactionSchema);

  