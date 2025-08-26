import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true, maxlength: 255 },
    post: { type: String, required: true },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    img_path: { type: String },
    status: { type: Boolean, default: false }, // false = for review, true = published
    likes_count: { type: Number, default: 0 }, // Tổng số lượt like
    favorites_count: { type: Number, default: 0 }, // Tổng số lượt favorite
    shares_count: { type: Number, default: 0 },
    comments_count: { type: Number, default: 0 },
    date_updated: { type: Date },
    date_published: { type: Date }
});

export default mongoose.model("Post", postSchema);
