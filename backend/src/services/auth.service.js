// services/auth.service.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function register({ email, password }) {
    if (!email || !password) { const e=new Error("Thiếu email/mật khẩu"); e.status=400; throw e; }
    const exists = await User.findOne({ email });
    if (exists) { const e=new Error("Người dùng đã tồn tại"); e.status=400; throw e; }
    const hash = await bcrypt.hash(password, 10);
    await User.create({ email, password: hash });
    return { message: "Tạo tài khoản thành công" };
}

export async function login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) { const e=new Error("Tài khoản không tồn tại"); e.status=400; throw e; }
    const ok = await bcrypt.compare(password, user.password || "");
    if (!ok) { const e=new Error("Mật khẩu không đúng"); e.status=400; throw e; }

    const payload = { email: user.email, id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    return { message: "Đăng nhập thành công", result: { email: user.email, role: user.role }, token };
}
