import User from "../models/User.js";
import { setUser } from "../service/auth.js";
import jwt from "jsonwebtoken";

// 🔐 User Signup
export const handleUserSignup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    await User.create({ name, email, password, role });

    return res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// 🔐 User Login
export const handleUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: "Invalid Email or Password" });
    }

    const token = setUser(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Set to true in production (with HTTPS)
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Login successful", user: { name: user.name, role: user.role } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
