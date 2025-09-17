"use client";

import Link from "next/link";
import { Home, Info, Wrench, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-200 text-gray-900 py-4 md:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-center md:text-left">
          
          {/* Brand / About */}
          <div>
            <h2 className="text-2xl font-bold mb-2 text-emerald-900">📈 Stock Tracker</h2>
            <p className="text-sm text-teal-800">
              Stay on top of the market with real-time stock updates, portfolio management, 
              and smart insights. Designed for traders & investors. 🚀
            </p>
          </div>

          {/* Quick Links - Navbar style with icons */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-cyan-900">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="flex items-center gap-2 hover:underline hover:text-emerald-700 transition">
                  <Home size={16} /> Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="flex items-center gap-2 hover:underline hover:text-teal-700 transition">
                  <Info size={16} /> About
                </Link>
              </li>
              <li>
                <Link href="/services" className="flex items-center gap-2 hover:underline hover:text-cyan-700 transition">
                  <Wrench size={16} /> Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="flex items-center gap-2 hover:underline hover:text-emerald-700 transition">
                  <Mail size={16} /> Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Market Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-teal-900">Market Info</h3>
            <p className="text-sm text-teal-800">
              ⚡ Real-time data powered by live stock APIs. <br />
              🔒 Secure & private user accounts. <br />
              🌍 Available anytime, anywhere.  
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
