import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import crypto from "crypto";

// Đăng ký người dùng
export const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email và mật khẩu là bắt buộc" });
  }

  try {
    // Kiểm tra nếu người dùng đã tồn tại
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Người dùng đã tồn tại" });
    }

    // Hash mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Người dùng đã được tạo thành công" });

  } catch (error) {
    console.error("Register error:", error); // In ra lỗi chi tiết
    res.status(500).json({ message: "Đã có lỗi xảy ra", error: error.message });
  }
};

export const login = async (req, res) => {
  console.log("=== LOGIN REQUEST RECEIVED ===");
  console.log("Request body:", req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Missing email or password");
    return res.status(400).json({ message: "Email và mật khẩu là bắt buộc" });
  }

  try {
    console.log("Login attempt for:", email);

    // Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(400).json({ message: "Tài khoản không tồn tại!" });
    }

    console.log("User found:", user.email, "Role:", user.role);
    console.log("Stored password hash:", user.password);
    console.log("Input password:", password);

    // So sánh mật khẩu với bcrypt hoặc plain text
    let isPasswordValid = false;

    // Kiểm tra nếu password là hash (bắt đầu với $2b$)
    if (user.password.startsWith('$2b$')) {
      isPasswordValid = await bcrypt.compare(password, user.password);
      console.log("Using bcrypt comparison");
    } else {
      // Password là plain text
      isPasswordValid = (password === user.password);
      console.log("Using plain text comparison");
    }

    console.log("Password comparison result:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("Invalid password for user:", email);
      return res.status(400).json({ message: "Mật khẩu không đúng!" });
    }

    console.log("Password valid, creating token...");

    // Tạo JWT token sau khi xác thực thành công
    const token = jwt.sign(
        { email: user.email, id: user._id, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key-for-blog-project-2024',
        { expiresIn: "1h" }
    );

    console.log("Login successful for:", email);

    // Trả về kết quả, thông tin người dùng và token
    res.status(200).json({
      message: "Đăng nhập thành công!",
      result: { email: user.email, role: user.role, _id: user._id },
      token
    });

  } catch (error) {
    // Lỗi hệ thống
    console.error("Login error:", error);
    res.status(500).json({ message: "Đã có lỗi xảy ra!", error: error.message });
  }
};

// Quên mật khẩu - Gửi email reset
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email là bắt buộc" });
  }

  try {
    // Kiểm tra người dùng có tồn tại không
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại trong hệ thống" });
    }

    // Tạo token reset password
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 giờ

    // Lưu token vào database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Cấu hình email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'locn2812@gmail.com',
        pass: process.env.EMAIL_PASS || 'zmdr xrzw pyru nvpx'
      }
    });

    // Tạo link reset password
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    // Nội dung email
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Đặt lại mật khẩu - Blog System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Đặt lại mật khẩu</h2>
          <p>Xin chào,</p>
          <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
          <p>Vui lòng click vào link bên dưới để đặt lại mật khẩu:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Đặt lại mật khẩu
            </a>
          </div>
          <p>Link này sẽ hết hạn sau 1 giờ.</p>
          <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
          <p>Trân trọng,<br>Blog System Team</p>
        </div>
      `
    };

    // Gửi email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn."
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Đã có lỗi xảy ra khi gửi email" });
  }
};

// Reset mật khẩu
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token và mật khẩu mới là bắt buộc" });
  }

  try {
    // Tìm người dùng với token hợp lệ
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu và xóa token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Mật khẩu đã được đặt lại thành công" });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Đã có lỗi xảy ra khi đặt lại mật khẩu" });
  }
};

// Đổi mật khẩu cho người dùng đã đăng nhập
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id; // Lấy từ middleware auth

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Mật khẩu hiện tại và mật khẩu mới là bắt buộc" });
  }

  try {
    // Tìm người dùng
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Kiểm tra mật khẩu hiện tại
    let isPasswordValid = false;
    if (user.password.startsWith('$2b$')) {
      isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    } else {
      isPasswordValid = (currentPassword === user.password);
    }

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Mật khẩu đã được thay đổi thành công" });

  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Đã có lỗi xảy ra khi thay đổi mật khẩu" });
  }
};

