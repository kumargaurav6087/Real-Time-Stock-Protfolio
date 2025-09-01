"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";   // ✅ Toastify import

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
        "http://localhost:5000/api/auth/register",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(
        `Registered successfully as ${res.data.user?.username || userData.username}`
      ); // ✅ Success toast

      // Redirect to login page after signup
      router.push("/login");
    } catch (err) {
      toast.error(`Error: ${err.response?.data?.message || err.message}`); // ✅ Error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center animated-gradient px-4">
      <form
        onSubmit={handleSignup}
        className="max-w-md w-full bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl space-y-6 border border-white/20"
      >
        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent mb-2">
          Create Account ✨
        </h1>

        {/* Username */}
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none transition"
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none transition"
          required
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition"
          required
        />

        {/* Phone */}
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 outline-none transition"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition transform hover:scale-[1.02] disabled:opacity-50"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-700 mt-4">
          Already have an account?{" "}
          <a
            href="/login"
            className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent font-semibold hover:underline"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
