"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "@/lib/firebase";
import toast from "react-hot-toast";

interface Tournament {
  id: string;
  title?: string;
  game?: string;
  prizePool?: string | number;
  entryFee?: string | number;
  mode?: string;
  approvalType?: string;
  slots?: number | null;
  unlimitedSlots?: boolean;
  registeredTeams?: number;
  date?: string;
  status?: string;
}

interface Registration {
  id: string;
  tournamentId?: string;
  teamName?: string;

  captainName?: string;
  captainEmail?: string;
  captainPhone?: string;
  captainUID?: string;
  captainAuthUID?: string;

  player2Name?: string;
  player2UID?: string;

  player3Name?: string;
  player3UID?: string;

  player4Name?: string;
  player4UID?: string;

  player5Name?: string;
  player5UID?: string;

  substituteName?: string;
  substituteUID?: string;

  registrationStatus?: "pending" | "approved" | "rejected";
  paymentStatus?: string;
  paymentId?: string;
  orderId?: string;
}

export default function TournamentDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const tournamentId = params.id as string;

  const [userLoading, setUserLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  const [tournament, setTournament] =
    useState<Tournament | null>(null);

  const [myRegistration, setMyRegistration] =
    useState<Registration | null>(null);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!tournamentId) return;

    let unsubscribe: (() => void) | undefined;

    const loadPage = () => {
      unsubscribe = onAuthStateChanged(
        auth,
        async (user) => {
          try {
            setUserLoading(false);

            if (!user) {
              toast.error("Please login first.");
              router.push("/login");
              return;
            }

            setLoading(true);
            setError("");

            // ============================================
            // 1. LOAD TOURNAMENT
            // ============================================

            const tournamentRef = doc(
              db,
              "tournaments",
              tournamentId
            );

            const tournamentSnap = await getDoc(
              tournamentRef
            );

            if (!tournamentSnap.exists()) {
              setTournament(null);
              setError("Tournament not found.");
              setLoading(false);
              return;
            }

            const tournamentData =
              tournamentSnap.data();

            setTournament({
              id: tournamentSnap.id,
              ...tournamentData,
            } as Tournament);

            // ============================================
            // 2. LOAD ONLY CURRENT USER'S REGISTRATIONS
            // ============================================
            //
            // Your Firestore rules allow a user to read
            // registrations where captainAuthUID == user.uid.
            //
            // We therefore query by captainAuthUID first
            // and then find this tournament locally.
            //
            // This avoids the permission error and also
            // avoids needing a composite Firestore index.
            // ============================================

            const registrationsRef = collection(
              db,
              "registrations"
            );

            const registrationsQuery = query(
              registrationsRef,
              where(
                "captainAuthUID",
                "==",
                user.uid
              )
            );

            const registrationSnap =
              await getDocs(registrationsQuery);

            const userRegistrations =
              registrationSnap.docs.map((registrationDoc) => ({
                id: registrationDoc.id,
                ...registrationDoc.data(),
              })) as Registration[];

            const currentRegistration =
              userRegistrations.find(
                (registration) =>
                  registration.tournamentId ===
                  tournamentId
              );

            setMyRegistration(
              currentRegistration || null
            );
          } catch (error: any) {
            console.error(
              "Tournament loading error:",
              error
            );

            if (
              error?.code ===
              "permission-denied"
            ) {
              setError(
                "You do not have permission to view this tournament."
              );

              toast.error(
                "Firestore permission denied."
              );
            } else {
              setError(
                "Failed to load tournament."
              );

              toast.error(
                "Failed to load tournament."
              );
            }
          } finally {
            setLoading(false);
          }
        }
      );
    };

    loadPage();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [tournamentId, router]);

  // ============================================
  // LOADING AUTH
  // ============================================

  if (userLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-5 text-zinc-400">
            Checking login...
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // LOADING TOURNAMENT
  // ============================================

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-5 text-purple-400 text-lg">
            Loading tournament...
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // ERROR
  // ============================================

  if (error || !tournament) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-zinc-900 border border-red-600/40 rounded-2xl p-8 text-center">

          <div className="text-5xl mb-5">
            ⚠️
          </div>

          <h1 className="text-2xl font-bold text-red-500">
            {error || "Tournament not found"}
          </h1>

          <p className="text-zinc-400 mt-3">
            We could not load this tournament.
          </p>

          <button
            onClick={() =>
              router.push("/dashboard/tournaments")
            }
            className="mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold"
          >
            Back to Tournaments
          </button>

        </div>
      </div>
    );
  }

  const isFree =
    tournament.mode === "Free";

  const isFull =
    !tournament.unlimitedSlots &&
    typeof tournament.slots === "number" &&
    (tournament.registeredTeams ?? 0) >=
      tournament.slots;

  const registrationClosed =
    tournament.status ===
      "Registration Closed" ||
    tournament.status ===
      "Completed";

  const canRegister =
    !myRegistration &&
    !isFull &&
    !registrationClosed;

  // ============================================
  // PAGE
  // ============================================

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-8 py-8">

      <div className="max-w-6xl mx-auto">

        {/* BACK BUTTON */}

        <Link
          href="/dashboard/tournaments"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-purple-400 transition mb-6"
        >
          ← Back to Tournaments
        </Link>

        {/* HEADER */}

        <div className="relative overflow-hidden rounded-3xl border border-purple-700/50 bg-zinc-900 p-6 md:p-10">

          {/* GLOW */}

          <div className="absolute -top-32 -right-32 w-80 h-80 bg-purple-600/20 blur-[100px] rounded-full" />

          <div className="relative">

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

              <div>

                <div className="flex flex-wrap gap-2 mb-4">

                  {tournament.game && (
                    <span className="px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm font-bold">
                      🎮 {tournament.game}
                    </span>
                  )}

                  {tournament.status && (
                    <span className="px-3 py-1 rounded-full bg-green-600/20 border border-green-500/30 text-green-300 text-sm font-bold">
                      {tournament.status}
                    </span>
                  )}

                </div>

                <h1 className="text-3xl md:text-5xl font-black text-white">
                  {tournament.title ||
                    "Tournament"}
                </h1>

                <p className="text-zinc-400 mt-3">
                  Compete. Conquer. Champion.
                </p>

              </div>

              {/* PRIZE */}

              <div className="bg-black/50 border border-purple-500/30 rounded-2xl p-5 min-w-[180px]">

                <p className="text-xs uppercase tracking-widest text-zinc-500">
                  Prize Pool
                </p>

                <p className="text-3xl font-black text-purple-400 mt-1">
                  ₹
                  {Number(
                    tournament.prizePool || 0
                  ).toLocaleString("en-IN")}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* INFORMATION GRID */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">

          {/* ENTRY FEE */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">

            <p className="text-sm text-zinc-500">
              Entry Fee
            </p>

            <p className="text-2xl font-black mt-2">
              {isFree
                ? "FREE"
                : `₹${Number(
                    tournament.entryFee || 0
                  ).toLocaleString("en-IN")}`}
            </p>

          </div>

          {/* DATE */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">

            <p className="text-sm text-zinc-500">
              Tournament Date
            </p>

            <p className="text-xl font-bold mt-2">
              {tournament.date ||
                "Coming Soon"}
            </p>

          </div>

          {/* SLOTS */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">

            <p className="text-sm text-zinc-500">
              Slots
            </p>

            <p className="text-xl font-bold mt-2">

              {tournament.unlimitedSlots
                ? "Unlimited"
                : tournament.slots ?? "N/A"}

            </p>

          </div>

          {/* REGISTERED */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">

            <p className="text-sm text-zinc-500">
              Registered Teams
            </p>

            <p className="text-2xl font-black text-purple-400 mt-2">

              {tournament.registeredTeams ??
                0}

              {!tournament.unlimitedSlots &&
                tournament.slots && (
                  <span className="text-zinc-500 text-base">
                    {" "}
                    / {tournament.slots}
                  </span>
                )}

            </p>

          </div>

        </div>

        {/* REGISTRATION STATUS */}

        {myRegistration && (
          <div className="mt-6 bg-zinc-900 border border-purple-600/50 rounded-2xl p-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              <div>

                <p className="text-sm text-zinc-500">
                  Your Registration
                </p>

                <h2 className="text-2xl font-black text-white mt-1">
                  {myRegistration.teamName ||
                    "Your Team"}
                </h2>

                <p className="text-zinc-400 mt-2">
                  Captain:{" "}
                  {myRegistration.captainName ||
                    "N/A"}
                </p>

              </div>

              <div className="flex flex-col items-start md:items-end gap-3">

                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold ${
                    myRegistration.registrationStatus ===
                    "approved"
                      ? "bg-green-600"
                      : myRegistration.registrationStatus ===
                        "rejected"
                      ? "bg-red-600"
                      : "bg-yellow-500 text-black"
                  }`}
                >
                  Registration:{" "}
                  {(
                    myRegistration.registrationStatus ||
                    "pending"
                  ).toUpperCase()}
                </span>

                {myRegistration.paymentStatus && (
                  <span className="text-sm text-zinc-400">
                    Payment:{" "}
                    {myRegistration.paymentStatus}
                  </span>
                )}

              </div>

            </div>

          </div>
        )}

        {/* REGISTER BUTTON */}

        <div className="mt-8">

          {myRegistration ? (
            <div className="bg-green-600/10 border border-green-600/30 rounded-2xl p-6 text-center">

              <div className="text-3xl">
                ✅
              </div>

              <h2 className="text-xl font-bold text-green-400 mt-2">
                You are already registered
              </h2>

              <p className="text-zinc-400 mt-1">
                Your team has already been
                registered for this tournament.
              </p>

            </div>
          ) : registrationClosed ? (
            <div className="bg-red-600/10 border border-red-600/30 rounded-2xl p-6 text-center">

              <h2 className="text-xl font-bold text-red-400">
                Registration Closed
              </h2>

              <p className="text-zinc-400 mt-2">
                Registration for this tournament
                is currently closed.
              </p>

            </div>
          ) : isFull ? (
            <div className="bg-red-600/10 border border-red-600/30 rounded-2xl p-6 text-center">

              <h2 className="text-xl font-bold text-red-400">
                Tournament Full
              </h2>

              <p className="text-zinc-400 mt-2">
                All available slots have been
                filled.
              </p>

            </div>
          ) : (
            <Link
              href={`/dashboard/tournaments/${tournamentId}/register`}
              className="block w-full"
            >

              <button
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 transition-all shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:shadow-[0_0_45px_rgba(124,58,237,0.5)] text-lg font-black"
              >
                🏆 Register Now
              </button>

            </Link>
          )}

        </div>

        {/* TOURNAMENT DETAILS */}

        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

          <h2 className="text-2xl font-black text-purple-400 mb-5">
            Tournament Details
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <p className="text-sm text-zinc-500">
                Game
              </p>

              <p className="font-bold mt-1">
                🎮 {tournament.game ||
                  "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-500">
                Tournament Mode
              </p>

              <p className="font-bold mt-1">
                💰 {tournament.mode ||
                  "Paid"}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-500">
                Approval Type
              </p>

              <p className="font-bold mt-1">
                ⚙️{" "}
                {tournament.approvalType ||
                  "Automatic"}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-500">
                Tournament Status
              </p>

              <p className="font-bold mt-1">
                📢{" "}
                {tournament.status ||
                  "Registration Open"}
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}