"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../Auth/Auth";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { storetokeninLS } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        { email, password }
      );

      storetokeninLS(res.data.token);

      if (res.status === 200) {
        toast.success("Login successful!");
        setEmail("");
        setPassword("");
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-100 to-cyan-100 px-4">
      {/* Login Card */}
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-6">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-emerald-900 mb-6">
          Welcome Back 🎉
        </h1>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:opacity-90 transition transform hover:scale-105 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Extra Links */}
        <p className="text-center text-sm text-gray-700">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 bg-clip-text text-transparent font-semibold hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
