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
    <nav className="bg-gradient-to-r from-purple-700 via-purple-600 to-pink-600 text-white px-6 py-4 flex justify-between items-center shadow sticky top-0 z-50">
      {/* Logo */}
      <div className="text-2xl font-bold">Stock Tracker 📈</div>

      {/* Menu */}
      <div className="flex items-center space-x-6">
      {/* <Link href="/" className="hover:text-pink-200">Home</Link> */}
      <Link href={isLoggedIn ? "/dashboard" : "/"} className="hover:text-pink-200">
          Home
        </Link>
        <Link href="/about" className="hover:text-pink-200">About</Link>
        <Link href="/services" className="hover:text-pink-200">Services</Link>
        <Link href="/contact" className="hover:text-pink-200">Contact</Link>

        {/* Conditional Auth Buttons */}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}   // ✅ yaha change kiya
            className="px-4 py-2 rounded-lg border border-white hover:bg-white hover:text-purple-700 transition"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg border border-white hover:bg-white hover:text-purple-700 transition"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-lg bg-white text-purple-700 font-semibold hover:bg-pink-100 transition"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};
