import express from "express";
const router = express.Router();
import * as blogController from "../controllers/blogController.js";
import { restrictToLoggedInUserOnly } from "../middleware/auth.js";

router.post("/", restrictToLoggedInUserOnly, blogController.createBlog);
router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);


export default router;
