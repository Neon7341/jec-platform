"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-black overflow-hidden flex items-center">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-purple-600/20 rounded-full blur-[140px]" />

        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full blur-[120px]" />

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-700/10 rounded-full blur-[130px]" />
      </div>

      {/* GRID */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(168,85,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* VIGNETTE */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,black_80%)]" />

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-32 pb-20">

        <div className="flex flex-col items-center text-center">

          {/* TOP BADGE */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-7"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md text-purple-300 text-sm font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              RAJASTHAN'S PREMIER ESPORTS PLATFORM
            </div>
          </motion.div>

          {/* MAIN TITLE */}
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[0.9]"
          >
            <span className="block text-white">
              JAIPUR
            </span>

            <span className="block bg-gradient-to-r from-purple-400 via-fuchsia-500 to-purple-600 bg-clip-text text-transparent">
              ESPORTS CLUB
            </span>
          </motion.h1>

          {/* LOGO */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.7,
              rotate: -5,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
            }}
            transition={{
              delay: 0.35,
              duration: 0.8,
              ease: "easeOut",
            }}
            className="relative my-10"
          >

            {/* LOGO GLOW */}
            <div className="absolute inset-0 bg-purple-600/40 blur-[60px] rounded-full" />

            <img
              src="/logos/jec-logo.png"
              alt="Jaipur Esports Club"
              className="relative w-36 sm:w-44 md:w-52 drop-shadow-[0_0_35px_rgba(168,85,247,0.7)]"
            />

          </motion.div>

          {/* DESCRIPTION */}
          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.55,
              duration: 0.7,
            }}
            className="max-w-2xl text-base sm:text-lg md:text-xl text-zinc-400 leading-relaxed"
          >
            Compete in professionally managed esports tournaments
            across{" "}
            <span className="text-white font-semibold">
              BGMI
            </span>
            ,{" "}
            <span className="text-white font-semibold">
              VALORANT
            </span>
            ,{" "}
            <span className="text-white font-semibold">
              Free Fire
            </span>
            {" "}and more.
          </motion.p>

          {/* TAGLINE */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-4 mt-6 text-xs sm:text-sm font-bold tracking-[0.25em] text-zinc-500"
          >
            <span>COMPETE</span>

            <span className="text-purple-500">
              •
            </span>

            <span>CONQUER</span>

            <span className="text-purple-500">
              •
            </span>

            <span>CHAMPION</span>
          </motion.div>

          {/* BUTTONS */}
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.85,
              duration: 0.7,
            }}
            className="flex flex-col sm:flex-row gap-4 mt-10"
          >

            {/* PRIMARY */}
            <a
              href="/tournaments"
              className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold shadow-[0_0_30px_rgba(124,58,237,0.35)] hover:shadow-[0_0_45px_rgba(124,58,237,0.55)] hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center justify-center gap-2">
                🏆 Explore Tournaments

                <span className="group-hover:translate-x-1 transition">
                  →
                </span>
              </span>
            </a>

            {/* SECONDARY */}
            <a
              href="/signup"
              className="px-8 py-4 rounded-xl border border-purple-500/40 bg-white/[0.03] backdrop-blur-md text-white font-bold hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-300"
            >
              Join JEC
            </a>

          </motion.div>

          {/* BOTTOM INFO */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 1,
              duration: 0.7,
            }}
            className="grid grid-cols-3 gap-6 md:gap-12 mt-16 pt-8 border-t border-white/10"
          >

            <div>
              <p className="text-xl md:text-2xl font-black text-white">
                BGMI
              </p>

              <p className="text-xs text-zinc-500 mt-1">
                TOURNAMENTS
              </p>
            </div>

            <div>
              <p className="text-xl md:text-2xl font-black text-white">
                VAL
              </p>

              <p className="text-xs text-zinc-500 mt-1">
                COMPETITIVE
              </p>
            </div>

            <div>
              <p className="text-xl md:text-2xl font-black text-white">
                FREE FIRE
              </p>

              <p className="text-xs text-zinc-500 mt-1">
                ESPORTS
              </p>
            </div>

          </motion.div>

        </div>

      </div>

      {/* BOTTOM FADE */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />

    </section>
  );
}