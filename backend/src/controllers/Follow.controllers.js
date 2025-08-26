import Follow from "../models/Follow.js";  // Mô hình follow
import User from "../models/User.js";  // Mô hình user

export const toggleFollow = async (req, res) => {
    const { followerId, followingId } = req.body;

    try {
        // Kiểm tra nếu followerId và followingId trùng nhau
        if (followerId === followingId) {
            return res.status(400).send({ message: "Không thể theo dõi chính mình." });
        }

        // Kiểm tra xem người dùng đã follow chưa
        const existingFollow = await Follow.findOne({
            follower_id: followerId,
            following_id: followingId
        });

        if (existingFollow) {
            // Nếu đã follow, xóa để unfollow
            await Follow.findByIdAndDelete(existingFollow._id);

            // Giảm số lượng người theo dõi và số người theo dõi của người dùng
            await User.findByIdAndUpdate(followerId, { $inc: { follow: -1 } });
            await User.findByIdAndUpdate(followingId, { $inc: { follower: -1 } });

            return res.status(200).send({ message: "Đã bỏ theo dõi." });
        } else {
            // Nếu chưa follow, tạo mới follow
            const newFollow = new Follow({
                follower_id: followerId,
                following_id: followingId
            });

            await newFollow.save();

            // Tăng số lượng người theo dõi và số người theo dõi của người dùng
            await User.findByIdAndUpdate(followerId, { $inc: { follow: 1 } });
            await User.findByIdAndUpdate(followingId, { $inc: { follower: 1 } });

            return res.status(200).send({ message: "Đã theo dõi." });
        }
    } catch (err) {
        res.status(500).send({ message: "Có lỗi xảy ra." });
    }
};
