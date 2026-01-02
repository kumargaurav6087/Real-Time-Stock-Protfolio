"use client";

import Link from "next/link";
import { useAuth } from "./Auth/Auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const { isLoggedIn, LogoutUser } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    LogoutUser();
    setIsOpen(false);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <nav className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-200 shadow-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">

          {/* Logo */}
          <Link
            href="/"
            className="text-xl sm:text-2xl font-bold text-emerald-900"
          >
            Stock Tracker
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 font-medium">
            <NavLinks isLoggedIn={isLoggedIn} />

            {isLoggedIn ? (
              <NavButton onClick={handleLogout} text="Logout" />
            ) : (
              <>
                <NavButton href="/login" text="Login" />
                <NavButton href="/signup" text="Signup" primary />
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            aria-label="Toggle menu"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-900"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu (CLS Safe) */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col items-center gap-4 py-4 font-medium">
            <NavLinks
              isLoggedIn={isLoggedIn}
              onClick={() => setIsOpen(false)}
            />

            {isLoggedIn ? (
              <NavButton onClick={handleLogout} text="Logout" />
            ) : (
              <>
                <NavButton href="/login" text="Login" onClick={() => setIsOpen(false)} />
                <NavButton
                  href="/signup"
                  text="Signup"
                  primary
                  onClick={() => setIsOpen(false)}
                />
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

/* ---------------- Components ---------------- */

const NavLinks = ({ isLoggedIn, onClick }) => (
  <>
    <NavLink href={isLoggedIn ? "/dashboard" : "/"} text="Home" onClick={onClick} />
    <NavLink href="/about" text="About" onClick={onClick} />
    <NavLink href="/services" text="Services" onClick={onClick} />
    <NavLink href="/contact" text="Contact" onClick={onClick} />
  </>
);

const NavLink = ({ href, text, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className="hover:text-emerald-700 transition"
  >
    {text}
  </Link>
);

const NavButton = ({ href, text, onClick, primary }) => {
  const base =
    "px-4 py-2 rounded-lg font-semibold transition border border-emerald-700";
  const styles = primary
    ? "bg-emerald-700 text-white hover:bg-emerald-800"
    : "text-emerald-900 hover:bg-emerald-700 hover:text-white";

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={`${base} ${styles}`}>
        {text}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`${base} ${styles}`}>
      {text}
    </button>
  );
};
