"use client";
import React from "react";

export default function Services() {
  const services = [
    { icon: "📊", title: "Real-Time Stock Updates", desc: "Get live prices and market trends instantly." },
    { icon: "💹", title: "Profit & Loss Analysis", desc: "Calculate portfolio gains and losses in real-time." },
    { icon: "🔒", title: "Secure Authentication", desc: "Protect your account with Firebase and JWT tokens." },
    { icon: "📈", title: "Data Visualization", desc: "Interactive charts to visualize your stock performance." },
    { icon: "🛠️", title: "Admin Dashboard", desc: "Analyze user activity and portfolio statistics." },
    { icon: "⚡", title: "Smart Alerts", desc: "Receive notifications for stock price changes and trends." },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-100 to-cyan-100 text-gray-800 px-6 py-16">
      
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-emerald-900">
          Our <span className="text-teal-700 font-extrabold">Services</span>
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Explore the key features and services provided by Stock Tracker to manage your portfolio efficiently.
        </p>
      </section>

      {/* Services Grid */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl hover:scale-105 transition transform flex flex-col items-center text-center"
          >
            <div className="text-4xl mb-3">{service.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-teal-700">{service.title}</h3>
            <p>{service.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
