"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar,
  PieChart, Pie, Cell,
  AreaChart, Area
} from "recharts";

export default function HomePage() {
  const [showMore, setShowMore] = useState(false);
  const router = useRouter();

  // Dummy Stock Data
  const data = [
    { name: "Jan", price: 4000, profit: 2400, loss: 1200 },
    { name: "Feb", price: 3000, profit: 1398, loss: 2210 },
    { name: "Mar", price: 2000, profit: 9800, loss: 2290 },
    { name: "Apr", price: 2780, profit: 3908, loss: 2000 },
    { name: "May", price: 1890, profit: 4800, loss: 2181 },
    { name: "Jun", price: 2390, profit: 3800, loss: 2500 },
    { name: "Jul", price: 3490, profit: 4300, loss: 2100 },
  ];

  const pieData = [
    { name: "Tech", value: 40 },
    { name: "Finance", value: 30 },
    { name: "Energy", value: 20 },
    { name: "Healthcare", value: 10 },
  ];

  const COLORS = ["#10B981", "#14B8A6", "#22D3EE", "#3B82F6"];

  return (
    <main className="flex flex-col items-center text-center min-h-screen px-5 bg-gradient-to-br from-emerald-50 via-teal-100 to-cyan-100">
      {/* Hero Section */}
      <h1 className="text-5xl font-bold mb-6 mt-20 text-emerald-900">
        📈 Welcome to <span className="text-teal-700">Real-Time Stock Tracker</span>
      </h1>
      <p className="text-lg max-w-2xl mb-8 text-gray-800">
        Manage your stock portfolio, track real-time prices, calculate profit/loss, and make smarter investment decisions with secure authentication.
      </p>
      <div className="flex gap-10">
        <button
          className="px-6 py-3 rounded-2xl bg-teal-600 text-white hover:bg-teal-700 transition"
          onClick={() => router.push("/signup")}
        >
          Get Started
        </button>
        <button
          className="px-6 py-3 rounded-2xl border-2 border-teal-600 text-teal-600 hover:bg-teal-100 transition"
          onClick={() => setShowMore(!showMore)}
        >
          Learn More
        </button>
      </div>

      {/* Conditional Learn More Section */}
      {showMore && (
        <section className="mt-12 max-w-4xl bg-white p-8 rounded-2xl shadow-md text-left">
          <h2 className="text-3xl font-bold text-teal-700 mb-4">About the Project</h2>
          <p className="mb-4">
            This Real-Time Stock Portfolio Tracker allows users to manage their stocks, monitor live prices from market APIs, and calculate real-time profit & loss.
          </p>
          <p className="mb-4">
            Users can add, update, and remove stocks in their portfolio. Secure authentication with Firebase and JWT ensures only authorized access. Admins can optionally analyze trading trends.
          </p>
          <p className="mb-4">
            Future enhancements include stock watchlists, news feed, automated portfolio sync, price alerts, and advanced analytics with interactive charts.
          </p>
        </section>
      )}

      {/* Features Section */}
      <section className="mt-20 grid md:grid-cols-3 gap-8 max-w-6xl">
        {[
          { icon: "📂", title: "Manage Portfolio", desc: "Add, update, or remove stocks and track your holdings easily." },
          { icon: "⚡", title: "Real-Time Prices", desc: "Get live stock prices and market updates through external APIs." },
          { icon: "📊", title: "Profit & Loss", desc: "Analyze your portfolio performance with real-time profit/loss calculation." },
          { icon: "🔒", title: "Secure Authentication", desc: "Sign up and log in securely using Firebase Authentication with JWT tokens." },
          { icon: "📈", title: "Data Visualization", desc: "Interactive charts to visualize stock performance and historical trends." },
          { icon: "🛠️", title: "Admin Dashboard", desc: "Admins can analyze user trading trends and aggregated portfolios." },
        ].map((feature, i) => (
          <div key={i} className="p-6 rounded-2xl shadow-md bg-white">
            <h3 className="text-xl font-semibold mb-2">{feature.icon} {feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* Analytics Section with Charts */}
      <section className="mt-20 max-w-6xl w-full">
        <h2 className="text-3xl font-bold text-teal-700 mb-8">📊 Stock Analytics</h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Line Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">Stock Price Trend</h3>
            <LineChart width={400} height={250} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="price" stroke="#10B981" strokeWidth={3} />
            </LineChart>
          </div>

          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">Monthly Profit vs Loss</h3>
            <BarChart width={400} height={250} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="profit" fill="#14B8A6" />
              <Bar dataKey="loss" fill="#EF4444" />
            </BarChart>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">Portfolio Allocation</h3>
            <PieChart width={400} height={250}>
              <Pie
                data={pieData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          {/* Area Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">Cumulative Growth</h3>
            <AreaChart width={400} height={250} data={data}>
              <defs>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area type="monotone" dataKey="profit" stroke="#14B8A6" fillOpacity={1} fill="url(#colorProfit)" />
            </AreaChart>
          </div>
        </div>
      </section>
    </main>
  );
}
