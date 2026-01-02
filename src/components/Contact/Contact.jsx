"use client";
import { useState } from "react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-emerald-50 via-teal-100 to-cyan-100">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white/90 p-8 rounded-3xl shadow-xl border border-teal-200 space-y-6"
      >
        <h1 className="text-4xl font-extrabold text-center text-emerald-900 mb-4">
          Contact Us 🌿
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none bg-white text-emerald-900 placeholder-teal-600 transition"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none bg-white text-emerald-900 placeholder-teal-600 transition"
          required
        />

        <textarea
          name="message"
          placeholder="Your Message"
          rows="4"
          value={formData.message}
          onChange={handleChange}
          className="w-full p-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none bg-white text-emerald-900 placeholder-teal-600 transition"
          required
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-3 rounded-2xl font-semibold shadow-lg hover:opacity-90 transition transform hover:scale-[1.02]"
        >
          Send Message 🚀
        </button>
      </form>
    </div>
  );
}
