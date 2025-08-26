import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // người nhận thông báo
    type: { type: String },
    data: { type: mongoose.Schema.Types.Mixed }, // lưu JSON
    is_read: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now }
  });
  
  export default mongoose.model("Notification", notificationSchema);
  