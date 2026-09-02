"use client";

import { motion } from "framer-motion";

export default function Stats() {
  const stats = [
    {
      title: "LIVE TOURNAMENT",
      value: "BGMI Jaipur Championship",
      icon: "🏆",
      accent: "from-purple-500 to-fuchsia-500",
    },
    {
      title: "PRIZE POOL",
      value: "₹10,000",
      icon: "💰",
      accent: "from-fuchsia-500 to-purple-500",
    },
    {
      title: "REGISTERED TEAMS",
      value: "500+",
      icon: "👥",
      accent: "from-purple-600 to-indigo-500",
    },
    {
      title: "GAMES",
      value: "BGMI • VALORANT • FREE FIRE",
      icon: "🎮",
      accent: "from-indigo-500 to-purple-500",
    },
  ];

  return (
    <section className="relative bg-black py-16 md:py-20 overflow-hidden">

      {/* BACKGROUND GLOW */}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-purple-600/10 blur-[120px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* SECTION HEADER */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-purple-400 text-sm font-bold tracking-[0.25em]">
            JEC ESPORTS
          </p>

          <h2 className="text-3xl md:text-4xl font-black text-white mt-2">
            THE COMPETITIVE ARENA
          </h2>

          <p className="text-zinc-500 mt-3 max-w-xl mx-auto">
            Everything you need to compete, connect and dominate.
          </p>
        </motion.div>

        {/* STATS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {stats.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.1,
                duration: 0.5,
              }}
              whileHover={{
                y: -6,
              }}
              className="group relative"
            >

              {/* CARD */}

              <div className="relative h-full rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl p-6 overflow-hidden transition-all duration-300 group-hover:border-purple-500/40 group-hover:shadow-[0_0_35px_rgba(124,58,237,0.15)]">

                {/* TOP LINE */}

                <div
                  className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${item.accent} opacity-70`}
                />

                {/* ICON */}

                <div className="flex items-center justify-between">

                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>

                  <span className="text-purple-500/30 text-3xl font-black">
                    0{index + 1}
                  </span>

                </div>

                {/* TITLE */}

                <p className="text-xs text-zinc-500 font-bold tracking-[0.18em] mt-6">
                  {item.title}
                </p>

                {/* VALUE */}

                <h3
                  className={`mt-2 font-black text-white ${
                    index === 0
                      ? "text-lg"
                      : index === 3
                      ? "text-base"
                      : "text-3xl"
                  }`}
                >
                  {item.value}
                </h3>

                {/* BOTTOM GLOW */}

                <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-purple-600/10 blur-3xl rounded-full group-hover:bg-purple-600/20 transition" />

              </div>

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}