import mongoose from "mongoose";

const followSchema = new mongoose.Schema({
    follower_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    following_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    created_at: { type: Date, default: Date.now }
  });
  
export default mongoose.model("Follow", followSchema);
  