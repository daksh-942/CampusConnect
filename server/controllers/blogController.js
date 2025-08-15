import Blog from "../models/Blog.js";

// ✅ Create blog (Only mentors can post)
export const createBlog = async (req, res) => {
  try {
    if (req.user.role !== "mentor") {
      return res.status(403).json({ error: "Only mentors can post blogs." });
    }

    const { title, content, tags } = req.body;

    const blog = await Blog.create({
      title,
      content,
      author: req.user._id,
      college: req.user.college,
      tags,
    });

    res.status(201).json(blog);
  } catch (error) {
    console.error("Create blog error:", error);
    res.status(500).json({ error: "Failed to create blog." });
  }
};

// ✅ Get all blogs (for frontend filtering)
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name email role college") // corrected field list
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (error) {
    console.error("Get blogs error:", error);
    res.status(500).json({ error: "Error fetching blogs." });
  }
};

export const getBlogById=async(req,res)=>{
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "name email role college").sort({createdAt:-1});
    res.json(blog);
  } catch (error) {
    console.error("Get blogs error:", error);
    res.status(500).json({ error: "Error fetching blogs." });
  }
}