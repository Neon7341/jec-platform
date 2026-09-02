"use client";

import { motion } from "framer-motion";

const games = [
  {
    name: "BGMI",
    description: "Battle Royale",
    image: "/games/bgmi.jpg",
    icon: "🎯",
  },
  {
    name: "Free Fire MAX",
    description: "Battle Royale",
    image: "/games/freefire.jpg",
    icon: "🔥",
  },
  {
    name: "VALORANT",
    description: "Tactical FPS",
    image: "/games/valorant.jpg",
    icon: "⚔️",
  },
  {
    name: "Call of Duty Mobile",
    description: "Competitive FPS",
    image: "/games/codm.jpg",
    icon: "🎮",
  },
];

export default function GamesSection() {
  return (
    <section className="relative bg-black py-20 md:py-24 overflow-hidden">

      {/* BACKGROUND GLOW */}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-purple-600/10 blur-[140px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* HEADER */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-purple-400 text-sm font-bold tracking-[0.3em]">
            PLAY YOUR GAME
          </p>

          <h2 className="text-4xl md:text-6xl font-black text-white mt-3">
            Featured Games
          </h2>

          <p className="text-zinc-500 max-w-2xl mx-auto mt-4 text-base md:text-lg">
            Compete across the biggest competitive games and prove
            yourself against the best players.
          </p>
        </motion.div>

        {/* GAME GRID */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {games.map((game, index) => (
            <motion.div
              key={game.name}
              initial={{
                opacity: 0,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.1,
                duration: 0.6,
              }}
              whileHover={{
                y: -8,
              }}
              className="group relative"
            >

              {/* CARD */}

              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 transition-all duration-300 group-hover:border-purple-500/50 group-hover:shadow-[0_0_40px_rgba(124,58,237,0.2)]">

                {/* IMAGE */}

                <div className="relative h-72 overflow-hidden">

                  <img
                    src={game.image}
                    alt={game.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* IMAGE OVERLAY */}

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  <div className="absolute inset-0 bg-purple-900/0 group-hover:bg-purple-900/10 transition duration-500" />

                  {/* GAME ICON */}

                  <div className="absolute top-5 left-5 w-11 h-11 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-xl">
                    {game.icon}
                  </div>

                  {/* GAME NUMBER */}

                  <span className="absolute top-5 right-5 text-white/30 text-2xl font-black">
                    0{index + 1}
                  </span>

                  {/* GAME NAME */}

                  <div className="absolute bottom-5 left-5 right-5">

                    <p className="text-purple-300 text-xs font-bold tracking-[0.2em] uppercase">
                      {game.description}
                    </p>

                    <h3 className="text-2xl md:text-3xl font-black text-white mt-1">
                      {game.name}
                    </h3>

                  </div>

                </div>

                {/* CARD FOOTER */}

                <div className="p-5 flex items-center justify-between">

                  <div>
                    <p className="text-xs text-zinc-500 font-semibold">
                      JEC ESPORTS
                    </p>

                    <p className="text-sm text-zinc-300 mt-1">
                      Tournaments Available
                    </p>
                  </div>

                  <span className="w-9 h-9 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition">
                    →
                  </span>

                </div>

              </div>

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}