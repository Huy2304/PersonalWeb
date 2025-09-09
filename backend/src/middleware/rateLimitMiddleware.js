import rateLimit from 'express-rate-limit';
import User from '../models/User.js';

// Rate limiting cho tạo bài viết
export const postRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 5, // Giới hạn 5 bài viết mỗi giờ
  message: {
    message: 'Bạn đã đăng quá nhiều bài viết. Vui lòng thử lại sau 1 giờ.',
    retryAfter: 3600
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Sử dụng IP address làm key, xử lý cả IPv4 và IPv6
    return req.ip || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket?.remoteAddress || 'unknown';
  },
  skip: async (req) => {
    // Admin không bị giới hạn
    return req.user?.role === 'admin';
  }
});

// Rate limiting cho comment 
export const commentRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 20, // 20 comment mỗi 15 phút
  message: {
    message: 'Bạn đã bình luận quá nhiều. Vui lòng thử lại sau 15 phút.',
    retryAfter: 900
  },
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket?.remoteAddress || 'unknown';
  },
  skip: async (req) => {
    return req.user?.role === 'admin';
  }
});

// Rate limiting chung cho API
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // 100 requests mỗi 15 phút
  message: {
    message: 'Quá nhiều requests. Vui lòng thử lại sau.',
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket?.remoteAddress || 'unknown';
  }
});

// Middleware kiểm tra user bị cấm
export const checkUserBanStatus = async (req, res, next) => {
  try {
    if (!req.user) {
      return next();
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User không tồn tại' });
    }

    // Kiểm tra nếu user bị cấm
    if (user.isBanned) {
      const banReason = user.banReason || 'Vi phạm quy định cộng đồng';
      const banUntil = user.banUntil;
      
      if (banUntil && new Date() > banUntil) {
        // Hết thời gian cấm, bỏ cấm user
        await User.findByIdAndUpdate(user._id, {
          isBanned: false,
          banReason: null,
          banUntil: null
        });
        return next();
      }
      
      return res.status(403).json({ 
        message: `Tài khoản của bạn đã bị cấm. Lý do: ${banReason}`,
        banUntil: banUntil
      });
    }

    next();
  } catch (error) {
    console.error('Error checking user ban status:', error);
    res.status(500).json({ message: 'Lỗi server khi kiểm tra trạng thái user' });
  }
};

