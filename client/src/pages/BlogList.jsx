import { useEffect, useState } from "react";
import Select from "react-select";
import COLLEGES from "../components/colleges"; // college dropdown options

const TAG_OPTIONS = [
  { value: "fest", label: "Fest" },
  { value: "placement", label: "Placement" },
  { value: "event", label: "Event" },
  { value: "club", label: "Club" },
  { value: "general", label: "General" },
];

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/blogs", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data);
        setFiltered(data);
      })
      .catch((err) => console.error("Error fetching blogs", err));
  }, []);

  useEffect(() => {
    const tagVals = selectedTags.map((tag) => tag.value);
    const result = blogs.filter((blog) => {
      const tagMatch =
        tagVals.length === 0 || blog.tags.some((tag) => tagVals.includes(tag));
      const collegeMatch =
        !selectedCollege || blog.college === selectedCollege.value;
      return tagMatch && collegeMatch;
    });
    setFiltered(result);
  }, [selectedTags, selectedCollege, blogs]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">🎓 Mentor Blogs</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-white p-4 rounded-xl shadow">
        <div>
          <label className="text-sm text-gray-700 mb-1 block">Filter by Tags</label>
          <Select
            isMulti
            options={TAG_OPTIONS}
            value={selectedTags}
            onChange={setSelectedTags}
            placeholder="Select tags"
          />
        </div>
        <div>
          <label className="text-sm text-gray-700 mb-1 block">Filter by College</label>
          <Select
            options={COLLEGES}
            value={selectedCollege}
            onChange={setSelectedCollege}
            isClearable
            placeholder="Select college"
          />
        </div>
      </div>

      {/* Blog cards */}
      <div className="space-y-6">
        {filtered.map((blog) => (
          <div key={blog._id} className="bg-white p-6 rounded-xl shadow border">
            <h2 className="text-2xl font-semibold text-blue-800 mb-2">{blog.title}</h2>
            <p className="text-gray-800 mb-3">{blog.content}</p>
            <div className="text-sm text-gray-600 mb-2">
              <span>By: {blog.author?.name} ({blog.college})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogList;
