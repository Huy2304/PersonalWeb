// Middleware kiểm tra và xử lý body
export const validateBody = (req, res, next) => {
    const { postId, userId, mess } = req.body;

    // Kiểm tra xem các trường cần thiết có tồn tại hay không
    if (!postId || !userId || !mess) {
        return res.status(400).json({
            message: "Thiếu trường dữ liệu. Vui lòng cung cấp postId, userId, và mess."
        });
    }

    // Kiểm tra postId là ObjectId hợp lệ (nếu cần)
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: "postId không hợp lệ." });
    }

    // Kiểm tra userId là ObjectId hợp lệ (nếu cần)
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "userId không hợp lệ." });
    }

    // Tiến hành chuyển sang middleware tiếp theo nếu mọi thứ đều hợp lệ
    next();
};
