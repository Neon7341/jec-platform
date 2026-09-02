"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const benefits = [
  {
    icon: "🎯",
    title: "Brand Visibility",
    description:
      "Get your brand showcased across JEC tournaments, events, social media and digital platforms.",
  },
  {
    icon: "🎮",
    title: "Esports Audience",
    description:
      "Connect your brand with gamers, esports teams, college communities and competitive players.",
  },
  {
    icon: "📺",
    title: "Live Streaming",
    description:
      "Brand exposure through tournament livestreams, overlays, shoutouts and promotional segments.",
  },
  {
    icon: "📱",
    title: "Social Media",
    description:
      "Promotional opportunities across tournament announcements, posts, reels and stories.",
  },
  {
    icon: "🏆",
    title: "Tournament Branding",
    description:
      "Associate your brand with tournaments, championships and competitive esports events.",
  },
  {
    icon: "🏫",
    title: "College Events",
    description:
      "Reach students and young audiences through esports tournaments and college gaming events.",
  },
];

export default function SponsorsPage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">

      {/* BACKGROUND */}

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[150px]" />

        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[150px]" />

        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-700/10 rounded-full blur-[130px]" />
      </div>

      {/* GRID */}

      <div
        className="fixed inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(168,85,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* HERO */}

      <section className="relative z-10 pt-36 pb-24 px-6">

        <div className="max-w-6xl mx-auto text-center">

          {/* BADGE */}

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-7"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-semibold"
            >
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />

              JEC PARTNERS & SPONSORS
            </span>
          </motion.div>

          {/* TITLE */}

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight"
          >
            <span className="block text-white">
              POWERING
            </span>

            <span className="block bg-gradient-to-r from-purple-400 via-fuchsia-500 to-purple-600 bg-clip-text text-transparent">
              ESPORTS TOGETHER
            </span>
          </motion.h1>

          {/* DESCRIPTION */}

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="max-w-3xl mx-auto mt-8 text-lg md:text-xl text-zinc-400 leading-relaxed"
          >
            Partner with Jaipur Esports Club and connect your brand
            with Rajasthan's growing esports community through
            tournaments, livestreams, college events and digital
            campaigns.
          </motion.p>

          {/* CTA */}

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mt-10"
          >

            <a
              href="mailto:contact@jaipuresportsclub.com"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 font-bold shadow-[0_0_35px_rgba(124,58,237,0.35)] hover:scale-105 transition-all"
            >
              🤝 Become a Sponsor
            </a>

            <Link
              href="/contact"
              className="px-8 py-4 rounded-xl border border-purple-500/40 bg-white/[0.03] text-white font-bold hover:bg-purple-500/10 transition-all"
            >
              Contact JEC
            </Link>

          </motion.div>

        </div>
      </section>

      {/* WHY PARTNER */}

      <section className="relative z-10 py-20 px-6">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-14">

            <p className="text-purple-400 font-bold tracking-[0.25em] text-sm">
              WHY PARTNER WITH JEC
            </p>

            <h2 className="text-4xl md:text-5xl font-black mt-3">
              More Than Just Esports
            </h2>

            <p className="text-zinc-500 max-w-2xl mx-auto mt-5">
              Build meaningful connections with the gaming community
              while giving your brand a powerful presence in esports.
            </p>

          </div>

          {/* BENEFITS */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {benefits.map((benefit, index) => (

              <motion.div
                key={benefit.title}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: index * 0.08,
                }}
                whileHover={{
                  y: -8,
                }}
                className="group bg-zinc-900/70 border border-purple-500/20 hover:border-purple-500/60 rounded-2xl p-7 transition-all"
              >

                <div className="w-14 h-14 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-2xl mb-5 group-hover:bg-purple-500/20 transition">
                  {benefit.icon}
                </div>

                <h3 className="text-xl font-bold text-white">
                  {benefit.title}
                </h3>

                <p className="text-zinc-400 mt-3 leading-relaxed">
                  {benefit.description}
                </p>

              </motion.div>

            ))}

          </div>

        </div>

      </section>

      {/* SPONSORSHIP OPPORTUNITIES */}

      <section className="relative z-10 py-20 px-6">

        <div className="max-w-6xl mx-auto">

          <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-950/40 via-zinc-900 to-black p-8 md:p-14">

            <div className="grid md:grid-cols-2 gap-12 items-center">

              <div>

                <p className="text-purple-400 font-bold tracking-[0.2em] text-sm">
                  SPONSORSHIP OPPORTUNITIES
                </p>

                <h2 className="text-4xl md:text-5xl font-black mt-4">
                  Put Your Brand
                  <span className="text-purple-500">
                    {" "}In The Game.
                  </span>
                </h2>

                <p className="text-zinc-400 mt-6 leading-relaxed">
                  Whether you're looking for tournament branding,
                  livestream promotion, college activations or
                  digital visibility, JEC can create a partnership
                  tailored to your brand.
                </p>

                <a
                  href="mailto:contact@jaipuresportsclub.com"
                  className="inline-block mt-8 px-7 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 font-bold transition"
                >
                  Discuss Partnership →
                </a>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div className="bg-black/50 border border-white/10 rounded-2xl p-6">
                  <p className="text-3xl font-black text-purple-400">
                    🎮
                  </p>
                  <p className="font-bold mt-3">
                    Esports
                  </p>
                  <p className="text-sm text-zinc-500 mt-1">
                    Competitive tournaments
                  </p>
                </div>

                <div className="bg-black/50 border border-white/10 rounded-2xl p-6">
                  <p className="text-3xl font-black text-purple-400">
                    📺
                  </p>
                  <p className="font-bold mt-3">
                    Streaming
                  </p>
                  <p className="text-sm text-zinc-500 mt-1">
                    Live tournament exposure
                  </p>
                </div>

                <div className="bg-black/50 border border-white/10 rounded-2xl p-6">
                  <p className="text-3xl font-black text-purple-400">
                    🏫
                  </p>
                  <p className="font-bold mt-3">
                    Colleges
                  </p>
                  <p className="text-sm text-zinc-500 mt-1">
                    Student engagement
                  </p>
                </div>

                <div className="bg-black/50 border border-white/10 rounded-2xl p-6">
                  <p className="text-3xl font-black text-purple-400">
                    📱
                  </p>
                  <p className="font-bold mt-3">
                    Digital
                  </p>
                  <p className="text-sm text-zinc-500 mt-1">
                    Social media campaigns
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* FINAL CTA */}

      <section className="relative z-10 py-24 px-6">

        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-4xl md:text-6xl font-black">
            Ready to Join
            <span className="text-purple-500">
              {" "}JEC?
            </span>
          </h2>

          <p className="text-zinc-400 text-lg mt-5">
            Let's build the next generation of esports experiences
            together.
          </p>

          <a
            href="mailto:contact@jaipuresportsclub.com"
            className="inline-block mt-8 px-10 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 font-bold text-lg hover:scale-105 transition-all"
          >
            Become a JEC Partner
          </a>

        </div>

      </section>

    </main>
  );
}