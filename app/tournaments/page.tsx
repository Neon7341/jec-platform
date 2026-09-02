"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const tournaments = [
  {
    game: "BGMI",
    title: "JEC Championship S1",
    prize: "₹1,00,000",
    entry: "Coming Soon",
    status: "Coming Soon",
  },
  {
    game: "FREE FIRE",
    title: "JEC Clash Cup S1",
    prize: "₹10,000",
    entry: "Coming Soon",
    status: "Coming Soon",
  },
  {
    game: "VALORANT",
    title: "Rajasthan Masters S1",
    prize: "₹20,000",
    entry: "Coming Soon",
    status: "Coming Soon",
  },
];

export default function TournamentsPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="relative overflow-hidden py-28 px-6">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.18),transparent_65%)]" />

        <div className="relative max-w-7xl mx-auto text-center">

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-purple-400 font-bold tracking-[0.25em] text-sm mb-5"
          >
            COMPETE. CONQUER. CHAMPION.
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-black"
          >
            TOURNAMENTS
          </motion.h1>

          <p className="text-zinc-400 max-w-2xl mx-auto mt-6 text-lg">
            Compete in professionally managed esports tournaments
            across India's most popular competitive games.
          </p>

        </div>
      </section>


      {/* TOURNAMENTS */}

      <section className="px-6 pb-24">

        <div className="max-w-7xl mx-auto">

          <div className="grid md:grid-cols-3 gap-8">

            {tournaments.map((tournament, index) => (

              <motion.div
                key={tournament.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative bg-zinc-950 border border-purple-500/30 rounded-3xl p-7 overflow-hidden hover:border-purple-500 transition-all"
              >

                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-fuchsia-600/5 opacity-0 group-hover:opacity-100 transition" />

                <div className="relative">

                  <div className="flex justify-between items-center">

                    <span className="px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-sm font-bold">
                      {tournament.game}
                    </span>

                    <span className="text-xs text-zinc-500">
                      {tournament.status}
                    </span>

                  </div>

                  <h2 className="text-2xl font-bold mt-7">
                    {tournament.title}
                  </h2>

                  <div className="mt-6 space-y-3">

                    <div className="flex justify-between">
                      <span className="text-zinc-500">
                        Prize Pool
                      </span>

                      <span className="text-purple-400 font-bold">
                        {tournament.prize}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-zinc-500">
                        Entry Fee
                      </span>

                      <span className="text-white font-semibold">
                        {tournament.entry}
                      </span>
                    </div>

                  </div>

                  <Link
                    href="/signup"
                    className="block text-center mt-8 bg-gradient-to-r from-purple-600 to-fuchsia-600 py-3 rounded-xl font-bold hover:scale-[1.02] transition"
                  >
                    Register Now →
                  </Link>

                </div>

              </motion.div>

            ))}

          </div>

        </div>

      </section>

    </main>
  );
}