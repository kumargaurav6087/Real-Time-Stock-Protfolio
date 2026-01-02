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

// "use client";

// import { useState } from "react";
// import { Trophy, Star, Clock, Users, BookOpen, Code, Home, User, Award } from "lucide-react";

// // Complete programming languages with their quizzes
// const programmingLanguages = [
//   {
//     id: "javascript",
//     name: "JavaScript",
//     icon: "🟨",
//     description: "Master modern JavaScript concepts",
//     color: "from-yellow-400 to-orange-500",
//     quizzes: {
//       easy: [
//         { question: "Which method adds an element to the end of an array?", options: ["push()", "pop()", "shift()", "unshift()"], answer: "push()" },
//         { question: "Which operator is used for strict equality?", options: ["==", "===", "=", "!="], answer: "===" },
//         { question: "What does 'typeof null' return?", options: ["null", "undefined", "object", "boolean"], answer: "object" },
//         { question: "Which method converts JSON string to JavaScript object?", options: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.object()"], answer: "JSON.parse()" },
//         { question: "Which event occurs when the user clicks on an HTML element?", options: ["onchange", "onclick", "onmouseclick", "onmouseover"], answer: "onclick" },
//         { question: "How do you write 'Hello World' in an alert box?", options: ["alertBox('Hello World')", "msg('Hello World')", "alert('Hello World')", "msgBox('Hello World')"], answer: "alert('Hello World')" },
//         { question: "Which method removes the last element from an array?", options: ["pop()", "push()", "shift()", "unshift()"], answer: "pop()" },
//         { question: "What is the correct way to declare a variable?", options: ["var x = 5", "variable x = 5", "declare x = 5", "x := 5"], answer: "var x = 5" },
//         { question: "Which function checks if a value is NaN?", options: ["isNaN()", "checkNaN()", "NaN()", "isNotNumber()"], answer: "isNaN()" },
//         { question: "What keyword is used to declare constants?", options: ["const", "constant", "final", "static"], answer: "const" }
//       ],
//       medium: [
//         { question: "What is closure in JavaScript?", options: ["A way to close the browser", "A function that has access to outer scope", "A method to end loops", "A CSS property"], answer: "A function that has access to outer scope" },
//         { question: "Which method is used to combine arrays?", options: ["concat()", "combine()", "merge()", "join()"], answer: "concat()" },
//         { question: "What does 'this' keyword refer to?", options: ["The current function", "The current object", "The global object", "The parent element"], answer: "The current object" },
//         { question: "What is the difference between let and var?", options: ["No difference", "let has block scope, var has function scope", "let is faster", "var is deprecated"], answer: "let has block scope, var has function scope" },
//         { question: "Which method returns a new array with filtered elements?", options: ["map()", "filter()", "reduce()", "forEach()"], answer: "filter()" }
//       ],
//       Advance: [
//         { question: "What is the output of: console.log(0.1 + 0.2 === 0.3)?", options: ["true", "false", "undefined", "NaN"], answer: "false" },
//         { question: "What is prototype chain?", options: ["A way to chain functions", "Object inheritance mechanism", "Array of prototypes", "Design pattern"], answer: "Object inheritance mechanism" },
//         { question: "What does 'hoisting' mean?", options: ["Lifting heavy objects", "Variable declarations are moved to top", "Optimizing code", "Error handling"], answer: "Variable declarations are moved to top" },
//         { question: "What is the difference between call() and apply()?", options: ["No difference", "call() takes arguments separately, apply() takes array", "apply() is faster", "call() is deprecated"], answer: "call() takes arguments separately, apply() takes array" },
//         { question: "What is currying?", options: ["Spicing up code", "Transforming function with multiple args to sequence", "Error handling", "Optimization method"], answer: "Transforming function with multiple args to sequence" }
//       ]
//     }
//   },
//   {
//     id: "python",
//     name: "Python",
//     icon: "🐍",
//     description: "Learn Python programming fundamentals",
//     color: "from-blue-400 to-green-500",
//     quizzes: {
//       easy: [
//         { question: "Which keyword defines a function?", options: ["func", "def", "function", "lambda"], answer: "def" },
//         { question: "Which data type is mutable?", options: ["tuple", "string", "list", "int"], answer: "list" },
//         { question: "How do you create a comment?", options: ["// comment", "<!-- comment -->", "# comment", "/* comment */"], answer: "# comment" },
//         { question: "Which method adds an item to a list?", options: ["add()", "append()", "insert()", "push()"], answer: "append()" },
//         { question: "How do you create a dictionary?", options: ["dict = {}", "dict = []", "dict = ()", "dict = \"\""], answer: "dict = {}" }
//       ],
//       medium: [
//         { question: "What is list comprehension?", options: ["List documentation", "Concise way to create lists", "List sorting method", "List copying technique"], answer: "Concise way to create lists" },
//         { question: "How do you remove an item from a list?", options: ["delete()", "remove()", "pop()", "Both remove() and pop()"], answer: "Both remove() and pop()" },
//         { question: "What is the difference between == and is?", options: ["No difference", "== compares values, is compares identity", "is compares values", "Both compare identity"], answer: "== compares values, is compares identity" },
//         { question: "What is a lambda function?", options: ["Regular function", "Anonymous function", "Class method", "Built-in function"], answer: "Anonymous function" },
//         { question: "Which method sorts a list?", options: ["sort()", "sorted()", "Both sort() and sorted()", "order()"], answer: "Both sort() and sorted()" }
//       ],
//       Advance: [
//         { question: "What is a decorator?", options: ["Design pattern", "Function that modifies another function", "Class attribute", "Loop construct"], answer: "Function that modifies another function" },
//         { question: "Difference between deep copy and shallow copy?", options: ["No difference", "Deep copy copies all levels, shallow one level", "Shallow is faster", "Deep uses less memory"], answer: "Deep copy copies all levels, shallow one level" },
//         { question: "What is a generator?", options: ["Function that returns iterator", "Class method", "Built-in function", "Loop type"], answer: "Function that returns iterator" },
//         { question: "What does yield do?", options: ["Returns value and pauses function", "Stops function", "Creates variable", "Imports module"], answer: "Returns value and pauses function" },
//         { question: "What is multiple inheritance?", options: ["Class inheriting from multiple classes", "Multiple objects of same class", "Class with multiple methods", "Multiple variables"], answer: "Class inheriting from multiple classes" }
//       ]
//     }
//   },
//   {
//     id: "react",
//     name: "React",
//     icon: "⚛️",
//     description: "Build modern web applications",
//     color: "from-blue-400 to-cyan-500",
//     quizzes: {
//       easy: [
//         { question: "What is React?", options: ["JavaScript library for building UIs", "Database", "Programming language", "Web server"], answer: "JavaScript library for building UIs" },
//         { question: "Which hook is used for state?", options: ["useEffect", "useState", "useContext", "useReducer"], answer: "useState" },
//         { question: "What is JSX?", options: ["JavaScript XML", "Java Extension", "JSON XML", "JavaScript Export"], answer: "JavaScript XML" },
//         { question: "How do you create a React component?", options: ["function Component() {}", "class Component {}", "Both function and class", "component Component() {}"], answer: "Both function and class" },
//         { question: "Which method renders React elements?", options: ["ReactDOM.render()", "React.render()", "render()", "display()"], answer: "ReactDOM.render()" }
//       ],
//       medium: [
//         { question: "Difference between state and props?", options: ["No difference", "State is mutable, props are immutable", "Props are mutable", "Both are immutable"], answer: "State is mutable, props are immutable" },
//         { question: "What is React Router for?", options: ["State management", "Routing in single page applications", "API calls", "Styling"], answer: "Routing in single page applications" },
//         { question: "What is the purpose of keys in lists?", options: ["Styling", "Help React identify changed items", "Event handling", "State management"], answer: "Help React identify changed items" },
//         { question: "What is lifting state up?", options: ["Moving state to parent component", "Optimizing performance", "Creating new state", "Deleting state"], answer: "Moving state to parent component" },
//         { question: "What is conditional rendering?", options: ["Rendering based on conditions", "Rendering multiple components", "Server-side rendering", "Lazy loading"], answer: "Rendering based on conditions" }
//       ],
//       Advance: [
//         { question: "What is React Fiber?", options: ["React library", "New reconciliation algorithm", "Component type", "Hook system"], answer: "New reconciliation algorithm" },
//         { question: "Difference between useCallback and useMemo?", options: ["No difference", "useCallback memoizes functions, useMemo values", "useMemo is faster", "useCallback deprecated"], answer: "useCallback memoizes functions, useMemo values" },
//         { question: "What is React Suspense?", options: ["Error boundary", "Component for handling async operations", "State management", "Routing solution"], answer: "Component for handling async operations" },
//         { question: "What is React.forwardRef() for?", options: ["Performance optimization", "Forwards refs to child components", "State management", "Event handling"], answer: "Forwards refs to child components" },
//         { question: "What is render prop pattern?", options: ["Component property", "Sharing code using prop whose value is function", "Rendering optimization", "State pattern"], answer: "Sharing code using prop whose value is function" }
//       ]
//     }
//   },
//   {
//     id: "java",
//     name: "Java",
//     icon: "☕",
//     description: "Object-oriented programming mastery",
//     color: "from-red-500 to-orange-600",
//     quizzes: {
//       easy: [
//         { question: "Which keyword creates a class?", options: ["class", "Class", "create", "new"], answer: "class" },
//         { question: "What is the main method signature?", options: ["public static void main(String[] args)", "public void main(String args)", "static void main(String[] args)", "public main(String[] args)"], answer: "public static void main(String[] args)" },
//         { question: "Which data type stores whole numbers?", options: ["float", "double", "int", "char"], answer: "int" },
//         { question: "What is the size of int?", options: ["2 bytes", "4 bytes", "8 bytes", "1 byte"], answer: "4 bytes" },
//         { question: "Which operator concatenates strings?", options: ["+", "&", ".", "++"], answer: "+" },
//         { question: "How do you declare an array?", options: ["int arr[]", "int[] arr", "Both int arr[] and int[] arr", "array int arr"], answer: "Both int arr[] and int[] arr" },
//         { question: "Which keyword is for inheritance?", options: ["inherits", "extends", "implements", "inherit"], answer: "extends" },
//         { question: "What does JVM stand for?", options: ["Java Virtual Machine", "Java Variable Method", "Java Visual Machine", "Java Version Manager"], answer: "Java Virtual Machine" },
//         { question: "Which access modifier is most restrictive?", options: ["public", "private", "protected", "default"], answer: "private" },
//         { question: "What is the wrapper class for int?", options: ["Int", "Integer", "Number", "Wrapper"], answer: "Integer" }
//       ],
//       medium: [
//         { question: "What is method overloading?", options: ["Same method name with different parameters", "Same method with same parameters", "Different method names", "Method with many parameters"], answer: "Same method name with different parameters" },
//         { question: "Abstract class vs interface?", options: ["No difference", "Abstract class can have concrete methods", "Interface is faster", "Abstract class deprecated"], answer: "Abstract class can have concrete methods" },
//         { question: "What is polymorphism?", options: ["Multiple forms", "One interface, multiple implementations", "Inheritance", "Encapsulation"], answer: "One interface, multiple implementations" },
//         { question: "What is finally block for?", options: ["Handle exceptions", "Execute code regardless of exception", "End program", "Initialize variables"], answer: "Execute code regardless of exception" },
//         { question: "Difference between == and equals()?", options: ["No difference", "== compares references, equals() content", "equals() compares references", "Both compare content"], answer: "== compares references, equals() content" },
//         { question: "What is encapsulation?", options: ["Data hiding", "Inheritance", "Polymorphism", "Abstraction"], answer: "Data hiding" },
//         { question: "What is constructor overloading?", options: ["Multiple constructors with different parameters", "Single constructor", "No constructors", "Constructor inheritance"], answer: "Multiple constructors with different parameters" },
//         { question: "What is static keyword for?", options: ["Create instance variables", "Create class-level variables/methods", "Prevent inheritance", "Handle exceptions"], answer: "Create class-level variables/methods" },
//         { question: "What is garbage collection?", options: ["Manual memory management", "Automatic memory management", "Code optimization", "Error handling"], answer: "Automatic memory management" },
//         { question: "String vs StringBuilder?", options: ["No difference", "String immutable, StringBuilder mutable", "StringBuilder slower", "String deprecated"], answer: "String immutable, StringBuilder mutable" }
//       ],
//       Advance: [
//         { question: "What is reflection?", options: ["Mirror image", "Ability to inspect classes at runtime", "Code duplication", "Performance optimization"], answer: "Ability to inspect classes at runtime" },
//         { question: "HashMap vs ConcurrentHashMap?", options: ["No difference", "ConcurrentHashMap is thread-safe", "HashMap is faster", "ConcurrentHashMap deprecated"], answer: "ConcurrentHashMap is thread-safe" },
//         { question: "What is functional interface?", options: ["Interface with multiple methods", "Interface with exactly one abstract method", "Deprecated interface", "Performance interface"], answer: "Interface with exactly one abstract method" },
//         { question: "What is volatile for?", options: ["Prevent inheritance", "Ensure variable visibility across threads", "Optimize performance", "Handle exceptions"], answer: "Ensure variable visibility across threads" },
//         { question: "What is lambda expression?", options: ["Anonymous function", "Class method", "Interface implementation", "Design pattern"], answer: "Anonymous function" },
//         { question: "What is Stream API?", options: ["File handling", "Functional-style operations on collections", "Network communication", "Database connection"], answer: "Functional-style operations on collections" },
//         { question: "Fail-fast vs fail-safe iterators?", options: ["No difference", "Fail-fast throws exception on modification", "Fail-safe is faster", "Both throw exceptions"], answer: "Fail-fast throws exception on modification" },
//         { question: "What is deadlock?", options: ["Program termination", "Circular dependency of threads waiting", "Memory leak", "Performance issue"], answer: "Circular dependency of threads waiting" },
//         { question: "What is synchronized for?", options: ["Synchronize time", "Provide thread safety", "Optimize performance", "Handle exceptions"], answer: "Provide thread safety" },
//         { question: "What are generics?", options: ["General methods", "Type safety feature allowing parameterized types", "Performance optimization", "Error handling"], answer: "Type safety feature allowing parameterized types" }
//       ]
//     }
//   },
//   {
//     id: "cpp",
//     name: "C++",
//     icon: "🔧",
//     description: "System programming and algorithms",
//     color: "from-purple-500 to-blue-600",
//     quizzes: {
//       easy: [
//         { question: "Which header for input/output?", options: ["<stdio.h>", "<iostream>", "<conio.h>", "<iomanip>"], answer: "<iostream>" },
//         { question: "How to output 'Hello World'?", options: ["cout << 'Hello World';", "cout << \"Hello World\";", "printf('Hello World');", "print('Hello World');"], answer: "cout << \"Hello World\";" },
//         { question: "Which operator accesses class members?", options: [".", "::", "->", "&"], answer: "." },
//         { question: "Size of int in modern systems?", options: ["2 bytes", "4 bytes", "8 bytes", "1 byte"], answer: "4 bytes" },
//         { question: "Which keyword defines a class?", options: ["class", "Class", "struct", "object"], answer: "class" },
//         { question: "How to declare a pointer?", options: ["int ptr*;", "int *ptr;", "int &ptr;", "pointer int ptr;"], answer: "int *ptr;" },
//         { question: "Which loop executes at least once?", options: ["for", "while", "do-while", "foreach"], answer: "do-while" },
//         { question: "What does endl do?", options: ["End program", "End line and flush buffer", "End function", "End class"], answer: "End line and flush buffer" },
//         { question: "Which keyword for dynamic memory allocation?", options: ["malloc", "new", "alloc", "create"], answer: "new" },
//         { question: "What is scope resolution operator?", options: [".", "::", "->", "&"], answer: "::" }
//       ],
//       medium: [
//         { question: "What is constructor overloading?", options: ["Multiple constructors with different parameters", "Single constructor", "No constructors", "Constructor inheritance"], answer: "Multiple constructors with different parameters" },
//         { question: "Public vs private members?", options: ["No difference", "Public accessible outside, private within class", "Private is faster", "Public deprecated"], answer: "Public accessible outside, private within class" },
//         { question: "What is inheritance?", options: ["Code duplication", "Acquiring properties of parent class", "Error handling", "Performance optimization"], answer: "Acquiring properties of parent class" },
//         { question: "What is polymorphism?", options: ["Multiple forms", "One interface, multiple implementations", "Inheritance", "Encapsulation"], answer: "One interface, multiple implementations" },
//         { question: "What are virtual functions for?", options: ["Virtual memory", "Runtime polymorphism", "Compile-time optimization", "Error handling"], answer: "Runtime polymorphism" },
//         { question: "delete vs delete[]?", options: ["No difference", "delete for single object, delete[] for arrays", "delete[] is faster", "delete deprecated"], answer: "delete for single object, delete[] for arrays" },
//         { question: "What is function overloading?", options: ["Same function name with different parameters", "Same function with same parameters", "Different function names", "Function with many parameters"], answer: "Same function name with different parameters" },
//         { question: "What is const for?", options: ["Make variable faster", "Make variable unchangeable", "Optimize memory", "Handle errors"], answer: "Make variable unchangeable" },
//         { question: "What is reference?", options: ["Pointer to pointer", "Alias for existing variable", "Memory location", "Function parameter"], answer: "Alias for existing variable" },
//         { question: "struct vs class?", options: ["No difference", "struct members public by default, class private", "struct is faster", "class deprecated"], answer: "struct members public by default, class private" }
//       ],
//       Advance: [
//         { question: "What is multiple inheritance?", options: ["Class inheriting from multiple classes", "Multiple objects of same class", "Class with multiple methods", "Multiple variables in class"], answer: "Class inheriting from multiple classes" },
//         { question: "What is diamond problem?", options: ["Shape drawing", "Ambiguity in multiple inheritance", "Memory leak", "Performance issue"], answer: "Ambiguity in multiple inheritance" },
//         { question: "What is template?", options: ["Design pattern", "Generic programming feature", "Class type", "Function type"], answer: "Generic programming feature" },
//         { question: "What is RAII?", options: ["Random Access Array", "Resource Acquisition Is Initialization", "Runtime Array Index", "Recursive Algorithm"], answer: "Resource Acquisition Is Initialization" },
//         { question: "What is smart pointer?", options: ["Intelligent pointer", "Automatic memory management pointer", "Fast pointer", "Secure pointer"], answer: "Automatic memory management pointer" },
//         { question: "Stack vs heap?", options: ["No difference", "Stack is automatic, heap is dynamic", "Heap is faster", "Stack is larger"], answer: "Stack is automatic, heap is dynamic" },
//         { question: "What is move semantics?", options: ["Object movement", "Efficient transfer of resources", "Code relocation", "Memory optimization"], answer: "Efficient transfer of resources" },
//         { question: "What is lambda expression?", options: ["Mathematical function", "Anonymous function", "Greek letter", "Performance optimization"], answer: "Anonymous function" },
//         { question: "What is perfect forwarding?", options: ["Best forwarding method", "Preserving value category in template forwarding", "Error-free forwarding", "Fast forwarding"], answer: "Preserving value category in template forwarding" },
//         { question: "What is SFINAE?", options: ["Special Function Implementation", "Substitution Failure Is Not An Error", "Static Function Analysis", "Structured Function Architecture"], answer: "Substitution Failure Is Not An Error" }
//       ]
//     }
//   },
//   {
//     id: "html-css",
//     name: "HTML & CSS",
//     icon: "🎨",
//     description: "Web design and styling",
//     color: "from-pink-400 to-red-500",
//     quizzes: {
//       easy: [
//         { question: "What does HTML stand for?", options: ["HyperText Markup Language", "HyperText Machine Language", "Hyperlink Text Markup Language", "Home Tool Markup Language"], answer: "HyperText Markup Language" },
//         { question: "Which tag creates a paragraph?", options: ["<p>", "<paragraph>", "<para>", "<pg>"], answer: "<p>" },
//         { question: "Which CSS property changes text color?", options: ["color", "font-color", "text-color", "bg-color"], answer: "color" },
//         { question: "Which tag creates a link?", options: ["<link>", "<a>", "<href>", "<url>"], answer: "<a>" },
//         { question: "Which tag creates the largest heading?", options: ["<h1>", "<h6>", "<heading>", "<head>"], answer: "<h1>" },
//         { question: "Which CSS property changes background color?", options: ["bg-color", "background-color", "color", "background"], answer: "background-color" },
//         { question: "Which tag creates a list item?", options: ["<li>", "<list>", "<item>", "<ul>"], answer: "<li>" },
//         { question: "Which CSS property controls text size?", options: ["font-size", "text-size", "size", "font"], answer: "font-size" },
//         { question: "Which tag creates a line break?", options: ["<break>", "<br>", "<lb>", "<newline>"], answer: "<br>" },
//         { question: "Which CSS property adds space inside an element?", options: ["margin", "padding", "spacing", "border"], answer: "padding" }
//       ],
//       medium: [
//         { question: "What is CSS flexbox used for?", options: ["Database queries", "Layout design", "Animation", "Color management"], answer: "Layout design" },
//         { question: "Which CSS selector targets all elements?", options: ["*", "all", "#all", ".all"], answer: "*" },
//         { question: "What does DOCTYPE declare?", options: ["CSS version", "HTML version and document type", "JavaScript version", "Browser type"], answer: "HTML version and document type" },
//         { question: "Which CSS property makes text bold?", options: ["font-weight", "text-bold", "bold", "font-bold"], answer: "font-weight" },
//         { question: "What is the box model?", options: ["3D modeling", "Content, padding, border, margin", "Color model", "Layout model"], answer: "Content, padding, border, margin" },
//         { question: "Which HTML tag is semantic?", options: ["<div>", "<span>", "<section>", "<b>"], answer: "<section>" },
//         { question: "How to center a div?", options: ["text-align: center", "margin: auto", "center: true", "align: center"], answer: "margin: auto" },
//         { question: "What is CSS Grid?", options: ["Image grid", "2D layout system", "Table layout", "Menu system"], answer: "2D layout system" },
//         { question: "Which CSS unit is relative?", options: ["px", "em", "cm", "mm"], answer: "em" },
//         { question: "What is responsive design?", options: ["Fast loading", "Adapts to screen sizes", "Interactive design", "Colorful design"], answer: "Adapts to screen sizes" }
//       ],
//       Advance: [
//         { question: "What is CSS specificity?", options: ["CSS speed", "Rule priority calculation", "CSS validation", "Code quality"], answer: "Rule priority calculation" },
//         { question: "What is a CSS preprocessor?", options: ["CSS validator", "Language that compiles to CSS", "CSS optimizer", "Browser engine"], answer: "Language that compiles to CSS" },
//         { question: "What is the cascade in CSS?", options: ["Waterfall effect", "Style inheritance and precedence", "Animation type", "Layout method"], answer: "Style inheritance and precedence" },
//         { question: "What is BEM methodology?", options: ["Block Element Modifier", "Browser Extension Method", "Basic Element Management", "Best Execution Model"], answer: "Block Element Modifier" },
//         { question: "What is critical CSS?", options: ["Important CSS rules", "Above-the-fold CSS", "Error-handling CSS", "Performance CSS"], answer: "Above-the-fold CSS" },
//         { question: "What are CSS custom properties?", options: ["Browser-specific CSS", "CSS variables", "Proprietary CSS", "Advanced CSS"], answer: "CSS variables" },
//         { question: "What is the CSS paint API?", options: ["Color management", "Custom CSS rendering", "Animation API", "Drawing API"], answer: "Custom CSS rendering" },
//         { question: "What is CSS containment?", options: ["Responsive containers", "Style isolation and performance", "Content management", "Layout technique"], answer: "Style isolation and performance" },
//         { question: "What is the CSS object-fit property?", options: ["Object positioning", "How content fits in container", "3D transformations", "Element alignment"], answer: "How content fits in container" },
//         { question: "What is CSS subgrid?", options: ["Nested layouts", "Grid items inheriting parent grid", "Mobile grid", "Responsive grid"], answer: "Grid items inheriting parent grid" }
//       ]
//     }
//   },
//   {
//     id: "nodejs",
//     name: "Node.js",
//     icon: "🟢",
//     description: "Server-side JavaScript development",
//     color: "from-green-500 to-emerald-600",
//     quizzes: {
//       easy: [
//         { question: "What is Node.js?", options: ["JavaScript runtime", "Database", "Web browser", "CSS framework"], answer: "JavaScript runtime" },
//         { question: "Which method imports modules?", options: ["import()", "require()", "include()", "load()"], answer: "require()" },
//         { question: "What is npm?", options: ["Node Package Manager", "Network Protocol Manager", "New Project Manager", "Node Process Manager"], answer: "Node Package Manager" },
//         { question: "Which file contains project dependencies?", options: ["package.json", "config.json", "deps.json", "modules.json"], answer: "package.json" },
//         { question: "How to start a Node.js application?", options: ["node app.js", "start app.js", "run app.js", "execute app.js"], answer: "node app.js" },
//         { question: "Which module handles file operations?", options: ["fs", "file", "io", "disk"], answer: "fs" },
//         { question: "What is Express.js?", options: ["Database", "Web framework", "Testing tool", "Package manager"], answer: "Web framework" },
//         { question: "Which method reads files synchronously?", options: ["fs.readFile()", "fs.readFileSync()", "fs.read()", "fs.readSync()"], answer: "fs.readFileSync()" },
//         { question: "What is middleware in Express?", options: ["Database layer", "Functions that execute during request-response cycle", "Frontend component", "Testing framework"], answer: "Functions that execute during request-response cycle" },
//         { question: "How to install packages globally?", options: ["npm install -g", "npm global install", "npm install --global", "Both npm install -g and npm install --global"], answer: "Both npm install -g and npm install --global" }
//       ],
//       medium: [
//         { question: "What is the event loop?", options: ["Infinite loop", "Mechanism for handling asynchronous operations", "Error handling system", "Module loader"], answer: "Mechanism for handling asynchronous operations" },
//         { question: "What is a callback function?", options: ["Function that calls back", "Function passed as argument to another function", "Recursive function", "Error handler"], answer: "Function passed as argument to another function" },
//         { question: "What is Promise in Node.js?", options: ["Guarantee", "Object representing eventual completion of async operation", "Function type", "Module system"], answer: "Object representing eventual completion of async operation" },
//         { question: "What is async/await?", options: ["Sleeping function", "Syntactic sugar for Promises", "Error handling", "Module import"], answer: "Syntactic sugar for Promises" },
//         { question: "What is buffer in Node.js?", options: ["Memory storage", "Global object for handling binary data", "File system", "Network protocol"], answer: "Global object for handling binary data" },
//         { question: "What is clustering in Node.js?", options: ["Grouping modules", "Creating multiple processes", "Database clustering", "Code organization"], answer: "Creating multiple processes" },
//         { question: "What is streams?", options: ["Water flow", "Objects for handling streaming data", "Array methods", "File operations"], answer: "Objects for handling streaming data" },
//         { question: "What is process.env?", options: ["Process environment", "Object containing environment variables", "System process", "Error object"], answer: "Object containing environment variables" },
//         { question: "What is CORS?", options: ["Core System", "Cross-Origin Resource Sharing", "Code Organization", "Connection Protocol"], answer: "Cross-Origin Resource Sharing" },
//         { question: "What is REST API?", options: ["Resting API", "Representational State Transfer", "Resource Sharing Tool", "Request System"], answer: "Representational State Transfer" }
//       ],
//       Advance: [
//         { question: "What is the difference between setImmediate and setTimeout?", options: ["No difference", "setImmediate executes after I/O events", "setTimeout is faster", "setImmediate deprecated"], answer: "setImmediate executes after I/O events" },
//         { question: "What is worker threads?", options: ["Threading library", "Way to run JavaScript in parallel", "Web workers", "Thread pool"], answer: "Way to run JavaScript in parallel" },
//         { question: "What is V8 engine?", options: ["Car engine", "JavaScript engine that powers Node.js", "Version 8", "Virtual machine"], answer: "JavaScript engine that powers Node.js" },
//         { question: "What is libuv?", options: ["UI library", "C library that handles async I/O", "UV protection", "Version library"], answer: "C library that handles async I/O" },
//         { question: "What is microservices architecture?", options: ["Small services", "Architectural pattern with small, independent services", "Micro frontend", "Service workers"], answer: "Architectural pattern with small, independent services" },
//         { question: "What is JWT?", options: ["Java Web Token", "JSON Web Token", "JavaScript Web Tool", "Just Web Technology"], answer: "JSON Web Token" },
//         { question: "What is rate limiting?", options: ["Speed control", "Controlling request frequency", "Performance optimization", "Error limiting"], answer: "Controlling request frequency" },
//         { question: "What is memory leak?", options: ["Memory loss", "Unreleased memory allocation", "Storage problem", "Cache issue"], answer: "Unreleased memory allocation" },
//         { question: "What is garbage collection?", options: ["Waste management", "Automatic memory management", "File cleaning", "Code cleanup"], answer: "Automatic memory management" },
//         { question: "What is the purpose of pm2?", options: ["Package manager", "Process manager for production", "Performance monitor", "Project manager"], answer: "Process manager for production" }
//       ]
//     }
//   }
// ];

// export default function ProgrammingQuizApp() {
//   const [currentView, setCurrentView] = useState("home");
//   const [selectedLanguage, setSelectedLanguage] = useState(null);
//   const [selectedDifficulty, setSelectedDifficulty] = useState(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState("");
//   const [score, setScore] = useState(0);
//   const [showResult, setShowResult] = useState(false);
//   const [quizCompleted, setQuizCompleted] = useState(false);
//   const [userStats, setUserStats] = useState({
//     totalQuizzes: 0,
//     totalScore: 0,
//     averageScore: 0
//   });

//   const startQuiz = (language, difficulty) => {
//     setSelectedLanguage(language);
//     setSelectedDifficulty(difficulty);
//     setCurrentQuestionIndex(0);
//     setScore(0);
//     setShowResult(false);
//     setQuizCompleted(false);
//     setSelectedAnswer("");
//     setCurrentView("quiz");
//   };

//   const handleAnswerSelect = (answer) => {
//     setSelectedAnswer(answer);
//   };

//   const nextQuestion = () => {
//     const currentQuiz = selectedLanguage.quizzes[selectedDifficulty];
//     const correctAnswer = currentQuiz[currentQuestionIndex].answer;
    
//     if (selectedAnswer === correctAnswer) {
//       setScore(score + 1);
//     }
    
//     setSelectedAnswer("");
    
//     if (currentQuestionIndex + 1 < currentQuiz.length) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     } else {
//       // Quiz completed
//       const finalScore = selectedAnswer === correctAnswer ? score + 1 : score;
//       setScore(finalScore);
//       setQuizCompleted(true);
//       setShowResult(true);
      
//       // Update stats
//       setUserStats(prev => ({
//         totalQuizzes: prev.totalQuizzes + 1,
//         totalScore: prev.totalScore + finalScore,
//         averageScore: Math.round(((prev.totalScore + finalScore) / (prev.totalQuizzes + 1)) * 100) / 100
//       }));
//     }
//   };

//   const resetQuiz = () => {
//     setCurrentView("home");
//     setSelectedLanguage(null);
//     setSelectedDifficulty(null);
//     setCurrentQuestionIndex(0);
//     setSelectedAnswer("");
//     setScore(0);
//     setShowResult(false);
//     setQuizCompleted(false);
//   };

//   if (currentView === "home") {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
//         <div className="max-w-6xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-12">
//             <div className="flex justify-center items-center gap-4 mb-4">
//               <Code className="w-12 h-12 text-yellow-400" />
//               <h1 className="text-5xl font-bold text-white">Programming Quiz</h1>
//             </div>
//             <p className="text-xl text-blue-200">Test your coding knowledge across multiple languages</p>
//           </div>

//           {/* Stats Dashboard */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
//             <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
//               <div className="flex items-center gap-3">
//                 <Trophy className="w-8 h-8 text-yellow-400" />
//                 <div>
//                   <h3 className="text-white font-semibold">Total Quizzes</h3>
//                   <p className="text-2xl font-bold text-blue-200">{userStats.totalQuizzes}</p>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
//               <div className="flex items-center gap-3">
//                 <Star className="w-8 h-8 text-yellow-400" />
//                 <div>
//                   <h3 className="text-white font-semibold">Total Score</h3>
//                   <p className="text-2xl font-bold text-green-300">{userStats.totalScore}</p>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
//               <div className="flex items-center gap-3">
//                 <Award className="w-8 h-8 text-yellow-400" />
//                 <div>
//                   <h3 className="text-white font-semibold">Average Score</h3>
//                   <p className="text-2xl font-bold text-purple-300">{userStats.averageScore}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Language Selection */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {programmingLanguages.map((lang) => (
//               <div key={lang.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
//                 <div className="flex items-center gap-4 mb-4">
//                   <span className="text-4xl">{lang.icon}</span>
//                   <div>
//                     <h3 className="text-xl font-bold text-white">{lang.name}</h3>
//                     <p className="text-blue-200 text-sm">{lang.description}</p>
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-3 gap-2">
//                   {Object.keys(lang.quizzes).map((difficulty) => (
//                     <button
//                       key={difficulty}
//                       onClick={() => startQuiz(lang, difficulty)}
//                       className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
//                         difficulty === 'easy' 
//                           ? 'bg-green-500 hover:bg-green-600 text-white' 
//                           : difficulty === 'medium'
//                           ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
//                           : 'bg-red-500 hover:bg-red-600 text-white'
//                       }`}
//                     >
//                       {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
//                     </button>
//                   ))}
//                 </div>
                
//                 <div className="mt-4 text-xs text-blue-200">
//                   Questions: Easy ({lang.quizzes.easy.length}) • Medium ({lang.quizzes.medium.length}) • Advance ({lang.quizzes.Advance.length})
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (currentView === "quiz" && !showResult) {
//     const currentQuiz = selectedLanguage.quizzes[selectedDifficulty];
//     const currentQuestion = currentQuiz[currentQuestionIndex];
//     const progress = ((currentQuestionIndex + 1) / currentQuiz.length) * 100;

//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-8">
//             <div className="flex items-center gap-4">
//               <span className="text-3xl">{selectedLanguage.icon}</span>
//               <div>
//                 <h1 className="text-2xl font-bold text-white">{selectedLanguage.name}</h1>
//                 <p className="text-blue-200 capitalize">{selectedDifficulty} Level</p>
//               </div>
//             </div>
//             <button
//               onClick={resetQuiz}
//               className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
//             >
//               <Home className="w-4 h-4" />
//             </button>
//           </div>

//           {/* Progress Bar */}
//           <div className="mb-8">
//             <div className="flex justify-between text-sm text-blue-200 mb-2">
//               <span>Question {currentQuestionIndex + 1} of {currentQuiz.length}</span>
//               <span>Score: {score}/{currentQuiz.length}</span>
//             </div>
//             <div className="w-full bg-gray-700 rounded-full h-2">
//               <div 
//                 className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
//                 style={{ width: `${progress}%` }}
//               ></div>
//             </div>
//           </div>

//           {/* Question Card */}
//           <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-6">
//             <h2 className="text-xl font-semibold text-white mb-6">{currentQuestion.question}</h2>
            
//             <div className="grid grid-cols-1 gap-3">
//               {currentQuestion.options.map((option, index) => (
//                 <button
//                   key={index}
//                   onClick={() => handleAnswerSelect(option)}
//                   className={`p-4 text-left rounded-lg transition-all duration-300 border-2 ${
//                     selectedAnswer === option
//                       ? 'border-blue-400 bg-blue-500/20 text-white'
//                       : 'border-gray-600 bg-gray-700/50 text-gray-200 hover:border-gray-500 hover:bg-gray-600/50'
//                   }`}
//                 >
//                   <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Next Button */}
//           <div className="text-center">
//             <button
//               onClick={nextQuestion}
//               disabled={!selectedAnswer}
//               className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 ${
//                 selectedAnswer
//                   ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
//                   : 'bg-gray-600 text-gray-400 cursor-not-allowed'
//               }`}
//             >
//               {currentQuestionIndex + 1 === currentQuiz.length ? 'Finish Quiz' : 'Next Question'}
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (showResult) {
//     const totalQuestions = selectedLanguage.quizzes[selectedDifficulty].length;
//     const percentage = Math.round((score / totalQuestions) * 100);
    
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
//         <div className="max-w-4xl mx-auto text-center">
//           {/* Results Card */}
//           <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 border border-white/20 mb-8">
//             <div className="mb-6">
//               <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-4" />
//               <h1 className="text-4xl font-bold text-white mb-2">Quiz Completed!</h1>
//               <p className="text-xl text-blue-200">{selectedLanguage.name} - {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)} Level</p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//               <div className="bg-white/10 rounded-lg p-6">
//                 <h3 className="text-2xl font-bold text-green-400">{score}</h3>
//                 <p className="text-blue-200">Correct Answers</p>
//               </div>
//               <div className="bg-white/10 rounded-lg p-6">
//                 <h3 className="text-2xl font-bold text-red-400">{totalQuestions - score}</h3>
//                 <p className="text-blue-200">Incorrect Answers</p>
//               </div>
//               <div className="bg-white/10 rounded-lg p-6">
//                 <h3 className="text-2xl font-bold text-purple-400">{percentage}%</h3>
//                 <p className="text-blue-200">Accuracy</p>
//               </div>
//             </div>

//             <div className="mb-8">
//               <div className="text-lg text-white mb-4">
//                 {percentage >= 80 ? "🎉 Excellent work!" : 
//                  percentage >= 60 ? "👍 Good job!" : 
//                  percentage >= 40 ? "📚 Keep practicing!" : 
//                  "💪 Don't give up!"}
//               </div>
//               <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
//                 <div 
//                   className={`h-4 rounded-full transition-all duration-1000 ${
//                     percentage >= 80 ? 'bg-green-500' : 
//                     percentage >= 60 ? 'bg-yellow-500' : 
//                     'bg-red-500'
//                   }`}
//                   style={{ width: `${percentage}%` }}
//                 ></div>
//               </div>
//             </div>

//             <div className="flex gap-4 justify-center">
//               <button
//                 onClick={() => startQuiz(selectedLanguage, selectedDifficulty)}
//                 className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-300"
//               >
//                 Try Again
//               </button>
//               <button
//                 onClick={resetQuiz}
//                 className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-300"
//               >
//                 Back to Home
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return null;
// }