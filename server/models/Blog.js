import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  college: String,
  
  tags: {
    type: [String],
    enum: [
      "hostel",
      "placement",
      "admission",
      "ragging",
      "life",
      "curriculum",
      "clubs",
      "mess",
      "facilities",
      "faculty",
      "internship",
      "fees",
      "other",
    ],
    default: [],
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Blog", blogSchema);
