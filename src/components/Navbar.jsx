"use client";

import Link from "next/link";
import { useAuth } from "./Auth/Auth";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const { isLoggedIn, LogoutUser } = useAuth();  
  const router = useRouter();

  const handleLogout = () => {
    LogoutUser();        // token remove hoga
    router.push("/login");    
  };

  return (
    <nav className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-300 text-gray-900 px-6 py-4 flex justify-between items-center shadow sticky top-0 z-50">
      {/* Logo */}
      <div className="text-2xl font-bold text-emerald-900">Stock Tracker 📈</div>

      {/* Menu */}
      <div className="flex items-center space-x-6">
        <Link href={isLoggedIn ? "/dashboard" : "/"} className="hover:text-emerald-700 transition">
          Home
        </Link>
        <Link href="/about" className="hover:text-teal-700 transition">About</Link>
        <Link href="/services" className="hover:text-cyan-700 transition">Services</Link>
        <Link href="/contact" className="hover:text-emerald-700 transition">Contact</Link>

        {/* Conditional Auth Buttons */}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg border border-gray-900 hover:bg-gray-900 hover:text-white transition"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg border border-gray-900 hover:bg-gray-900 hover:text-white transition"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 transition"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};
