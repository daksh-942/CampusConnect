import express from "express";
import { createQuestion, getAllQuestions } from "../controllers/questionController.js";
import { restrictToLoggedInUserOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/", restrictToLoggedInUserOnly, createQuestion);
router.get("/", getAllQuestions); // anyone can view

export default router;