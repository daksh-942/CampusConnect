import express from "express";
import { handleUserSignup, handleUserLogin } from "../controllers/user.js";
import { restrictToLoggedInUserOnly } from "../middleware/auth.js";


const router = express.Router();

router.get("/me", restrictToLoggedInUserOnly, (req, res) => {
  res.json(req.user); // `req.user` is set by auth middleware
});

router.post("/", handleUserSignup);
router.post("/login", handleUserLogin);

export default router;
