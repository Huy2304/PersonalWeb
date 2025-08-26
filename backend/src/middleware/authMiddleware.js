import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Không có token, truy cập bị từ chối' });
        }

        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-for-blog-project-2024');

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'Token không hợp lệ' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        res.status(401).json({ message: 'Token không hợp lệ', error: error.message });
    }
};