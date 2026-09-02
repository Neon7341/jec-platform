"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTournaments = async () => {
    try {
      const snapshot = await getDocs(collection(db, "tournaments"));

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setTournaments(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load tournaments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this tournament?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "tournaments", id));

      toast.success("Tournament deleted successfully");

      fetchTournaments();
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />

          <p className="text-zinc-400 mt-4">
            Loading tournaments...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">

        <div>
          <p className="text-purple-400 text-sm font-bold tracking-widest">
            ADMIN PANEL
          </p>

          <h1 className="text-3xl md:text-4xl font-black text-white mt-1">
            Tournament Management
          </h1>

          <p className="text-zinc-500 mt-2">
            Create, manage, edit and delete your tournaments.
          </p>
        </div>

        <Link
          href="/admin/tournaments/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold shadow-lg shadow-purple-600/20 hover:scale-[1.02] transition"
        >
          <span className="text-xl">+</span>
          Create Tournament
        </Link>

      </div>

      {/* SUMMARY */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

        <div className="bg-zinc-950 border border-white/10 rounded-2xl p-5">
          <p className="text-sm text-zinc-500">
            TOTAL TOURNAMENTS
          </p>

          <p className="text-3xl font-black text-white mt-2">
            {tournaments.length}
          </p>
        </div>

        <div className="bg-zinc-950 border border-white/10 rounded-2xl p-5">
          <p className="text-sm text-zinc-500">
            OPEN REGISTRATIONS
          </p>

          <p className="text-3xl font-black text-purple-400 mt-2">
            {
              tournaments.filter(
                (item) =>
                  item.registrationStatus === "open" ||
                  item.status === "Registration Open"
              ).length
            }
          </p>
        </div>

        <div className="bg-zinc-950 border border-white/10 rounded-2xl p-5">
          <p className="text-sm text-zinc-500">
            REGISTERED TEAMS
          </p>

          <p className="text-3xl font-black text-white mt-2">
            {tournaments.reduce(
              (total, item) =>
                total + Number(item.registeredTeams ?? 0),
              0
            )}
          </p>
        </div>

      </div>

      {/* TOURNAMENT LIST */}

      {tournaments.length === 0 ? (
        <div className="bg-zinc-950 border border-white/10 rounded-2xl p-12 text-center">

          <div className="text-5xl mb-4">
            🏆
          </div>

          <h2 className="text-xl font-bold text-white">
            No tournaments found
          </h2>

          <p className="text-zinc-500 mt-2">
            Create your first tournament to get started.
          </p>

        </div>
      ) : (
        <div className="space-y-5">

          {tournaments.map((tournament) => {

            const isOpen =
              tournament.registrationStatus === "open" ||
              tournament.status === "Registration Open";

            return (
              <div
                key={tournament.id}
                className="group bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition"
              >

                {/* TOP LINE */}

                <div className="h-1 bg-gradient-to-r from-purple-600 to-fuchsia-600 opacity-70" />

                <div className="p-6">

                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                    {/* INFORMATION */}

                    <div className="flex-1">

                      <div className="flex flex-wrap items-center gap-3 mb-3">

                        <h2 className="text-2xl font-black text-white">
                          {tournament.title || "Untitled Tournament"}
                        </h2>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            isOpen
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : "bg-zinc-800 text-zinc-400 border-white/10"
                          }`}
                        >
                          {isOpen ? "REGISTRATION OPEN" : "CLOSED"}
                        </span>

                      </div>

                      <p className="text-purple-400 font-bold">
                        🎮 {tournament.game || "Game not specified"}
                      </p>

                      {/* DETAILS */}

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">

                        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                          <p className="text-xs text-zinc-500">
                            PRIZE POOL
                          </p>

                          <p className="text-white font-bold mt-1">
                            ₹{tournament.prizePool ?? 0}
                          </p>
                        </div>

                        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                          <p className="text-xs text-zinc-500">
                            ENTRY FEE
                          </p>

                          <p className="text-white font-bold mt-1">
                            ₹{tournament.entryFee ?? 0}
                          </p>
                        </div>

                        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                          <p className="text-xs text-zinc-500">
                            TEAMS
                          </p>

                          <p className="text-white font-bold mt-1">
                            {tournament.registeredTeams ?? 0}
                          </p>
                        </div>

                        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                          <p className="text-xs text-zinc-500">
                            SLOTS
                          </p>

                          <p className="text-white font-bold mt-1">
                            {tournament.unlimitedSlots
                              ? "Unlimited"
                              : tournament.slots ?? 0}
                          </p>
                        </div>

                      </div>

                      <div className="flex flex-wrap gap-5 mt-5 text-sm text-zinc-500">

                        <span>
                          📅 {tournament.date || "Date not set"}
                        </span>

                        {tournament.time && (
                          <span>
                            🕐 {tournament.time}
                          </span>
                        )}

                        {tournament.approvalType && (
                          <span>
                            ✓ {tournament.approvalType}
                          </span>
                        )}

                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-36">

                      <Link
                        href={`/admin/tournaments/${tournament.id}`}
                        className="px-4 py-2.5 rounded-xl bg-blue-600/90 hover:bg-blue-600 text-white text-center font-semibold transition"
                      >
                        👁 Manage
                      </Link>

                      <Link
                        href={`/admin/tournaments/edit/${tournament.id}`}
                        className="px-4 py-2.5 rounded-xl bg-green-600/90 hover:bg-green-600 text-white text-center font-semibold transition"
                      >
                        ✏️ Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(tournament.id)}
                        className="px-4 py-2.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white font-semibold transition"
                      >
                        🗑 Delete
                      </button>

                    </div>

                  </div>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}