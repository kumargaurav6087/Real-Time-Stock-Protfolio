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
    <main className="flex flex-col items-center text-center min-h-screen px-4 sm:px-6 bg-gradient-to-br from-emerald-50 via-teal-100 to-cyan-100">

      {/* Hero */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 mt-24 text-emerald-900">
        📈 Welcome to <span className="text-teal-700">Real-Time Stock Tracker</span>
      </h1>

      <p className="text-base sm:text-lg max-w-2xl mb-8 text-gray-800">
        Manage your stock portfolio, track real-time prices, calculate profit/loss, and make smarter investment decisions.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-10">
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

      {showMore && (
        <section className="mt-12 max-w-4xl bg-white p-6 sm:p-8 rounded-2xl shadow-md text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-teal-700 mb-4">
            About the Project
          </h2>
          <p className="mb-4">
            This Real-Time Stock Portfolio Tracker allows users to manage stocks and monitor live prices.
          </p>
          <p className="mb-4">
            Secure authentication with Firebase and JWT ensures safe access.
          </p>
          <p>
            Future enhancements include alerts, news feed, and analytics.
          </p>
        </section>
      )}

      {/* Features */}
      <section className="mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl w-full px-2">
        {[
          { icon: "📂", title: "Manage Portfolio", desc: "Track your holdings easily." },
          { icon: "⚡", title: "Real-Time Prices", desc: "Live market data." },
          { icon: "📊", title: "Profit & Loss", desc: "Instant calculation." },
          { icon: "🔒", title: "Secure Auth", desc: "Firebase + JWT." },
          { icon: "📈", title: "Charts", desc: "Visual insights." },
          { icon: "🛠️", title: "Admin Panel", desc: "Analytics access." },
        ].map((f, i) => (
          <div key={i} className="p-6 bg-white rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-2">
              {f.icon} {f.title}
            </h3>
            <p className="text-sm sm:text-base">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Analytics */}
      <section className="mt-20 max-w-6xl w-full px-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-700 mb-8">
          📊 Stock Analytics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md overflow-x-auto">
            <LineChart width={360} height={240} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="price" stroke="#10B981" strokeWidth={3} />
            </LineChart>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md overflow-x-auto">
            <BarChart width={360} height={240} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="profit" fill="#14B8A6" />
              <Bar dataKey="loss" fill="#EF4444" />
            </BarChart>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md overflow-x-auto">
            <PieChart width={360} height={240}>
              <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md overflow-x-auto">
            <AreaChart width={360} height={240} data={data}>
              <defs>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area type="monotone" dataKey="profit" stroke="#14B8A6" fill="url(#colorProfit)" />
            </AreaChart>
          </div>
        </div>
      </section>
    </main>
  );
}


// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
//   BarChart, Bar,
//   PieChart, Pie, Cell,
//   AreaChart, Area,
//   ResponsiveContainer
// } from "recharts";

// export default function QuizHomePage() {
//   const [showMore, setShowMore] = useState(false);
//   const router = useRouter();

//   // Dummy quiz data
//   const data = [
//     { name: "JavaScript", score: 85, attempts: 50, average: 70 },
//     { name: "Python", score: 92, attempts: 40, average: 75 },
//     { name: "React", score: 76, attempts: 60, average: 65 },
//     { name: "Java", score: 88, attempts: 45, average: 72 },
//     { name: "C++", score: 95, attempts: 30, average: 80 },
//   ];

//   const pieData = [
//     { name: "Easy", value: 40 },
//     { name: "Medium", value: 35 },
//     { name: "Hard", value: 25 },
//   ];

//   const COLORS = ["#FBBF24", "#FACC15", "#EF4444"];

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 text-white">
//       {/* Hero Section */}
//       <section className="text-center mb-12">
//         <h1 className="text-4xl md:text-5xl font-bold mb-4">🧠 Welcome to LearnXP</h1>
//         <p className="text-lg md:text-xl text-blue-200 mb-6">
//           Challenge yourself with quizzes across multiple categories and track your progress!
//         </p>
//         <div className="flex flex-col sm:flex-row justify-center gap-4">
//           <button
//             className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-300"
//             onClick={() => router.push("/signup")}
//           >
//             Start Quiz
//           </button>
//           <button
//             className="px-6 py-3 border-2 border-blue-400 hover:bg-white/10 text-white font-semibold rounded-lg transition-all duration-300"
//             onClick={() => setShowMore(!showMore)}
//           >
//             Learn More
//           </button>
//         </div>
//       </section>

//       {/* Conditional Learn More */}
//       {showMore && (
//         <section className="mb-12 max-w-4xl mx-auto bg-white/10 backdrop-blur-lg p-8 rounded-xl border border-white/20">
//           <h2 className="text-3xl font-bold mb-4 text-yellow-400">About LearnXP</h2>
//           <p className="mb-3 text-blue-200">
//             Quizify is your one-stop platform for learning and fun. Take quizzes on subjects like Math, Science, History, Sports, and Technology.
//           </p>
//           <p className="mb-3 text-blue-200">
//             Compete with friends, earn points, and see your name climb the leaderboard. Track your improvement with visual analytics.
//           </p>
//           <p className="mb-3 text-blue-200">
//             Upcoming features: custom quiz creation, timed challenges, live multiplayer, and AI-based personalized recommendations.
//           </p>
//         </section>
//       )}

//       {/* Features Section */}
//       <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
//         {[
//           { icon: "📚", title: "Multiple Categories", desc: "Math, Science, History, Sports, Tech and more." },
//           { icon: "⚡", title: "Timed Challenges", desc: "Test your knowledge against the clock." },
//           { icon: "🏆", title: "Leaderboard", desc: "Compete with friends and track your rank." },
//           { icon: "📊", title: "Track Progress", desc: "View analytics of your attempts and performance." },
//           { icon: "🔒", title: "Secure Login", desc: "Sign up securely with Firebase Authentication." },
//           { icon: "🤖", title: "Smart Quizzes", desc: "AI-based difficulty adjustment." },
//         ].map((feature, i) => (
//           <div
//             key={i}
//             className="p-6 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition transform hover:scale-105"
//           >
//             <h3 className="text-xl font-semibold mb-2 text-yellow-400">{feature.icon} {feature.title}</h3>
//             <p className="text-blue-200">{feature.desc}</p>
//           </div>
//         ))}
//       </section>

//       {/* Analytics Section */}
//       <section className="max-w-6xl mx-auto">
//         <h2 className="text-3xl font-bold mb-6 text-yellow-400">📊 Quiz Analytics</h2>
//         <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8">
          
//           {/* Line Chart */}
//           <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20">
//             <h3 className="text-lg font-semibold mb-4 text-blue-200">Scores by Category</h3>
//             <ResponsiveContainer width="100%" height={250}>
//               <LineChart data={data}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="name" stroke="#D1D5DB"/>
//                 <YAxis stroke="#D1D5DB"/>
//                 <Tooltip contentStyle={{ backgroundColor: '#1E3A8A', border: 'none' }} itemStyle={{ color: '#FBBF24' }} />
//                 <Legend wrapperStyle={{ color: '#FBBF24' }}/>
//                 <Line type="monotone" dataKey="score" stroke="#FBBF24" strokeWidth={3} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Bar Chart */}
//           <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20">
//             <h3 className="text-lg font-semibold mb-4 text-blue-200">Attempts vs Average</h3>
//             <ResponsiveContainer width="100%" height={250}>
//               <BarChart data={data}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151"/>
//                 <XAxis dataKey="name" stroke="#D1D5DB"/>
//                 <YAxis stroke="#D1D5DB"/>
//                 <Tooltip contentStyle={{ backgroundColor: '#1E3A8A', border: 'none' }} itemStyle={{ color: '#FBBF24' }} />
//                 <Legend wrapperStyle={{ color: '#FBBF24' }}/>
//                 <Bar dataKey="attempts" fill="#3B82F6" />
//                 <Bar dataKey="average" fill="#8B5CF6" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Pie Chart */}
//           <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20">
//             <h3 className="text-lg font-semibold mb-4 text-blue-200">Quiz Difficulty Distribution</h3>
//             <ResponsiveContainer width="100%" height={250}>
//               <PieChart>
//                 <Pie
//                   data={pieData}
//                   dataKey="value"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={80}
//                   label
//                 >
//                   {pieData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip contentStyle={{ backgroundColor: '#1E3A8A', border: 'none' }} itemStyle={{ color: '#FBBF24' }} />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Area Chart */}
//           <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20">
//             <h3 className="text-lg font-semibold mb-4 text-blue-200">Performance Growth</h3>
//             <ResponsiveContainer width="100%" height={250}>
//               <AreaChart data={data}>
//                 <defs>
//                   <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
//                     <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
//                   </linearGradient>
//                 </defs>
//                 <XAxis dataKey="name" stroke="#D1D5DB"/>
//                 <YAxis stroke="#D1D5DB"/>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151"/>
//                 <Tooltip contentStyle={{ backgroundColor: '#1E3A8A', border: 'none' }} itemStyle={{ color: '#FBBF24' }} />
//                 <Area type="monotone" dataKey="score" stroke="#3B82F6" fillOpacity={1} fill="url(#colorScore)" />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>

//         </div>
        
//       </section>
//     </main>
//   );
// }
