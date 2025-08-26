import mongoose from "mongoose";

const shareSchema = new mongoose.Schema({
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    platform: { type: String, default: "" },
    message: { type: String, default: "" },
    visibility: { type: String, default: "public" },
    created_at: { type: Date, default: Date.now }
  });
  
  export default mongoose.model("Share", shareSchema);
  