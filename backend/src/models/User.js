import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, default: "default_username" },
  role: { type: String, default: "user" },
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
  password: { type: String, required: true, maxlength: 255 },
  follow:{type: Number,default:0},
  follower:{type: Number,default:0},
  status: { type: Boolean, default: true }, // true = online, false = offline
  created_at: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

export default User;
