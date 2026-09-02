"use client";

import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-purple-500/20 bg-black/75 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-20 flex items-center justify-between">

        {/* LOGO */}
        <a
          href="/"
          className="flex items-center gap-3 group"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-105 transition">
            <span className="text-white font-black text-xl">
              J
            </span>
          </div>

          <div className="hidden sm:block">
            <h1 className="text-xl font-black text-white tracking-wide">
              JAIPUR
            </h1>

            <p className="text-[10px] font-bold tracking-[0.25em] text-purple-400 -mt-1">
              ESPORTS CLUB
            </p>
          </div>
        </a>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8">

          <a
            href="/"
            className="text-white hover:text-purple-400 transition font-medium"
          >
            Home
          </a>

          <a
            href="/tournaments"
            className="text-zinc-300 hover:text-purple-400 transition font-medium"
          >
            Tournaments
          </a>

          <a
            href="/leaderboard"
            className="text-zinc-300 hover:text-purple-400 transition font-medium"
          >
            Leaderboard
          </a>

          <a
            href="/sponsors"
            className="text-zinc-300 hover:text-purple-400 transition font-medium"
          >
            Sponsors
          </a>

          <a
            href="/contact"
            className="text-zinc-300 hover:text-purple-400 transition font-medium"
          >
            Contact
          </a>

        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-3">

          <a
            href="/login"
            className="px-5 py-2.5 rounded-xl border border-purple-500/40 text-white hover:bg-purple-500/10 transition font-semibold"
          >
            Login
          </a>

          <a
            href="/signup"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold shadow-lg shadow-purple-600/25 hover:scale-105 transition"
          >
            Register
          </a>

        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-11 h-11 rounded-xl border border-purple-500/30 bg-zinc-900 text-white flex items-center justify-center text-xl"
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden border-t border-purple-500/20 bg-black/95 backdrop-blur-xl">

          <div className="px-5 py-5 space-y-2">

            <a
              href="/"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 rounded-xl text-white hover:bg-purple-600/20 transition"
            >
              Home
            </a>

            <a
              href="/tournaments"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 rounded-xl text-zinc-300 hover:bg-purple-600/20 transition"
            >
              Tournaments
            </a>

            <a
              href="/leaderboard"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 rounded-xl text-zinc-300 hover:bg-purple-600/20 transition"
            >
              Leaderboard
            </a>

           <a
  href="/sponsors"
  onClick={() => setMenuOpen(false)}
  className="block px-4 py-3 rounded-xl text-zinc-300 hover:bg-purple-600/20 transition"
>
  Sponsors
</a>

            <a
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 rounded-xl text-zinc-300 hover:bg-purple-600/20 transition"
            >
              Contact
            </a>

            <div className="pt-3 grid grid-cols-2 gap-3">

              <a
                href="/login"
                className="text-center px-4 py-3 rounded-xl border border-purple-500/40 text-white font-semibold"
              >
                Login
              </a>

              <a
                href="/signup"
                className="text-center px-4 py-3 rounded-xl bg-purple-600 text-white font-bold"
              >
                Register
              </a>

            </div>

          </div>

        </div>
      )}
    </nav>
  );
}