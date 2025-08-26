// services/profile.service.js
import User from "../models/User.js";
import Follow from "../models/Follow.js";

export async function getProfile(userId) {
    const user = await User.findById(userId).lean();
    if (!user) { const e=new Error("Người dùng không tồn tại"); e.status=404; throw e; }
    const following = await Follow.countDocuments({ follower_id: userId });
    const followers = await Follow.countDocuments({ following_id: userId });
    return {
        username: user.username, name: user.name, email: user.email, role: user.role,
        follow: following, follower: followers, status: user.status, created_at: user.created_at
    };
}

export async function updateProfile(userId, { username, name, email, role }) {
    const $set = {};
    if (username!==undefined) $set.username = username;
    if (name!==undefined) $set.name = name;
    if (email!==undefined) $set.email = email;
    if (role!==undefined) $set.role = role; // cân nhắc chỉ cho admin
    const doc = await User.findByIdAndUpdate(userId, { $set }, { new: true });
    if (!doc) { const e=new Error("Người dùng không tồn tại"); e.status=404; throw e; }
    return { message: "Cập nhật thành công", user: { username: doc.username, name: doc.name, email: doc.email, role: doc.role } };
}

export async function deleteProfile(userId) {
    const user = await User.findById(userId);
    if (!user) { const e=new Error("Người dùng không tồn tại"); e.status=404; throw e; }
    await Follow.deleteMany({ $or: [{ follower_id: userId }, { following_id: userId }] });
    await User.findByIdAndDelete(userId);
    return { message: "Đã xóa người dùng" };
}
