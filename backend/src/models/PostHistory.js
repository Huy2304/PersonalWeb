import mongoose from "mongoose";

const postHistorySchema = new mongoose.Schema({
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, maxlength: 255 },
    post: { type: String },
    updated_at: { type: Date, default: Date.now }
  });
  
  export default mongoose.model("PostHistory", postHistorySchema);
  