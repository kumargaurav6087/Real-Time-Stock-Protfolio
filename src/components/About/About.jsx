"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function About() {
  const router = useRouter();

  const features = [
    { icon: "📊", title: "Real-Time Updates", desc: "Get live stock prices and portfolio updates instantly." },
    { icon: "💹", title: "Profit & Loss Tracking", desc: "Monitor gains and losses in real-time to make informed decisions." },
    { icon: "🔒", title: "Secure Authentication", desc: "Firebase and JWT ensure your data is safe and private." },
    { icon: "📈", title: "Data Visualization", desc: "Interactive charts to visualize stock performance and historical trends." },
    { icon: "🛠️", title: "Admin Dashboard", desc: "Admins can analyze user trading trends and aggregated portfolios." },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-100 to-cyan-100 text-gray-800 px-6 py-16">
      
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-emerald-900">
          About <span className="text-teal-700 font-extrabold">Stock Tracker</span>
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Real-time portfolio management platform to track investments, monitor stock performance, and make smarter financial decisions.
        </p>
      </section>

      {/* Features with Icons */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-20">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl hover:scale-105 transition transform flex flex-col items-center text-center"
          >
            <div className="text-4xl mb-3">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-teal-700">{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* How It Works Accordion */}
      <section className="max-w-4xl mx-auto text-center mb-20">
        <h2 className="text-3xl font-bold text-teal-700 mb-6">How Stock Tracker Works</h2>
        <div className="text-gray-800 text-lg space-y-4">
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
