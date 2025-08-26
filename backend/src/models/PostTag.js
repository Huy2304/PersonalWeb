import mongoose from "mongoose";

const postTagSchema = new mongoose.Schema({
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    tag_id: { type: mongoose.Schema.Types.ObjectId, ref: "Tag" }
  });
  
  export default mongoose.model("PostTag", postTagSchema);
  