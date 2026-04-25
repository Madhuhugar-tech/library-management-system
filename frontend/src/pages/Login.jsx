import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const quickLogin = (email, password) => {
    setFormData({ email, password });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await API.post("/auth/login", formData);
      setUserInfo(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#f6f7fb]">
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#07112b] via-[#16213f] to-[#ef7f73] p-12 text-white relative overflow-hidden">
        <div className="absolute w-72 h-72 rounded-full bg-white/10 -top-20 -right-20" />
        <div className="absolute w-96 h-96 rounded-full bg-white/10 -bottom-32 -left-32" />

        <div className="relative">
          <h1 className="text-5xl font-black leading-none">
            Book
            <br />
            House
          </h1>
          <p className="text-white/70 mt-3">Smart digital library platform</p>
        </div>

        <div className="relative max-w-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">
            Online Library Management
          </p>
          <h2 className="text-5xl font-black leading-tight mt-4">
            Discover, borrow, manage and track books beautifully.
          </h2>
          <p className="mt-5 text-white/75 text-lg leading-8">
            A clean library system built for students and administrators with modern dashboards,
            borrow tracking, notifications and collection management.
          </p>
        </div>

        <div className="relative grid grid-cols-3 gap-4">
          <div className="bg-white/15 border border-white/20 rounded-3xl p-5 backdrop-blur">
            <p className="text-3xl font-black">Admin</p>
            <p className="text-white/60 text-sm mt-1">Manage books</p>
          </div>

          <div className="bg-white/15 border border-white/20 rounded-3xl p-5 backdrop-blur">
            <p className="text-3xl font-black">User</p>
            <p className="text-white/60 text-sm mt-1">Borrow books</p>
          </div>

          <div className="bg-white/15 border border-white/20 rounded-3xl p-5 backdrop-blur">
            <p className="text-3xl font-black">Track</p>
            <p className="text-white/60 text-sm mt-1">Due dates</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white border border-slate-200 rounded-[34px] shadow-xl p-8"
        >
          <div className="text-center">
            <div className="w-16 h-16 rounded-3xl bg-[#fff1ef] text-[#ef7f73] flex items-center justify-center mx-auto text-3xl">
              📚
            </div>

            <h1 className="text-4xl font-black text-[#07112b] mt-5">
              Welcome Back
            </h1>
            <p className="text-slate-500 mt-2">
              Login to continue to Book House
            </p>
          </div>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl">
              {error}
            </div>
          )}

          <div className="mt-7 space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#ef7f73]/40 transition"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#ef7f73]/40 transition"
            />

            <button className="w-full bg-[#ef7f73] text-white rounded-2xl py-4 font-black hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition">
              Login
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => quickLogin("admin@gmail.com", "123456")}
              className="bg-slate-100 hover:bg-[#07112b] hover:text-white text-slate-700 rounded-2xl py-3 text-sm font-bold transition"
            >
              Admin Demo
            </button>

            <button
              type="button"
              onClick={() => quickLogin("ananya@gmail.com", "123456")}
              className="bg-slate-100 hover:bg-[#07112b] hover:text-white text-slate-700 rounded-2xl py-3 text-sm font-bold transition"
            >
              User Demo
            </button>
          </div>

          <p className="text-center text-slate-500 mt-6">
            Don’t have an account?{" "}
            <Link to="/register" className="text-[#ef7f73] font-bold">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;