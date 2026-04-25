import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await API.post("/auth/register", formData);
      setMessage("Registration successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-slate-200 p-8"
      >
        <h1 className="text-3xl font-bold text-slate-800 text-center">Register</h1>
        <p className="text-slate-500 text-center mt-2">Create your Book House account</p>

        {error && (
          <div className="mt-5 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-5 bg-green-50 border border-green-100 text-green-600 px-4 py-3 rounded-2xl">
            {message}
          </div>
        )}

        <div className="mt-6">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-2xl px-4 py-3 mb-4 outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-2xl px-4 py-3 mb-4 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-2xl px-4 py-3 mb-4 outline-none"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-2xl px-4 py-3 mb-5 outline-none"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button className="w-full bg-[#ef7f73] hover:opacity-90 text-white rounded-2xl py-3 font-semibold transition">
            Register
          </button>
        </div>

        <p className="text-center text-slate-500 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-[#ef7f73] font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;