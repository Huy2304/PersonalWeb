import User from '../models/User.js';
import Post from '../models/Post.js';
import bcrypt from 'bcrypt';
import Follow from '../models/Follow.js';

// Lấy tất cả users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('email username role status isBanned banReason banUntil spamScore postCount lastPostTime')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách users có spam score cao
export const getHighSpamUsers = async (req, res) => {
  try {
    const users = await User.find({
      spamScore: { $gte: 5 },
      role: { $ne: 'admin' }
    })
      .select('email username spamScore isBanned banReason banUntil postCount lastPostTime')
      .sort({ spamScore: -1 })
      .limit(50);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ban user
export const banUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason, duration } = req.body; // duration in hours

    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Chỉ admin mới có quyền ban user' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User không tồn tại' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Không thể ban admin' });
    }

    const banUntil = duration ? new Date(Date.now() + duration * 60 * 60 * 1000) : null;

    await User.findByIdAndUpdate(userId, {
      isBanned: true,
      banReason: reason || 'Vi phạm quy định cộng đồng',
      banUntil: banUntil
    });

    res.json({
      message: `User đã bị ban${duration ? ` trong ${duration} giờ` : ' vĩnh viễn'}`,
      banUntil
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unban user
export const unbanUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Chỉ admin mới có quyền unban user' });
    }

    await User.findByIdAndUpdate(userId, {
      isBanned: false,
      banReason: null,
      banUntil: null,
      spamScore: 0 // Reset spam score
    });

    res.json({ message: 'User đã được unban thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách bài viết cần kiểm duyệt
export const getPendingPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      status: false // Bài viết chưa được duyệt
    })
      .populate('user_id', 'email username spamScore')
      .populate('category_id', 'name')
      .sort({ date_updated: -1 })
      .limit(50);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Duyệt bài viết
export const approvePost = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Chỉ admin mới có quyền duyệt bài' });
    }

    const post = await Post.findByIdAndUpdate(postId, {
      status: true,
      date_published: new Date()
    }, { new: true });

    if (!post) {
      return res.status(404).json({ message: 'Bài viết không tồn tại' });
    }

    res.json({ message: 'Bài viết đã được duyệt', post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Từ chối bài viết
export const rejectPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { reason } = req.body;

    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Chỉ admin mới có quyền từ chối bài' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Bài viết không tồn tại' });
    }

    // Tăng spam score cho user
    if (post.user_id) {
      await User.findByIdAndUpdate(post.user_id, {
        $inc: { spamScore: 5 }
      });
    }

    await Post.findByIdAndDelete(postId);

    res.json({
      message: 'Bài viết đã bị từ chối và xóa',
      reason: reason || 'Vi phạm quy định cộng đồng'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thống kê spam
export const getSpamStats = async (req, res) => {
  try {
    const [
      totalUsers,
      bannedUsers,
      highSpamUsers,
      pendingPosts,
      totalPosts
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isBanned: true }),
      User.countDocuments({ spamScore: { $gte: 10 } }),
      Post.countDocuments({ status: false }),
      Post.countDocuments()
    ]);

    const recentSpamUsers = await User.find({
      spamScore: { $gte: 5 },
      role: { $ne: 'admin' }
    })
      .select('email spamScore createdAt')
      .sort({ spamScore: -1 })
      .limit(10);

    res.json({
      stats: {
        totalUsers,
        bannedUsers,
        highSpamUsers,
        pendingPosts,
        totalPosts,
        spamRate: totalUsers > 0 ? ((highSpamUsers / totalUsers) * 100).toFixed(2) : 0
      },
      recentSpamUsers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset spam score cho user
export const resetSpamScore = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Chỉ admin mới có quyền reset spam score' });
    }

    await User.findByIdAndUpdate(userId, {
      spamScore: 0
    });

    res.json({ message: 'Spam score đã được reset' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- CRUD User Management ---

// Create User
export const createUser = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Chỉ admin mới có quyền tạo user' });
    }

    if (!email || !password) {
      return res.status(400).json({ message: "Email và mật khẩu là bắt buộc" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      name: name || "Ẩn danh",
      role: role || 'user',
      username: email.split('@')[0] // default username
    });

    await newUser.save();

    res.status(201).json({ message: "Tạo user thành công", user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, role, status } = req.body; // Allow updating name, role, and status (active/banned via boolean if needed, though we use isBanned usually)

    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Chỉ admin mới có quyền cập nhật user' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User không tồn tại' });
    }

    // Prevent demoting last admin or self-demotion if critical (optional safety)
    // For now allow standard updates

    if (name) user.name = name;
    if (role) user.role = role;
    // Map status boolean from frontend if sent (isActive) to user.status
    if (req.body.hasOwnProperty('status')) {
      user.status = req.body.status;
    }

    await user.save();

    res.json({ message: "Cập nhật user thành công", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Chỉ admin mới có quyền xóa user' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User không tồn tại' });
    }

    if (user.role === 'admin') {
      // Optional: prevent deleting other admins
      // return res.status(403).json({ message: 'Không thể xóa tài khoản admin' });
    }

    // Clean up related data
    await Follow.deleteMany({ $or: [{ follower_id: userId }, { following_id: userId }] });
    await Post.deleteMany({ user_id: userId }); // Optionally delete posts or keep them

    await User.findByIdAndDelete(userId);

    res.json({ message: "Xóa user thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

