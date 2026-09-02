"use client";

import { motion } from "framer-motion";

const tournaments = [
  {
    game: "BGMI",
    title: "Jaipur Championship S1",
    prize: "₹10,000",
    date: "Coming Soon",
    icon: "🎯",
    gradient: "from-purple-500 to-fuchsia-500",
  },
  {
    game: "FREE FIRE",
    title: "JEC Clash Cup",
    prize: "₹5,000",
    date: "Coming Soon",
    icon: "🔥",
    gradient: "from-fuchsia-500 to-purple-500",
  },
  {
    game: "VALORANT",
    title: "Rajasthan Masters",
    prize: "₹15,000",
    date: "Coming Soon",
    icon: "⚔️",
    gradient: "from-indigo-500 to-purple-500",
  },
];

export default function TournamentSection() {
  return (
    <section className="relative bg-black py-20 md:py-24 px-6 overflow-hidden">

      {/* BACKGROUND GLOW */}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-purple-600/10 blur-[130px] rounded-full" />

      <div className="relative max-w-7xl mx-auto">

        {/* HEADER */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-purple-400 text-sm font-bold tracking-[0.3em]">
            COMPETE WITH THE BEST
          </p>

          <h2 className="text-4xl md:text-6xl font-black text-white mt-3">
            Upcoming Tournaments
          </h2>

          <p className="text-zinc-500 max-w-2xl mx-auto mt-4 text-base md:text-lg">
            Join the next generation of competitive esports tournaments
            powered by Jaipur Esports Club.
          </p>
        </motion.div>

        {/* TOURNAMENT CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {tournaments.map((tournament, index) => (
            <motion.div
              key={tournament.title}
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
                delay: index * 0.12,
                duration: 0.6,
              }}
              whileHover={{
                y: -8,
              }}
              className="group relative"
            >

              {/* CARD */}

              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/90 backdrop-blur-xl transition-all duration-300 group-hover:border-purple-500/40 group-hover:shadow-[0_0_45px_rgba(124,58,237,0.18)]">

                {/* TOP GRADIENT */}

                <div
                  className={`h-1 bg-gradient-to-r ${tournament.gradient}`}
                />

                {/* GAME HEADER */}

                <div className="p-6">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-2xl">
                        {tournament.icon}
                      </div>

                      <div>
                        <p className="text-xs text-zinc-500 font-bold tracking-widest">
                          GAME
                        </p>

                        <p className="text-purple-400 font-black">
                          {tournament.game}
                        </p>
                      </div>

                    </div>

                    {/* STATUS */}

                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                      UPCOMING
                    </span>

                  </div>

                  {/* TITLE */}

                  <h3 className="text-2xl font-black text-white mt-7">
                    {tournament.title}
                  </h3>

                  {/* DETAILS */}

                  <div className="grid grid-cols-2 gap-3 mt-6">

                    <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
                      <p className="text-xs text-zinc-500">
                        PRIZE POOL
                      </p>

                      <p className="text-xl font-black text-white mt-1">
                        {tournament.prize}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
                      <p className="text-xs text-zinc-500">
                        DATE
                      </p>

                      <p className="text-sm font-bold text-white mt-2">
                        {tournament.date}
                      </p>
                    </div>

                  </div>

                  {/* REGISTER */}

                  <a
                    href="/tournaments"
                    className="mt-6 flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 hover:scale-[1.02] transition-all duration-300"
                  >
                    Register Now
                    <span className="group-hover:translate-x-1 transition">
                      →
                    </span>
                  </a>

                </div>

                {/* CARD GLOW */}

                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-600/10 blur-[70px] rounded-full group-hover:bg-purple-600/20 transition" />

              </div>

            </motion.div>
          ))}

        </div>

        {/* VIEW ALL */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex justify-center mt-10"
        >
          <a
            href="/tournaments"
            className="px-7 py-3 rounded-xl border border-purple-500/30 bg-white/[0.02] text-zinc-300 font-semibold hover:bg-purple-500/10 hover:border-purple-400/50 hover:text-white transition"
          >
            View All Tournaments →
          </a>
        </motion.div>

      </div>
    </section>
  );
}