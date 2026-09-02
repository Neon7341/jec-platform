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
        const querySnapshot = await getDocs(collection(db, "tournaments"));

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
      <div className="text-white text-center mt-20 text-2xl">
        Loading tournaments...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-purple-500 mb-8">
        Tournaments
      </h1>

      {tournaments.length === 0 ? (
        <div className="text-center text-gray-400 text-xl">
          No tournaments available.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {tournaments.map((tournament) => (
            <div
              key={tournament.id}
              className="bg-zinc-900 border border-purple-700 rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold">
                {tournament.title}
              </h2>

              <p className="mt-3">🎮 {tournament.game}</p>

              <p>🏆 Prize Pool: {tournament.prizePool}</p>

              <p>💳 Entry Fee: {tournament.entryFee}</p>

              <p>📅 Date: {tournament.date}</p>

              <p>
                👥 Slots: {tournament.registeredTeams}/{tournament.slots}
              </p>

              <div className="mt-4">
                <span
                  className={`px-4 py-2 rounded-full text-sm ${
                    tournament.mode === "Free"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {tournament.mode}
                </span>
              </div>

              <Link
                href={`/dashboard/tournaments/${tournament.id}`}
              >
                <button className="mt-6 w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-bold">
                  View Details
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}