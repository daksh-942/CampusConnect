import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Select from "react-select";
import COLLEGES from "../components/colleges"; // assumes value-label pairs

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

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/questions", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setFiltered(data);
      })
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);

  useEffect(() => {
    const tagValues = selectedTags.map((tag) => tag.value);
    const filteredData = questions.filter((q) => {
      const tagMatch =
        tagValues.length === 0 || q.tags.some((tag) => tagValues.includes(tag));
      const collegeMatch =
        !selectedCollege || q.college === selectedCollege.value;
      return tagMatch && collegeMatch;
    });
    setFiltered(filteredData);
  }, [selectedTags, selectedCollege, questions]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Questions</h1>
        <button
          onClick={() => navigate("/askquestion")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ask a Question
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Filter by College
            </label>
            <Select
              options={COLLEGES}
              value={selectedCollege}
              onChange={setSelectedCollege}
              placeholder="Select College"
              isClearable
              className="text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Filter by Tags
            </label>
            <Select
              options={TAG_OPTIONS}
              value={selectedTags}
              onChange={setSelectedTags}
              isMulti
              placeholder="Select Tags"
              className="text-black"
            />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-600">No questions match your filters.</p>
      ) : (
        <div className="space-y-6">
          {filtered.map((q) => (
            <div key={q._id} className="p-5 bg-white rounded-xl shadow hover:shadow-md transition">
              <Link to={`/questions/${q._id}`}>
                <h2 className="text-xl font-semibold text-blue-600 mb-1 hover:underline">
                  {q.title}
                </h2>
              </Link>

              <p className="text-gray-800">{q.description}</p>

              <div className="mt-3 text-sm text-gray-600 flex flex-wrap gap-4 items-center">
                <span>
                  <strong>Asked by:</strong> {q.askedBy?.name || "Anonymous"} ({q.askedBy?.role})
                </span>
                {q.college && (
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-800">
                    🎓 {q.college}
                  </span>
                )}
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                {q.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Questions;
