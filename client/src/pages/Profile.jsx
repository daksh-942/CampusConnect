import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function ProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [userRes, qRes, aRes] = await Promise.all([
          fetch(`http://localhost:8000/user/${id}`, { credentials: "include" }),
          fetch(`http://localhost:8000/questions/user/${id}`, { credentials: "include" }),
          fetch(`http://localhost:8000/answers/user/${id}`, { credentials: "include" }),
        ]);

        const [userData, qData, aData] = await Promise.all([
          userRes.json(),
          qRes.json(),
          aRes.json(),
        ]);

        if (userData.error) {
          setUser(null);
        } else {
          setUser(userData);
          setQuestions(qData || []);
          setAnswers(aData || []);
        }
      } catch (err) {
        console.error("Error fetching profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) return <div className="p-6 text-lg font-semibold animate-pulse">Loading Profile…</div>;
  if (!user) return <div className="p-6 text-red-600 font-medium">User not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      {/* Profile Card */}
      <div className="bg-white shadow-lg border border-blue-100 rounded-2xl p-6">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-4 flex items-center gap-2">
          👤 {user.name}
        </h2>
        <div className="space-y-2 text-gray-700 text-sm md:text-base">
          <p><span className="font-semibold text-gray-600">📧 Email:</span> {user.email}</p>
          <p><span className="font-semibold text-gray-600">🎓 Role:</span> {user.role}</p>
          {user.college && (
            <p><span className="font-semibold text-gray-600">🏫 College:</span> {user.college}</p>
          )}
        </div>
      </div>

      {/* Questions Section */}
      <div className="bg-white shadow-lg border border-green-100 rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-green-700 mb-4">
          📌 Questions by {user.name}
        </h3>
        {questions.length === 0 ? (
          <p className="text-gray-500">No questions posted yet.</p>
        ) : (
          <ul className="space-y-4">
            {questions.map((q) => (
              <li
                key={q._id}
                className="p-4 border border-gray-200 rounded-xl hover:bg-green-50 transition"
              >
                <Link to={`/questions/${q._id}`}>
                  <h4 className="text-lg font-semibold text-blue-600 hover:underline">
                    {q.title}
                  </h4>
                </Link>
                <p className="text-gray-700 text-sm mt-1">{q.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Answers Section */}
      {user.role === "mentor" && (
        <div className="bg-white shadow-lg border border-purple-100 rounded-2xl p-6">
          <h3 className="text-2xl font-bold text-purple-700 mb-4">
            ✍️ Answers by {user.name}
          </h3>
          {answers.length === 0 ? (
            <p className="text-gray-500">No answers written yet.</p>
          ) : (
            <ul className="space-y-4">
              {answers.map((a) => (
                <li
                  key={a._id}
                  className="p-4 border border-gray-200 rounded-xl hover:bg-purple-50 transition"
                >
                  <p className="text-gray-800 text-sm">{a.content}</p>
                  {a.question?._id && (
                    <p className="text-xs text-gray-500 mt-2">
                      ↳ on{" "}
                      <Link
                        to={`/questions/${a.question._id}`}
                        className="text-indigo-600 hover:underline"
                      >
                        {a.question.title}
                      </Link>
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
