"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function About() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-100 text-gray-900 px-6 py-16">
      
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          About <span className="text-indigo-600 font-extrabold">Stock Tracker</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-6">
          Real-time portfolio management platform to track investments, monitor stock performance, and make smarter financial decisions.
        </p>
        <button
          onClick={() => router.push("/signup")}
          className="px-6 py-3 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 transition transform hover:scale-105"
        >
          Get Started
        </button>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-20">
        {["Real-Time Updates", "Profit & Loss Tracking", "Secure Authentication"].map((feature, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl hover:scale-105 transition transform"
          >
            <h3 className="text-xl font-semibold mb-2 text-indigo-600">
              {idx === 0 ? "📊" : idx === 1 ? "💹" : "🔒"} {feature}
            </h3>
            <p className="text-gray-700">
              {feature === "Real-Time Updates" && "Get live stock prices and portfolio updates instantly."}
              {feature === "Profit & Loss Tracking" && "Monitor gains and losses in real-time to make informed decisions."}
              {feature === "Secure Authentication" && "Firebase and JWT ensure your data is safe and private."}
            </p>
          </div>
        ))}
      </section>

      {/* How It Works Accordion */}
      <section className="max-w-4xl mx-auto text-center mb-20">
        <h2 className="text-3xl font-bold text-indigo-600 mb-6">How Stock Tracker Works</h2>
        <div className="text-gray-700 text-lg space-y-4">
          <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition transform hover:scale-105">
            1️⃣ Sign up or log in securely.
          </div>
          <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition transform hover:scale-105">
            2️⃣ Add the stocks you own or want to track.
          </div>
          <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition transform hover:scale-105">
            3️⃣ View live stock prices and track your profit/loss.
          </div>
          <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition transform hover:scale-105">
            4️⃣ Make smarter investment decisions based on real-time insights.
          </div>
        </div>
      </section>
    </main>
  );
}
