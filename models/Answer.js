import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  content: String,
  answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  createdAt: { type: Date, default: Date.now },
});

const Answer = mongoose.model("Answer", answerSchema);
export default Answer;
