import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Answer() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [answerText, setAnswerText] = useState("");

  const fetchData = async () => {
    try {
      // Fetch question
      const qRes = await fetch(`http://localhost:8000/questions/${id}`, {
        credentials: "include",
      });
      const qData = await qRes.json();

      // Fetch answers (with populated answeredBy)
      const aRes = await fetch(`http://localhost:8000/answers/${id}`, {
        credentials: "include",
      });
      const aData = await aRes.json();

      // Fetch user info
      const uRes = await fetch("http://localhost:8000/user/me", {
        credentials: "include",
      });
      const uData = await uRes.json();

      setQuestion(qData);
      setAnswers(aData);
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
      await fetchData(); // Refresh full answer list including new one
      setAnswerText("");
    } else {
      const data = await res.json();
      alert(data.error || "Failed to post answer.");
    }
  };

  if (loading) return <div className="p-6 font-medium">Loading…</div>;
  if (!question || question.error) {
    return (
      <div className="p-6 text-red-600">
        Could not load question. {question?.error || ""}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-2">{question.title}</h2>
      <p className="mb-4">{question.description}</p>

      <div className="mb-6">
        <strong>Tags:</strong>{" "}
        {question.tags?.map((tag, i) => (
          <span
            key={i}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2"
          >
            #{tag}
          </span>
        ))}
      </div>

      <hr className="my-4" />

      <h3 className="text-xl font-semibold mb-4">Answers</h3>
      {!answers.length ? (
        <p className="text-gray-600">No answers yet.</p>
      ) : (
        <div className="space-y-4">
          {answers.map((a) => (
            <div key={a._id} className="bg-gray-100 p-4 rounded shadow-sm">
              <p>{a.content}</p>
              <div className="text-sm text-gray-600 mt-2">
                — {a.answeredBy?.name || "Anonymous"} ({a.answeredBy?.role})
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mentor Answer Form */}
      {user?.role === "mentor" && user.college === question.college && (
        <form
          onSubmit={handleSubmit}
          className="mt-8 bg-white p-4 rounded-xl shadow"
        >
          <h4 className="text-lg font-semibold mb-2">Your Answer</h4>
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            className="w-full border p-2 rounded mb-2"
            rows={4}
            placeholder="Write your answer here"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Answer
          </button>
        </form>
      )}
    </div>
  );
}

export default Answer;
