import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const TAG_OPTIONS = [
  { value: "fest", label: "Fest" },
  { value: "placement", label: "Placement" },
  { value: "event", label: "Event" },
  { value: "club", label: "Club" },
  { value: "general", label: "General" },
];

function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagVals = tags.map((t) => t.value);

    const res = await fetch("http://localhost:8000/blogs", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, tags: tagVals }),
    });

    if (res.ok) {
      navigate("/blogs");
    } else {
      alert("Failed to post blog.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">✍️ Write a Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Your blog content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          required
        />
        <div>
          <label className="text-sm text-gray-600">Tags</label>
          <Select
            isMulti
            options={TAG_OPTIONS}
            value={tags}
            onChange={setTags}
            placeholder="Choose tags"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Publish Blog
        </button>
      </form>
    </div>
  );
}

export default CreateBlog;
