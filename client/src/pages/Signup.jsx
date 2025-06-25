import { useState } from "react";
import { useNavigate } from "react-router-dom";
import COLLEGES from "../components/colleges"; // Make sure it exports your new array
import Select from "react-select";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "aspirant",
    college: null,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Manually validate college for mentors
    if (form.role === "mentor" && !form.college) {
      setError("Mentors must select a college.");
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      college: form.role === "mentor" ? form.college.value : undefined,
    };

    const res = await fetch("http://localhost:8000/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      navigate("/login");
    } else {
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="aspirant">Aspirant</option>
          <option value="mentor">Mentor</option>
        </select>

        {form.role === "mentor" && (
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Select College
            </label>
            <Select
              options={COLLEGES}
              value={form.college}
              onChange={(selected) =>
                setForm({ ...form, college: selected })
              }
              placeholder="Choose your college"
              className="text-black"
              isSearchable
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;
