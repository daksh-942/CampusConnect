import express from "express";
import { handleUserSignup, handleUserLogin } from "../controllers/user.js";
import { restrictToLoggedInUserOnly } from "../middleware/auth.js";
import User from "../models/User.js";


const router = express.Router();

router.get("/me", restrictToLoggedInUserOnly, (req, res) => {
  res.json(req.user); // `req.user` is set by auth middleware
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name email role college");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error fetching user" });
  }
});

router.post("/", handleUserSignup);
router.post("/login", handleUserLogin);

export default router;
