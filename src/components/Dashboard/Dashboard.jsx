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
import { toast } from "react-toastify";

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
      const stocksData = res.data.stocks || [];

      const updatedStocks = await Promise.all(
        stocksData.map(async (stock) => {
          try {
            const priceRes = await axios.get(`${API_URL}/api/stocks/price?symbol=${stock.symbol}`, config);
            const profitRes = await axios.post(
              `${API_URL}/api/stocks/profit-loss`,
              { symbol: stock.symbol, buyPrice: stock.buyPrice, quantity: stock.quantity },
              config
            );

            return {
              ...stock,
              currentPrice: parseFloat(priceRes.data.currentPrice),
              profitLoss: profitRes.data.profitLoss,
            };
          } catch {
            return { ...stock, currentPrice: stock.buyPrice, profitLoss: 0 };
          }
        })
      );

      setStocks(updatedStocks);
    } catch (err) {
      console.error("Error fetching stocks:", err.response?.data || err.message);
      toast.error("Failed to fetch stocks");
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
        toast.success("Stock updated successfully");
      } else {
        await axios.post(`${API_URL}/api/dashboard/add`, form, config);
        fetchStocks();
        toast.success("Stock added successfully");
      }
      setForm({ symbol: "", quantity: "", buyPrice: "" });
    } catch (err) {
      console.error("Error saving stock:", err.response?.data || err.message);
      toast.error("Failed to save stock");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/dashboard/delete/${id}`, config);
      setStocks(stocks.filter(s => s._id !== id));
      toast.success("Stock deleted successfully");
    } catch (err) {
      console.error("Error deleting stock:", err.response?.data || err.message);
      toast.error("Failed to delete stock");
    }
  };

  const handleEdit = (stock) => {
    setForm({ symbol: stock.symbol, quantity: stock.quantity, buyPrice: stock.buyPrice });
    setEditingId(stock._id);
  };

  const totalInvestment = stocks.reduce((acc, s) => acc + s.buyPrice * s.quantity, 0);
  const totalProfit = stocks.reduce((acc, s) => acc + (s.profitLoss || 0), 0);

  // Line chart - Profit/Loss Trend with green/red per stock
  const lineData = useMemo(() => {
    const datasets = stocks.map(stock => ({
      label: stock.symbol,
      data: [stock.profitLoss || 0],
      borderColor: stock.profitLoss >= 0 ? "#10B981" : "#EF4444",
      backgroundColor: stock.profitLoss >= 0 ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
      fill: true,
      tension: 0.4,
    }));

    return {
      labels: stocks.map(s => s.symbol),
      datasets,
    };
  }, [stocks]);

  const lineOptions = { animation: { duration: 1000, easing: 'easeOutQuart' } };

  // Bar chart - Quantity
  const barData = useMemo(() => ({
    labels: stocks.map(s => s.symbol),
    datasets: [{
      label: "Quantity",
      data: stocks.map(s => s.quantity),
      backgroundColor: [
        "#EF4444", "#F59E0B", "#10B981", "#3B82F6",
        "#8B5CF6", "#EC4899", "#14B8A6", "#F43F5E",
        "#6366F1", "#22C55E",
      ],
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
    <div className="min-h-screen p-6 bg-gradient-to-br from-emerald-50 via-teal-100 to-cyan-100">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-teal-700">
        Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/90 p-4 rounded-xl shadow-lg text-center border border-teal-200">
          <h3 className="text-sm font-semibold text-gray-700">Total Investment</h3>
          <p className="text-lg font-bold text-teal-700">₹{totalInvestment}</p>
        </div>
        <div className="bg-white/90 p-4 rounded-xl shadow-lg text-center border border-teal-200">
          <h3 className="text-sm font-semibold text-gray-700">Total Profit/Loss</h3>
          <p className={`text-lg font-bold ${totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
            ₹{totalProfit}
          </p>
        </div>
        <div className="bg-white/90 p-4 rounded-xl shadow-lg text-center border border-teal-200">
          <h3 className="text-sm font-semibold text-gray-700">Stocks</h3>
          <p className="text-lg font-bold text-teal-700">{stocks.length}</p>
        </div>
      </div>

      {/* Form */}
<form
  onSubmit={handleSubmit}
  className="bg-white/90 p-4 rounded-xl shadow-lg mb-6 flex flex-col md:flex-row gap-4 items-end border border-teal-200"
>
  {/* Company Dropdown */}
  <select
  className="border p-2 rounded-lg w-full md:w-1/4 focus:ring-2 focus:ring-teal-400"
  value={form.symbol}
  onChange={(e) => setForm({ ...form, symbol: e.target.value })}
  required
>
  <option value="">-- Select Company --</option>
  <option value="AAPL">Apple (AAPL)</option>
  <option value="MSFT">Microsoft (MSFT)</option>
  <option value="GOOGL">Alphabet / Google (GOOGL)</option>
  <option value="AMZN">Amazon (AMZN)</option>
  <option value="TSLA">Tesla (TSLA)</option>
  <option value="META">Meta Platforms (META)</option>
  <option value="NFLX">Netflix (NFLX)</option>
  <option value="NVDA">NVIDIA (NVDA)</option>
  <option value="AMD">Advanced Micro Devices (AMD)</option>
  <option value="INTC">Intel (INTC)</option>
  <option value="IBM">IBM (IBM)</option>
  <option value="ORCL">Oracle (ORCL)</option>
  <option value="SAP">SAP (SAP)</option>
  <option value="ADBE">Adobe (ADBE)</option>
  <option value="CRM">Salesforce (CRM)</option>
  <option value="UBER">Uber (UBER)</option>
  <option value="LYFT">Lyft (LYFT)</option>
  <option value="PYPL">PayPal (PYPL)</option>
  <option value="SQ">Block / Square (SQ)</option>
  <option value="SHOP">Shopify (SHOP)</option>
  <option value="TWTR">Twitter (TWTR)</option>
  <option value="SNAP">Snap (SNAP)</option>
  <option value="ZM">Zoom Video (ZM)</option>
  <option value="DIS">Walt Disney (DIS)</option>
  <option value="SBUX">Starbucks (SBUX)</option>
  <option value="NKE">Nike (NKE)</option>
  <option value="MCD">McDonald's (MCD)</option>
  <option value="KO">Coca-Cola (KO)</option>
  <option value="PEP">PepsiCo (PEP)</option>
  <option value="WMT">Walmart (WMT)</option>
  <option value="COST">Costco (COST)</option>
  <option value="TGT">Target (TGT)</option>
  <option value="PG">Procter & Gamble (PG)</option>
  <option value="JNJ">Johnson & Johnson (JNJ)</option>
  <option value="UNH">UnitedHealth (UNH)</option>
  <option value="PFE">Pfizer (PFE)</option>
  <option value="MRNA">Moderna (MRNA)</option>
  <option value="XOM">Exxon Mobil (XOM)</option>
  <option value="CVX">Chevron (CVX)</option>
  <option value="BP">BP (BP)</option>
  <option value="JPM">JPMorgan Chase (JPM)</option>
  <option value="BAC">Bank of America (BAC)</option>
  <option value="C">Citigroup (C)</option>
  <option value="GS">Goldman Sachs (GS)</option>
  <option value="MS">Morgan Stanley (MS)</option>
  <option value="V">Visa (V)</option>
  <option value="MA">Mastercard (MA)</option>
  <option value="AXP">American Express (AXP)</option>
</select>
  {/* Quantity */}
  <input
    type="number"
    placeholder="Quantity"
    className="border p-2 rounded-lg w-full md:w-1/4 focus:ring-2 focus:ring-teal-400"
    value={form.quantity}
    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
    required
  />

  {/* Buy Price */}
  <input
    type="number"
    placeholder="Buy Price"
    className="border p-2 rounded-lg w-full md:w-1/4 focus:ring-2 focus:ring-teal-400"
    value={form.buyPrice}
    onChange={(e) => setForm({ ...form, buyPrice: e.target.value })}
    required
  />

  {/* Submit Button */}
  <button
    type="submit"
    className="bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 text-white px-6 py-2 rounded-lg shadow-md hover:opacity-90 transition transform hover:scale-105"
  >
    {editingId ? "Update" : "Add"} Stock
  </button>
</form>


      {/* Stock Table */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white/90 shadow-lg rounded-xl overflow-hidden border border-teal-200">
          <thead className="bg-gradient-to-r from-teal-200 via-emerald-200 to-cyan-200">
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
            {stocks.map((stock) => (
              <tr key={stock._id} className="border-b">
                <td className="py-3 px-6">{stock.symbol}</td>
                <td className="py-3 px-6">{stock.quantity}</td>
                <td className="py-3 px-6">₹{stock.buyPrice}</td>
                <td className="py-3 px-6">₹{stock.currentPrice}</td>
                <td className={`py-3 px-6 ${stock.profitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ₹{stock.profitLoss}
                </td>
                <td className="py-3 px-6 space-x-2">
                  <button className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500" onClick={() => handleEdit(stock)}>Edit</button>
                  <button className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-white" onClick={() => handleDelete(stock._id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white/90 p-4 rounded-xl shadow-lg border border-teal-200">
          <h2 className="text-lg font-semibold mb-2 text-teal-700">Profit/Loss Trend</h2>
          <Line data={lineData} options={lineOptions} />
        </div>
        <div className="bg-white/90 p-4 rounded-xl shadow-lg border border-teal-200">
          <h2 className="text-lg font-semibold mb-2 text-teal-700">Quantity per Stock</h2>
          <Bar data={barData} />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-[500px]">
          <h2 className="text-lg font-semibold mb-2 text-teal-700 text-center">Investment Distribution</h2>
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
    </div>
  );
}
