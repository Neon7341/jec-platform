"use client";

import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* HEADER */}

      <section className="relative py-28 px-6 overflow-hidden">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.18),transparent_65%)]" />

        <div className="relative max-w-7xl mx-auto text-center">

          <p className="text-purple-400 font-bold tracking-[0.25em] text-sm">
            GET IN TOUCH
          </p>

          <h1 className="text-5xl md:text-7xl font-black mt-5">
            CONTACT JEC
          </h1>

          <p className="text-zinc-400 max-w-2xl mx-auto mt-6 text-lg">
            Want to organize a tournament, collaborate with JEC,
            sponsor an event, or join our esports community?
          </p>

        </div>

      </section>


      {/* CONTACT CONTENT */}

      <section className="px-6 pb-24">

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">

          {/* INFO */}

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-950 border border-purple-500/30 rounded-3xl p-8"
          >

            <h2 className="text-3xl font-bold">
              Let's Connect
            </h2>

            <p className="text-zinc-400 mt-4 leading-relaxed">
              Jaipur Esports Club is building a competitive esports
              ecosystem for players, teams, colleges, brands and
              tournament organizers.
            </p>

            <div className="mt-8 space-y-5">

              <div>
                <p className="text-zinc-500 text-sm">
                  EMAIL
                </p>

                <p className="text-white font-semibold mt-1">
                  contact@jaipuresportsclub.com
                </p>
              </div>

              <div>
                <p className="text-zinc-500 text-sm">
                  LOCATION
                </p>

                <p className="text-white font-semibold mt-1">
                  Jaipur, Rajasthan, India
                </p>
              </div>

              <div>
                <p className="text-zinc-500 text-sm">
                  SERVICES
                </p>

                <p className="text-purple-400 font-semibold mt-1">
                  Tournaments • LAN Events • College Events •
                  Esports Management
                </p>
              </div>

            </div>

          </motion.div>


          {/* FORM */}

          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-950 border border-purple-500/30 rounded-3xl p-8"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you! We will contact you soon.");
            }}
          >

            <h2 className="text-3xl font-bold mb-7">
              Send a Message
            </h2>

            <div className="space-y-5">

              <input
                type="text"
                placeholder="Your Name"
                required
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-purple-500"
              />

              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-purple-500"
              />

              <input
                type="text"
                placeholder="Subject"
                required
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-purple-500"
              />

              <textarea
                placeholder="Your Message"
                required
                rows={5}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-purple-500 resize-none"
              />

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 py-4 rounded-xl font-bold hover:scale-[1.02] transition"
              >
                Send Message →
              </button>

            </div>

          </motion.form>

        </div>

      </section>

    </main>
  );
}