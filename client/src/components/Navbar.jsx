import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8000/user/me", {
          credentials: "include",
        });
        const data = await res.json();
        if (!data.error) setUser(data);
      } catch (err) {
        console.error("User not logged in");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch("http://localhost:8000/user/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-white">
          College QnA
        </Link>

        <div className="space-x-6 text-sm sm:text-base">
          <Link to="/" className="hover:text-yellow-300">Home</Link>
          <Link to="/questions" className="hover:text-yellow-300">Questions</Link>
          <Link to="/askquestion" className="hover:text-yellow-300">Ask</Link>

          {user ? (
            <>
              <Link to={`/profile/${user._id}`} className="hover:text-yellow-300">
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="hover:text-red-300 ml-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-yellow-300">Login</Link>
              <Link to="/signup" className="hover:text-yellow-300">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
