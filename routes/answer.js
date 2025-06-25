import express from "express";
import { createAnswer, getAnswersForQuestion } from "../controllers/answerController.js";
import { restrictToLoggedInUserOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/", restrictToLoggedInUserOnly, createAnswer);
router.get("/:questionId", getAnswersForQuestion);

export default router;