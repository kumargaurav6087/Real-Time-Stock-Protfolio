"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const [stocks, setStocks] = useState([]);
  const [form, setForm] = useState({ symbol: "", quantity: "", buyPrice: "" });
  const [editingId, setEditingId] = useState(null);
  const [token, setToken] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchStocks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/dashboard/`, config);
      setStocks(res.data.stocks || []);
    } catch (err) {
      console.error("Error fetching stocks:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (token) fetchStocks();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/dashboard/update/${editingId}`, form, config);
        setStocks(stocks.map(s => s._id === editingId ? { ...s, ...form } : s));
        setEditingId(null);
      } else {
        await axios.post(`${API_URL}/api/dashboard/add`, form, config);
        fetchStocks();
      }
      setForm({ symbol: "", quantity: "", buyPrice: "" });
    } catch (err) {
      console.error("Error saving stock:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/dashboard/delete/${id}`, config);
      setStocks(stocks.filter(s => s._id !== id));
    } catch (err) {
      console.error("Error deleting stock:", err.response?.data || err.message);
    }
  };

  const handleEdit = (stock) => {
    setForm({ symbol: stock.symbol, quantity: stock.quantity, buyPrice: stock.buyPrice });
    setEditingId(stock._id);
  };

  // Stats
  const totalInvestment = stocks.reduce((acc, s) => acc + s.buyPrice * s.quantity, 0);
  const totalProfit = stocks.reduce((acc, s) => acc + ((s.currentPrice || s.buyPrice) - s.buyPrice) * s.quantity, 0);

  // Line chart - Profit/Loss
  const lineData = useMemo(() => ({
    labels: stocks.map(s => s.symbol),
    datasets: [{
      label: "Profit/Loss",
      data: stocks.map(s => ((s.currentPrice || s.buyPrice) - s.buyPrice) * s.quantity),
      borderColor: "rgb(236,72,153)",
      backgroundColor: "rgba(236,72,153,0.2)",
      tension: 0.4,
    }],
  }), [stocks]);

  const lineOptions = { animation: { duration: 1000, easing: 'easeOutQuart' } };

  // Bar chart - Quantity
  const barData = useMemo(() => ({
    labels: stocks.map(s => s.symbol),
    datasets: [{
      label: "Quantity",
      data: stocks.map(s => s.quantity),
      backgroundColor: "rgba(139,92,246,0.7)",
    }],
  }), [stocks]);

  // Pie chart - Investment distribution
  const pieData = useMemo(() => ({
    labels: stocks.map(s => s.symbol),
    datasets: [{
      label: "Investment",
      data: stocks.map(s => s.buyPrice * s.quantity),
      backgroundColor: [
        "#EF4444", "#F59E0B", "#10B981", "#3B82F6",
        "#8B5CF6", "#EC4899", "#14B8A6", "#F43F5E",
        "#6366F1", "#22C55E",
      ],
      borderColor: "#fff",
      borderWidth: 2,
    }],
  }), [stocks]);

  const pieOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            let value = context.raw;
            let total = context.dataset.data.reduce((a, b) => a + b, 0);
            let percentage = ((value / total) * 100).toFixed(2);
            return `${context.label}: ₹${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-purple-50 via-pink-100 to-indigo-200">
      <h1 className="text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
        Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/90 p-4 rounded-xl shadow-lg text-center border border-pink-200">
          <h3 className="text-sm font-semibold text-gray-700">Total Investment</h3>
          <p className="text-lg font-bold text-indigo-600">₹{totalInvestment}</p>
        </div>
        <div className="bg-white/90 p-4 rounded-xl shadow-lg text-center border border-purple-200">
          <h3 className="text-sm font-semibold text-gray-700">Total Profit/Loss</h3>
          <p className={`text-lg font-bold ${totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
            ₹{totalProfit}
          </p>
        </div>
        <div className="bg-white/90 p-4 rounded-xl shadow-lg text-center border border-indigo-200">
          <h3 className="text-sm font-semibold text-gray-700">Stocks</h3>
          <p className="text-lg font-bold text-pink-600">{stocks.length}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white/90 p-4 rounded-xl shadow-lg mb-6 flex flex-col md:flex-row gap-4 items-end border border-purple-200">
        <input type="text" placeholder="Company" className="border p-2 rounded-lg w-full md:w-1/4 focus:ring-2 focus:ring-pink-400"
          value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value })} required />
        <input type="number" placeholder="Quantity" className="border p-2 rounded-lg w-full md:w-1/4 focus:ring-2 focus:ring-purple-400"
          value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
        <input type="number" placeholder="Buy Price" className="border p-2 rounded-lg w-full md:w-1/4 focus:ring-2 focus:ring-indigo-400"
          value={form.buyPrice} onChange={(e) => setForm({ ...form, buyPrice: e.target.value })} required />
        <button type="submit" className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:opacity-90 transition transform hover:scale-105">
          {editingId ? "Update" : "Add"} Stock
        </button>
      </form>

      {/* Stock Table */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white/90 shadow-lg rounded-xl overflow-hidden border border-pink-200">
          <thead className="bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200">
            <tr>
              <th className="py-3 px-6 text-left">Company</th>
              <th className="py-3 px-6 text-left">Quantity</th>
              <th className="py-3 px-6 text-left">Buy Price</th>
              <th className="py-3 px-6 text-left">Current Price</th>
              <th className="py-3 px-6 text-left">Profit/Loss</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => {
              const profit = ((stock.currentPrice || stock.buyPrice) - stock.buyPrice) * stock.quantity;
              return (
                <tr key={stock._id} className="border-b">
                  <td className="py-3 px-6">{stock.symbol}</td>
                  <td className="py-3 px-6">{stock.quantity}</td>
                  <td className="py-3 px-6">₹{stock.buyPrice}</td>
                  <td className="py-3 px-6">₹{stock.currentPrice || stock.buyPrice}</td>
                  <td className={`py-3 px-6 ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                    ₹{profit}
                  </td>
                  <td className="py-3 px-6 space-x-2">
                    <button className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500" onClick={() => handleEdit(stock)}>Edit</button>
                    <button className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-white" onClick={() => handleDelete(stock._id)}>Delete</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white/90 p-4 rounded-xl shadow-lg border border-pink-200">
          <h2 className="text-lg font-semibold mb-2 text-pink-600">Profit/Loss Trend</h2>
          <Line data={lineData} options={lineOptions} />
        </div>
        <div className="bg-white/90 p-4 rounded-xl shadow-lg border border-purple-200">
          <h2 className="text-lg font-semibold mb-2 text-purple-600">Quantity per Stock</h2>
          <Bar data={barData} />
        </div>
      </div>

      {/* ✅ Pie Chart Centered */}
      <div className="flex justify-center">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-[500px]">
          <h2 className="text-lg font-semibold mb-2 text-indigo-600 text-center">Investment Distribution</h2>
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
    </div>
  );
}
