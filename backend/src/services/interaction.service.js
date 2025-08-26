// services/interaction.service.js
import Interaction from "../models/Interaction.js";
import Post from "../models/Post.js";

export async function toggleInteraction({ postId, userId, type }) {
    if (!["like","favorite"].includes(type)) { const e=new Error("Loại tương tác không hợp lệ"); e.status=400; throw e; }

    const existing = await Interaction.findOne({ post_id: postId, user_id: userId, type });
    const field = type === "like" ? "likes_count" : "favorites_count";

    if (existing) {
        await Interaction.findByIdAndDelete(existing._id);
        await Post.findByIdAndUpdate(postId, { $inc: { [field]: -1 } });
        return { message: `Đã hủy ${type}` };
    } else {
        await Interaction.create({ post_id: postId, user_id: userId, type });
        await Post.findByIdAndUpdate(postId, { $inc: { [field]: 1 } });
        return { message: `Đã ${type}` };
    }
}
