import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true, maxlength: 100 }
  });
  
  export default mongoose.model("Tag", tagSchema);
  