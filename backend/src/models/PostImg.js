import mongoose from "mongoose";

const postImgSchema = new mongoose.Schema({
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    fname: { type: String, required: true }
  });
  
  export default mongoose.model("PostImage", postImgSchema);
  