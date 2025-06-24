import Question from "../models/Question.js";

// 🟢 Create a new question
export const createQuestion = async (req, res) => {
  try {
    const { title, description, tags, college } = req.body;
    const user = req.user;

    const question = await Question.create({
      title,
      description,
      tags,
      college,
      askedBy: user._id,
    });

    res.status(201).json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating question" });
  }
};

// 🟢 Fetch all questions
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("askedBy", "name role")
      .sort({ createdAt: -1 }); // Optional: latest first

    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
};
