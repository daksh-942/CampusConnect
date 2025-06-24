import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import COLLEGES from "../components/colleges"; // ✅ import college list

function AskQuestion() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [college, setCollege] = useState(null); // 🏫 college selection
  const navigate = useNavigate();

  const TAG_OPTIONS = [
    { value: "hostel", label: "Hostel" },
    { value: "placement", label: "Placement" },
    { value: "admission", label: "Admission Process" },
    { value: "ragging", label: "Ragging Concerns" },
    { value: "life", label: "Campus Life" },
    { value: "curriculum", label: "Curriculum" },
    { value: "clubs", label: "Clubs & Events" },
    { value: "mess", label: "Mess/Food" },
    { value: "facilities", label: "Facilities" },
    { value: "faculty", label: "Faculty" },
    { value: "internship", label: "Internship" },
    { value: "fees", label: "Fees & Scholarship" },
    { value: "other", label: "Other" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tagValues = tags.map((tag) => tag.value);

    const res = await fetch("http://localhost:8000/questions", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        tags: tagValues,
        college: college?.value || "", // send selected college
      }),
    });

    if (res.ok) {
      navigate("/questions");
    } else {
      alert("Failed to post question");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Ask a Question</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="w-full border rounded p-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="w-full border rounded p-2"
          placeholder="Describe your question..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <div>
          <label className="block text-gray-700 font-medium mb-1">Tags</label>
          <Select
            options={TAG_OPTIONS}
            isMulti
            value={tags}
            onChange={setTags}
            placeholder="Select relevant tags"
            className="text-black"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">College</label>
          <Select
            options={COLLEGES}
            value={college}
            onChange={setCollege}
            placeholder="Select your college"
            className="text-black"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Question
        </button>
      </form>
    </div>
  );
}

export default AskQuestion;
