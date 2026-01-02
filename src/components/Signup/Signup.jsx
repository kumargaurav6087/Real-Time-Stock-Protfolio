"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const userData = {
      username: form.username.value,
      email: form.email.value,
      password: form.password.value,
      phone: form.phone.value,
    };

    try {
      const res = await axios.post(
        `${API_URL}api/auth/register`,
        userData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(
        `Registered successfully as ${res.data.user?.username || userData.username}`
      );
      router.push("/login");
    } catch (err) {
      toast.error(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 via-teal-300 to-cyan-200 px-4">
      <form
        onSubmit={handleSignup}
        className="max-w-md w-full bg-white/30 backdrop-blur-xl p-8 rounded-3xl shadow-xl space-y-6 border border-white/40"
      >
        <h1 className="text-4xl font-extrabold text-center text-emerald-900 mb-6">
          Create Account 🌿
        </h1>

        {/* Username */}
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full p-3 border border-emerald-300/60 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white/40 text-emerald-900 placeholder-emerald-600 transition"
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 border border-teal-300/60 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-white/40 text-emerald-900 placeholder-teal-600 transition"
          required
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-3 border border-cyan-300/60 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none bg-white/40 text-emerald-900 placeholder-cyan-600 transition"
          required
        />

        {/* Phone */}
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          className="w-full p-3 border border-teal-300/60 rounded-xl focus:ring-2 focus:ring-teal-600 outline-none bg-white/40 text-emerald-900 placeholder-teal-700 transition"
          required
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-3 rounded-2xl font-semibold shadow-lg hover:opacity-90 transition transform hover:scale-[1.02] disabled:opacity-50"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-emerald-900 mt-4">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-teal-700 font-semibold hover:underline"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
