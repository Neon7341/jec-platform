"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    tournaments: 0,
    registrations: 0,
    pending: 0,
    approved: 0,
    revenue: 0,
  });

  const [recentTournaments, setRecentTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        // -----------------------------
        // TOURNAMENTS
        // -----------------------------

        const tournamentSnap = await getDocs(
          collection(db, "tournaments")
        );

        // -----------------------------
        // REGISTRATIONS
        // -----------------------------

        const registrationSnap = await getDocs(
          collection(db, "registrations")
        );

        const pendingSnap = await getDocs(
          query(
            collection(db, "registrations"),
            where("registrationStatus", "==", "pending")
          )
        );

        const approvedSnap = await getDocs(
          query(
            collection(db, "registrations"),
            where("registrationStatus", "==", "approved")
          )
        );

        // -----------------------------
        // REVENUE
        // -----------------------------

        let totalRevenue = 0;

        registrationSnap.docs.forEach((doc) => {
          const data = doc.data();

          if (
            data.paymentStatus === "paid" &&
            data.registrationStatus === "approved"
          ) {
            const tournament = tournamentSnap.docs.find(
              (tournamentDoc) =>
                tournamentDoc.id === data.tournamentId
            );

            if (tournament) {
              const tournamentData = tournament.data();

              totalRevenue += Number(
                tournamentData.entryFee || 0
              );
            }
          }
        });

        // -----------------------------
        // RECENT TOURNAMENTS
        // -----------------------------

        const recentQuery = query(
          collection(db, "tournaments"),
          orderBy("createdAt", "desc"),
          limit(5)
        );

        const recentSnap = await getDocs(recentQuery);

        const recent = recentSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRecentTournaments(recent);

        // -----------------------------
        // SET STATS
        // -----------------------------

        setStats({
          tournaments: tournamentSnap.size,
          registrations: registrationSnap.size,
          pending: pendingSnap.size,
          approved: approvedSnap.size,
          revenue: totalRevenue,
        });
      } catch (error) {
        console.error("Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="space-y-10">

      {/* HEADER */}

      <div>
        <h1 className="text-5xl font-bold text-purple-500">
          Admin Dashboard
        </h1>

        <p className="text-zinc-400 mt-2">
          Jaipur Esports Club Tournament Management
        </p>
      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">

        {/* TOURNAMENTS */}

        <div className="bg-zinc-900 border border-purple-700 rounded-2xl p-6">
          <p className="text-zinc-400">
            🏆 Tournaments
          </p>

          <p className="text-4xl mt-4 font-bold text-purple-400">
            {loading ? "..." : stats.tournaments}
          </p>
        </div>

        {/* REGISTRATIONS */}

        <div className="bg-zinc-900 border border-purple-700 rounded-2xl p-6">
          <p className="text-zinc-400">
            👥 Registrations
          </p>

          <p className="text-4xl mt-4 font-bold text-purple-400">
            {loading ? "..." : stats.registrations}
          </p>
        </div>

        {/* PENDING */}

        <div className="bg-zinc-900 border border-yellow-700 rounded-2xl p-6">
          <p className="text-zinc-400">
            ⏳ Pending
          </p>

          <p className="text-4xl mt-4 font-bold text-yellow-400">
            {loading ? "..." : stats.pending}
          </p>
        </div>

        {/* APPROVED */}

        <div className="bg-zinc-900 border border-green-700 rounded-2xl p-6">
          <p className="text-zinc-400">
            ✅ Approved
          </p>

          <p className="text-4xl mt-4 font-bold text-green-400">
            {loading ? "..." : stats.approved}
          </p>
        </div>

        {/* REVENUE */}

        <div className="bg-zinc-900 border border-blue-700 rounded-2xl p-6">
          <p className="text-zinc-400">
            💰 Revenue
          </p>

          <p className="text-4xl mt-4 font-bold text-blue-400">
            ₹{loading ? "..." : stats.revenue}
          </p>
        </div>

      </div>

      {/* RECENT TOURNAMENTS */}

      <div>
        <h2 className="text-3xl font-bold text-purple-400 mb-5">
          Recent Tournaments
        </h2>

        <div className="space-y-4">

          {recentTournaments.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
              <p className="text-zinc-400">
                No tournaments created yet.
              </p>
            </div>
          ) : (
            recentTournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="bg-zinc-900 border border-purple-700 rounded-2xl p-6"
              >

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  <div>
                    <h3 className="text-xl font-bold">
                      {tournament.title}
                    </h3>

                    <p className="text-zinc-400 mt-1">
                      🎮 {tournament.game}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">

                    <span className="bg-purple-600 px-4 py-2 rounded-full text-sm">
                      👥{" "}
                      {tournament.registeredTeams ?? 0}
                      {" / "}
                      {tournament.unlimitedSlots
                        ? "Unlimited"
                        : tournament.slots}
                    </span>

                    <span
                      className={`px-4 py-2 rounded-full text-sm ${
                        tournament.status ===
                        "Registration Open"
                          ? "bg-green-600"
                          : "bg-zinc-700"
                      }`}
                    >
                      {tournament.status}
                    </span>

                  </div>

                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-5 text-sm">

                  <div>
                    <span className="text-zinc-500">
                      Prize Pool
                    </span>

                    <p className="font-bold mt-1">
                      ₹{tournament.prizePool}
                    </p>
                  </div>

                  <div>
                    <span className="text-zinc-500">
                      Entry Fee
                    </span>

                    <p className="font-bold mt-1">
                      ₹{tournament.entryFee}
                    </p>
                  </div>

                  <div>
                    <span className="text-zinc-500">
                      Date
                    </span>

                    <p className="font-bold mt-1">
                      {tournament.date}
                    </p>
                  </div>

                </div>

              </div>
            ))
          )}

        </div>
      </div>

    </div>
  );
}