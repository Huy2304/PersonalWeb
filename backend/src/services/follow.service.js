// services/follow.service.js
import Follow from "../models/Follow.js";
import User from "../models/User.js";

export async function toggleFollow({ followerId, followingId }) {
    if (followerId === followingId) { const e=new Error("Không thể theo dõi chính mình"); e.status=400; throw e; }

    const existing = await Follow.findOne({ follower_id: followerId, following_id: followingId });
    if (existing) {
        await Follow.findByIdAndDelete(existing._id);
        await User.findByIdAndUpdate(followerId,  { $inc: { follow: -1 } });
        await User.findByIdAndUpdate(followingId, { $inc: { follower: -1 } });
        return { message: "Đã bỏ theo dõi" };
    } else {
        await Follow.create({ follower_id: followerId, following_id: followingId });
        await User.findByIdAndUpdate(followerId,  { $inc: { follow: 1 } });
        await User.findByIdAndUpdate(followingId, { $inc: { follower: 1 } });
        return { message: "Đã theo dõi" };
    }
}
