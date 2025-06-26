import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

  if (loading) return <div className="p-6 text-lg">Loading Profile…</div>;
  if (!user) return <div className="p-6 text-red-600">User not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white shadow rounded-xl p-6 border">
        <h2 className="text-2xl font-bold mb-2 text-blue-700">👤 {user.name}</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        {user.college && <p><strong>College:</strong> {user.college}</p>}
      </div>

      <div className="bg-white shadow rounded-xl p-6 border">
        <h3 className="text-xl font-semibold mb-4 text-green-700">📌 Questions by {user.name}</h3>
        {questions.length === 0 ? (
          <p className="text-gray-500">No questions posted yet.</p>
        ) : (
          <ul className="space-y-3">
            {questions.map((q) => (
              <li key={q._id} className="border p-3 rounded hover:bg-gray-50">
                <h4 className="text-lg font-medium text-blue-600">{q.title}</h4>
                <p className="text-gray-700 text-sm">{q.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {user.role === "mentor" && (
        <div className="bg-white shadow rounded-xl p-6 border">
          <h3 className="text-xl font-semibold mb-4 text-purple-700">✍️ Answers by {user.name}</h3>
          {answers.length === 0 ? (
            <p className="text-gray-500">No answers written yet.</p>
          ) : (
            <ul className="space-y-3">
              {answers.map((a) => (
                <li key={a._id} className="border p-3 rounded hover:bg-gray-50">
                  <p className="text-sm">{a.content}</p>
                  <p className="text-gray-500 text-xs mt-1">↳ on "{a.question?.title}"</p>
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
