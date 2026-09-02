"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative bg-black border-t border-white/10 overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-purple-600/10 blur-[130px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-8">

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* BRAND */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <a href="/" className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-600/20">
                <span className="text-white text-xl font-black">
                  J
                </span>
              </div>

              <div>
                <h2 className="text-xl font-black text-white">
                  JAIPUR
                </h2>

                <p className="text-[9px] tracking-[0.25em] text-purple-400 font-bold">
                  ESPORTS CLUB
                </p>
              </div>

            </a>

            <p className="text-zinc-500 text-sm leading-relaxed mt-5 max-w-sm">
              Rajasthan's premier esports tournament platform.
              Compete, conquer and become a champion.
            </p>

            {/* SOCIAL LINKS */}
            <div className="flex gap-3 mt-6">

              <a
                href="#"
                className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-purple-600 hover:border-purple-500 transition"
              >
                IG
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-purple-600 hover:border-purple-500 transition"
              >
                YT
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-purple-600 hover:border-purple-500 transition"
              >
                DC
              </a>

            </div>
          </motion.div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-white font-bold mb-5">
              Quick Links
            </h3>

            <div className="space-y-3">

              <a
                href="/"
                className="block text-zinc-500 hover:text-purple-400 transition"
              >
                Home
              </a>

              <a
                href="/tournaments"
                className="block text-zinc-500 hover:text-purple-400 transition"
              >
                Tournaments
              </a>

              <a
                href="/leaderboard"
                className="block text-zinc-500 hover:text-purple-400 transition"
              >
                Leaderboard
              </a>

              <a
                href="/teams"
                className="block text-zinc-500 hover:text-purple-400 transition"
              >
                Teams
              </a>

              <a
                href="/contact"
                className="block text-zinc-500 hover:text-purple-400 transition"
              >
                Contact
              </a>

            </div>
          </div>

          {/* GAMES */}
          <div>
            <h3 className="text-white font-bold mb-5">
              Games
            </h3>

            <div className="space-y-3">

              <p className="text-zinc-500">
                🎯 BGMI
              </p>

              <p className="text-zinc-500">
                🔥 Free Fire MAX
              </p>

              <p className="text-zinc-500">
                ⚔️ VALORANT
              </p>

              <p className="text-zinc-500">
                🎮 Call of Duty Mobile
              </p>

            </div>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-white font-bold mb-5">
              Contact
            </h3>

            <div className="space-y-4">

              <div>
                <p className="text-xs text-zinc-600 uppercase tracking-wider">
                  Email
                </p>

                <p className="text-zinc-400 text-sm mt-1">
                  contact@jaipuresportsclub.com
                </p>
              </div>

              <div>
                <p className="text-xs text-zinc-600 uppercase tracking-wider">
                  Location
                </p>

                <p className="text-zinc-400 text-sm mt-1">
                  Jaipur, Rajasthan, India
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* DIVIDER */}
        <div className="border-t border-white/10 mt-14 pt-6">

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            <p className="text-zinc-600 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Jaipur Esports Club.
              All rights reserved.
            </p>

            <div className="flex gap-6 text-sm">

              <a
                href="#"
                className="text-zinc-600 hover:text-purple-400 transition"
              >
                Privacy Policy
              </a>

              <a
                href="#"
                className="text-zinc-600 hover:text-purple-400 transition"
              >
                Terms & Conditions
              </a>

            </div>

          </div>

        </div>

      </div>
    </footer>
  );
}