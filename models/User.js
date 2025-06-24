import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,
  role: {
    type: String,
    enum: ["aspirant", "mentor"],
    required: true,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
