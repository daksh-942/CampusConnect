import express from "express";
import { createQuestion, getAllQuestions, getQuestionById } from "../controllers/questionController.js";
import { restrictToLoggedInUserOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllQuestions);
router.get("/:id", getQuestionById);  // ✅ THIS IS NEEDED
router.post("/", restrictToLoggedInUserOnly, createQuestion);

export default router;
