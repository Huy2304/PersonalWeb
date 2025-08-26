import User from "../models/User.js";  // Import mô hình User
import Follow from "../models/Follow.js";  // Import mô hình Follow

export const getProfile = async (req, res) => {
    const { userId } = req.params;  // Lấy ID người dùng từ tham số URL

    try {
        // Tìm người dùng theo userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: "Người dùng không tồn tại." });
        }

        // Lấy danh sách người theo dõi và người mà người dùng đang theo dõi
        const following = await Follow.countDocuments({ follower_id: userId });  // Số lượng người mà người dùng đang theo dõi
        const followers = await Follow.countDocuments({ following_id: userId });  // Số lượng người theo dõi người dùng

        // Trả về thông tin người dùng
        res.status(200).json({
            user: {
                username: user.username,
                name: user.name,
                email: user.email,
                role: user.role,
                follow: following,  // Số người đang theo dõi
                follower: followers,  // Số người theo dõi
                status: user.status,
                created_at: user.created_at
            }
        });
    } catch (err) {
        res.status(500).send({ message: "Có lỗi xảy ra." });
    }
};

export const updateProfile = async (req, res) => {
    const { userId } = req.params; // Lấy userId từ params
    const { username, name, email, role } = req.body; // Lấy các thông tin cần cập nhật

    try {
        // Tìm người dùng theo userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: "Người dùng không tồn tại." });
        }

        // Cập nhật thông tin người dùng
        user.username = username || user.username;
        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;

        // Lưu lại người dùng đã cập nhật
        await user.save();

        // Trả về thông tin người dùng sau khi cập nhật
        res.status(200).json({
            message: "Cập nhật thành công!",
            user: {
                username: user.username,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });
    } catch (err) {
        res.status(500).send({ message: "Có lỗi xảy ra khi cập nhật." });
    }
};
export const deleteProfile = async (req, res) => {
    const { userId } = req.params; // Lấy userId từ params

    try {
        // Tìm người dùng theo userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: "Người dùng không tồn tại." });
        }

        // Xóa các mối quan hệ theo dõi của người dùng (xóa tất cả follow và follower của người dùng)
        await Follow.deleteMany({ $or: [{ follower_id: userId }, { following_id: userId }] });

        // Xóa người dùng
        await User.findByIdAndDelete(userId);

        res.status(200).send({ message: "Người dùng đã bị xóa thành công." });
    } catch (err) {
        res.status(500).send({ message: "Có lỗi xảy ra khi xóa người dùng." });
    }
};

