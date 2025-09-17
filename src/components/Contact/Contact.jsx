"use client";

import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `📩 Message sent!\n\nName: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`
    );
    setFormData({ name: "", email: "", message: "" }); // reset form
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-emerald-50 via-teal-100 to-cyan-100">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl space-y-6 border border-white/20"
      >
        <h1 className="text-4xl font-extrabold text-center text-emerald-900 mb-4">
          Contact Us ✨
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none transition"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none transition"
          required
        />

        <textarea
          name="message"
          placeholder="Your Message"
          rows="4"
          value={formData.message}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none transition"
          required
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white py-3 rounded-2xl font-semibold shadow-lg hover:opacity-90 transition transform hover:scale-[1.02]"
        >
          Send Message 🚀
        </button>
      </form>
    </div>
  );
}
