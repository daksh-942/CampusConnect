import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function Answer() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [answerText, setAnswerText] = useState("");

  const fetchData = async () => {
    try {
      const [qRes, aRes, uRes] = await Promise.all([
        fetch(`http://localhost:8000/questions/${id}`, { credentials: "include" }),
        fetch(`http://localhost:8000/answers/${id}`, { credentials: "include" }),
        fetch("http://localhost:8000/user/me", { credentials: "include" }),
      ]);

      const [qData, aData, uData] = await Promise.all([
        qRes.json(),
        aRes.json(),
        uRes.json(),
      ]);

      setQuestion(qData);
      const sorted = [...aData].sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
      setAnswers(sorted);
      if (!uData.error) setUser(uData);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answerText.trim()) return;

    const res = await fetch("http://localhost:8000/answers", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: answerText, questionId: id }),
    });

    if (res.ok) {
      await fetchData();
      setAnswerText("");
    } else {
      const data = await res.json();
      alert(data.error || "Failed to post answer.");
    }
  };

  const handleVote = async (answerId) => {
    const res = await fetch(`http://localhost:8000/answers/${answerId}/vote`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    setAnswers((prev) =>
      [...prev]
        .map((a) => (a._id === answerId ? { ...a, voteCount: data.voteCount } : a))
        .sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0))
    );
  };

  if (loading) return <div className="p-6 font-medium">Loading…</div>;
  if (!question || question.error)
    return <div className="p-6 text-red-600">Error loading question.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      {/* Question Box */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-200">
        <h2 className="text-3xl font-bold text-indigo-700 mb-3">{question.title}</h2>
        <p className="text-gray-800 text-lg">{question.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {question.tags?.map((tag, i) => (
            <span
              key={i}
              className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Answer List */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Answers</h3>
        {answers.length === 0 ? (
          <p className="text-gray-500 italic">No answers yet. Be the first to help!</p>
        ) : (
          <div className="space-y-6">
            {answers.map((a) => (
              <div
                key={a._id}
                className="bg-white p-5 rounded-xl shadow-md border border-gray-200 transition hover:shadow-lg"
              >
                <p className="text-gray-900 text-base leading-relaxed">{a.content}</p>

                <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                  <span>
                    —{" "}
                    {a.answeredBy?._id ? (
                      <Link
                        to={`/profile/${a.answeredBy._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {a.answeredBy.name}
                      </Link>
                    ) : (
                      "Anonymous"
                    )}{" "}
                    ({a.answeredBy?.role || "Student"})
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(a.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={() => handleVote(a._id)}
                    className="text-sm text-indigo-600 font-medium hover:underline flex items-center"
                  >
                    👍 <span className="ml-1">Vote</span>
                  </button>
                  <span className="text-gray-800 text-sm font-semibold">
                    {a.voteCount || 0} vote{a.voteCount === 1 ? "" : "s"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Answer Form */}
      {user?.role === "mentor" && user.college === question.college && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-xl border border-green-200 space-y-4"
        >
          <h4 className="text-xl font-bold text-green-700">Your Answer</h4>
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            rows={5}
            placeholder="Write a thoughtful answer to help the community..."
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition font-medium"
          >
            Submit Answer
          </button>
        </form>
      )}
    </div>
  );
}

export default Answer;
