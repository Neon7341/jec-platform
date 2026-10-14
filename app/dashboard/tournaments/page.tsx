"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Tournament {
  id: string;
  title: string;
  game: string;
  prizePool: string;
  entryFee: string;
  mode: string;
  slots: number;
  registeredTeams: number;
  date: string;
}

export default function TournamentPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "tournaments")
        );

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Firestore Data:", data);

        setTournaments(data as Tournament[]);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-400 text-sm sm:text-base">
            Loading tournaments...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-500">
          Tournaments
        </h1>

        <p className="text-gray-400 text-sm sm:text-base mt-1">
          Explore and join upcoming Jaipur Esports Club tournaments.
        </p>
      </div>

      {/* Empty State */}
      {tournaments.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 sm:p-12 text-center">
          <div className="text-4xl mb-4">
            🎮
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white">
            No tournaments available
          </h2>

          <p className="text-gray-400 text-sm mt-2">
            Check back later for upcoming tournaments.
          </p>
        </div>
      ) : (

        /* Tournament Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

          {tournaments.map((tournament) => {

            const registered = Number(tournament.registeredTeams) || 0;
            const slots = Number(tournament.slots) || 0;

            const progress =
              slots > 0
                ? Math.min((registered / slots) * 100, 100)
                : 0;

            const isFull = slots > 0 && registered >= slots;

            return (
              <div
                key={tournament.id}
                className="
                  bg-zinc-900
                  border border-purple-700/60
                  hover:border-purple-500
                  rounded-xl sm:rounded-2xl
                  p-4 sm:p-6
                  transition
                  overflow-hidden
                "
              >

                {/* Top Section */}
                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-2xl font-bold text-white break-words">
                      {tournament.title}
                    </h2>

                    <p className="text-gray-400 text-sm mt-1">
                      🎮 {tournament.game}
                    </p>
                  </div>

                  {/* Mode */}
                  <span
                    className={`
                      shrink-0
                      px-2.5 sm:px-3
                      py-1
                      rounded-full
                      text-[10px] sm:text-xs
                      font-semibold
                      ${
                        tournament.mode === "Free"
                          ? "bg-green-600/20 text-green-400 border border-green-600/30"
                          : "bg-red-600/20 text-red-400 border border-red-600/30"
                      }
                    `}
                  >
                    {tournament.mode}
                  </span>

                </div>

                {/* Tournament Info */}
                <div className="grid grid-cols-2 gap-3 mt-5">

                  <div className="bg-black/30 rounded-xl p-3">
                    <p className="text-gray-500 text-xs">
                      Prize Pool
                    </p>

                    <p className="text-white font-bold text-sm sm:text-base mt-1">
                      🏆 {tournament.prizePool}
                    </p>
                  </div>

                  <div className="bg-black/30 rounded-xl p-3">
                    <p className="text-gray-500 text-xs">
                      Entry Fee
                    </p>

                    <p className="text-white font-bold text-sm sm:text-base mt-1">
                      💳 {tournament.entryFee}
                    </p>
                  </div>

                  <div className="bg-black/30 rounded-xl p-3">
                    <p className="text-gray-500 text-xs">
                      Date
                    </p>

                    <p className="text-white font-bold text-sm sm:text-base mt-1">
                      📅 {tournament.date}
                    </p>
                  </div>

                  <div className="bg-black/30 rounded-xl p-3">
                    <p className="text-gray-500 text-xs">
                      Slots
                    </p>

                    <p className="text-white font-bold text-sm sm:text-base mt-1">
                      👥 {registered}/{slots}
                    </p>
                  </div>

                </div>

                {/* Slot Progress */}
                <div className="mt-5">

                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400">
                      Registration
                    </span>

                    <span
                      className={`text-xs font-semibold ${
                        isFull
                          ? "text-red-400"
                          : "text-purple-400"
                      }`}
                    >
                      {isFull
                        ? "FULL"
                        : `${Math.max(slots - registered, 0)} slots left`}
                    </span>
                  </div>

                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 rounded-full transition-all"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>

                </div>

                {/* Button */}
                <Link
                  href={`/dashboard/tournaments/${tournament.id}`}
                  className="block mt-5"
                >
                  <button
                    className="
                      w-full
                      bg-purple-600
                      hover:bg-purple-700
                      active:scale-[0.98]
                      transition
                      py-3
                      sm:py-3.5
                      rounded-xl
                      font-bold
                      text-sm sm:text-base
                    "
                  >
                    {isFull ? "View Tournament" : "View Details"}
                  </button>
                </Link>

              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}