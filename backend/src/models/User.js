import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, default: "default_username" },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  name: { type: String, maxlength: 150, default: "Ẩn danh" },
  email: {
    type: String,
    maxlength: 100, // email có thể dài hơn 30 ký tự
    required: true,
    unique: true, // Đảm bảo email là duy nhất
    lowercase: true, // Chuyển email về chữ thường
    validate: {
      validator: function(value) {
        // Kiểm tra định dạng email
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  password: {
    type: String,
    required: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  follow:{type: Number,default:0},
  follower:{type: Number,default:0},
  status: { type: Boolean, default: true }, // true = online, false = offline
  // Thêm fields cho ban user và spam protection
  isBanned: { type: Boolean, default: false },
  banReason: { type: String },
  banUntil: { type: Date },
  spamScore: { type: Number, default: 0 }, // Điểm spam tích lũy
  lastPostTime: { type: Date }, // Thời gian đăng bài cuối
  postCount: { type: Number, default: 0 }, // Số bài viết đã đăng
  created_at: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User;
