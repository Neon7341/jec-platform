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
            // LOAD TOURNAMENT
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
            // LOAD CURRENT USER REGISTRATION
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
              registrationSnap.docs.map(
                (registrationDoc) => ({
                  id: registrationDoc.id,
                  ...registrationDoc.data(),
                })
              ) as Registration[];

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
  // AUTH LOADING
  // ============================================

  if (userLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm sm:text-base text-zinc-400">
            Checking login...
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // TOURNAMENT LOADING
  // ============================================

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm sm:text-lg text-purple-400">
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
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-zinc-900 border border-red-600/40 rounded-2xl p-6 sm:p-8 text-center">

          <div className="text-4xl sm:text-5xl mb-4">
            ⚠️
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-red-500">
            {error || "Tournament not found"}
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base mt-3">
            We could not load this tournament.
          </p>

          <button
            onClick={() =>
              router.push("/dashboard/tournaments")
            }
            className="
              mt-6
              w-full
              sm:w-auto
              px-6
              py-3
              bg-purple-600
              hover:bg-purple-700
              active:scale-[0.98]
              rounded-xl
              font-bold
              transition
            "
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

  const registeredTeams =
    tournament.registeredTeams ?? 0;

  const totalSlots =
    tournament.slots ?? 0;

  const registrationProgress =
    tournament.unlimitedSlots ||
    totalSlots <= 0
      ? 0
      : Math.min(
          (registeredTeams / totalSlots) * 100,
          100
        );

  // ============================================
  // PAGE
  // ============================================

  return (
    <div className="min-h-screen bg-black text-white">

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">

        {/* BACK BUTTON */}

        <Link
          href="/dashboard/tournaments"
          className="
            inline-flex
            items-center
            gap-2
            text-zinc-400
            hover:text-purple-400
            text-sm
            sm:text-base
            transition
            mb-5
            sm:mb-6
          "
        >
          ← Back to Tournaments
        </Link>

        {/* ============================================
            HEADER
        ============================================ */}

        <div
          className="
            relative
            overflow-hidden
            rounded-2xl
            sm:rounded-3xl
            border
            border-purple-700/50
            bg-zinc-900
            p-4
            sm:p-6
            lg:p-10
          "
        >

          {/* GLOW */}

          <div
            className="
              absolute
              -top-24
              -right-24
              sm:-top-32
              sm:-right-32
              w-56
              h-56
              sm:w-80
              sm:h-80
              bg-purple-600/20
              blur-[80px]
              sm:blur-[100px]
              rounded-full
            "
          />

          <div className="relative">

            <div className="flex flex-col gap-6">

              {/* TITLE */}

              <div>

                <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">

                  {tournament.game && (
                    <span className="
                      px-2.5
                      sm:px-3
                      py-1
                      rounded-full
                      bg-purple-600/20
                      border
                      border-purple-500/30
                      text-purple-300
                      text-xs
                      sm:text-sm
                      font-bold
                    ">
                      🎮 {tournament.game}
                    </span>
                  )}

                  {tournament.status && (
                    <span className={`
                      px-2.5
                      sm:px-3
                      py-1
                      rounded-full
                      text-xs
                      sm:text-sm
                      font-bold
                      ${
                        tournament.status ===
                        "Completed"
                          ? "bg-zinc-700/40 border border-zinc-600 text-zinc-300"
                          : registrationClosed
                          ? "bg-red-600/20 border border-red-500/30 text-red-300"
                          : "bg-green-600/20 border border-green-500/30 text-green-300"
                      }
                    `}>
                      {tournament.status}
                    </span>
                  )}

                </div>

                <h1 className="
                  text-2xl
                  sm:text-3xl
                  md:text-5xl
                  font-black
                  text-white
                  break-words
                ">
                  {tournament.title ||
                    "Tournament"}
                </h1>

                <p className="
                  text-zinc-400
                  text-sm
                  sm:text-base
                  mt-2
                  sm:mt-3
                ">
                  Compete. Conquer. Champion.
                </p>

              </div>

              {/* PRIZE */}

              <div className="
                w-full
                sm:max-w-xs
                bg-black/50
                border
                border-purple-500/30
                rounded-2xl
                p-4
                sm:p-5
              ">

                <p className="
                  text-[10px]
                  sm:text-xs
                  uppercase
                  tracking-widest
                  text-zinc-500
                ">
                  Prize Pool
                </p>

                <p className="
                  text-2xl
                  sm:text-3xl
                  font-black
                  text-purple-400
                  mt-1
                ">
                  ₹
                  {Number(
                    tournament.prizePool || 0
                  ).toLocaleString("en-IN")}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ============================================
            INFORMATION GRID
        ============================================ */}

        <div className="
          grid
          grid-cols-2
          lg:grid-cols-4
          gap-3
          sm:gap-4
          mt-4
          sm:mt-6
        ">

          {/* ENTRY FEE */}

          <div className="
            bg-zinc-900
            border
            border-zinc-800
            rounded-xl
            sm:rounded-2xl
            p-3
            sm:p-5
          ">

            <p className="text-xs sm:text-sm text-zinc-500">
              Entry Fee
            </p>

            <p className="
              text-lg
              sm:text-2xl
              font-black
              mt-1
              sm:mt-2
            ">
              {isFree
                ? "FREE"
                : `₹${Number(
                    tournament.entryFee || 0
                  ).toLocaleString("en-IN")}`}
            </p>

          </div>

          {/* DATE */}

          <div className="
            bg-zinc-900
            border
            border-zinc-800
            rounded-xl
            sm:rounded-2xl
            p-3
            sm:p-5
          ">

            <p className="text-xs sm:text-sm text-zinc-500">
              Tournament Date
            </p>

            <p className="
              text-sm
              sm:text-xl
              font-bold
              mt-1
              sm:mt-2
              break-words
            ">
              {tournament.date ||
                "Coming Soon"}
            </p>

          </div>

          {/* SLOTS */}

          <div className="
            bg-zinc-900
            border
            border-zinc-800
            rounded-xl
            sm:rounded-2xl
            p-3
            sm:p-5
          ">

            <p className="text-xs sm:text-sm text-zinc-500">
              Slots
            </p>

            <p className="
              text-lg
              sm:text-xl
              font-bold
              mt-1
              sm:mt-2
            ">
              {tournament.unlimitedSlots
                ? "Unlimited"
                : tournament.slots ?? "N/A"}
            </p>

          </div>

          {/* REGISTERED */}

          <div className="
            bg-zinc-900
            border
            border-zinc-800
            rounded-xl
            sm:rounded-2xl
            p-3
            sm:p-5
          ">

            <p className="text-xs sm:text-sm text-zinc-500">
              Registered
            </p>

            <p className="
              text-lg
              sm:text-2xl
              font-black
              text-purple-400
              mt-1
              sm:mt-2
            ">

              {registeredTeams}

              {!tournament.unlimitedSlots &&
                tournament.slots && (
                  <span className="
                    text-zinc-500
                    text-sm
                    sm:text-base
                  ">
                    {" "}
                    / {tournament.slots}
                  </span>
                )}

            </p>

          </div>

        </div>

        {/* ============================================
            REGISTRATION PROGRESS
        ============================================ */}

        {!tournament.unlimitedSlots &&
          totalSlots > 0 && (
            <div className="
              mt-4
              sm:mt-6
              bg-zinc-900
              border
              border-zinc-800
              rounded-xl
              sm:rounded-2xl
              p-4
              sm:p-5
            ">

              <div className="
                flex
                items-center
                justify-between
                gap-3
                mb-2
              ">

                <span className="text-xs sm:text-sm text-zinc-400">
                  Registration Progress
                </span>

                <span className={`
                  text-xs
                  sm:text-sm
                  font-bold
                  ${
                    isFull
                      ? "text-red-400"
                      : "text-purple-400"
                  }
                `}>
                  {isFull
                    ? "FULL"
                    : `${Math.max(
                        totalSlots -
                          registeredTeams,
                        0
                      )} slots left`}
                </span>

              </div>

              <div className="
                w-full
                h-2
                sm:h-2.5
                bg-zinc-800
                rounded-full
                overflow-hidden
              ">

                <div
                  className="
                    h-full
                    bg-gradient-to-r
                    from-purple-600
                    to-fuchsia-500
                    rounded-full
                    transition-all
                  "
                  style={{
                    width: `${registrationProgress}%`,
                  }}
                />

              </div>

            </div>
          )}

        {/* ============================================
            MY REGISTRATION
        ============================================ */}

        {myRegistration && (
          <div className="
            mt-4
            sm:mt-6
            bg-zinc-900
            border
            border-purple-600/50
            rounded-xl
            sm:rounded-2xl
            p-4
            sm:p-6
          ">

            <div className="
              flex
              flex-col
              gap-5
              md:flex-row
              md:items-center
              md:justify-between
            ">

              <div className="min-w-0">

                <p className="text-xs sm:text-sm text-zinc-500">
                  Your Registration
                </p>

                <h2 className="
                  text-xl
                  sm:text-2xl
                  font-black
                  text-white
                  mt-1
                  break-words
                ">
                  {myRegistration.teamName ||
                    "Your Team"}
                </h2>

                <p className="text-sm sm:text-base text-zinc-400 mt-1 sm:mt-2">
                  Captain:{" "}
                  {myRegistration.captainName ||
                    "N/A"}
                </p>

              </div>

              <div className="
                flex
                flex-col
                items-start
                md:items-end
                gap-2
              ">

                <span
                  className={`
                    px-3
                    sm:px-4
                    py-2
                    rounded-full
                    text-xs
                    sm:text-sm
                    font-bold
                    ${
                      myRegistration.registrationStatus ===
                      "approved"
                        ? "bg-green-600"
                        : myRegistration.registrationStatus ===
                          "rejected"
                        ? "bg-red-600"
                        : "bg-yellow-500 text-black"
                    }
                  `}
                >
                  Registration:{" "}
                  {(
                    myRegistration.registrationStatus ||
                    "pending"
                  ).toUpperCase()}
                </span>

                {myRegistration.paymentStatus && (
                  <span className="text-xs sm:text-sm text-zinc-400">
                    Payment:{" "}
                    {myRegistration.paymentStatus}
                  </span>
                )}

              </div>

            </div>

          </div>
        )}

        {/* ============================================
            REGISTER ACTION
        ============================================ */}

        <div className="mt-5 sm:mt-8">

          {myRegistration ? (

            <div className="
              bg-green-600/10
              border
              border-green-600/30
              rounded-xl
              sm:rounded-2xl
              p-5
              sm:p-6
              text-center
            ">

              <div className="text-3xl">
                ✅
              </div>

              <h2 className="
                text-lg
                sm:text-xl
                font-bold
                text-green-400
                mt-2
              ">
                You are already registered
              </h2>

              <p className="
                text-xs
                sm:text-sm
                text-zinc-400
                mt-1
              ">
                Your team has already been
                registered for this tournament.
              </p>

            </div>

          ) : registrationClosed ? (

            <div className="
              bg-red-600/10
              border
              border-red-600/30
              rounded-xl
              sm:rounded-2xl
              p-5
              sm:p-6
              text-center
            ">

              <h2 className="
                text-lg
                sm:text-xl
                font-bold
                text-red-400
              ">
                Registration Closed
              </h2>

              <p className="
                text-xs
                sm:text-sm
                text-zinc-400
                mt-2
              ">
                Registration for this tournament
                is currently closed.
              </p>

            </div>

          ) : isFull ? (

            <div className="
              bg-red-600/10
              border
              border-red-600/30
              rounded-xl
              sm:rounded-2xl
              p-5
              sm:p-6
              text-center
            ">

              <h2 className="
                text-lg
                sm:text-xl
                font-bold
                text-red-400
              ">
                Tournament Full
              </h2>

              <p className="
                text-xs
                sm:text-sm
                text-zinc-400
                mt-2
              ">
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
                className="
                  w-full
                  py-3.5
                  sm:py-4
                  rounded-xl
                  sm:rounded-2xl
                  bg-gradient-to-r
                  from-purple-600
                  to-fuchsia-600
                  hover:from-purple-700
                  hover:to-fuchsia-700
                  active:scale-[0.98]
                  transition-all
                  shadow-[0_0_25px_rgba(124,58,237,0.25)]
                  hover:shadow-[0_0_40px_rgba(124,58,237,0.45)]
                  text-base
                  sm:text-lg
                  font-black
                "
              >
                🏆 Register Now
              </button>

            </Link>

          )}

        </div>

        {/* ============================================
            TOURNAMENT DETAILS
        ============================================ */}

        <div className="
          mt-5
          sm:mt-8
          bg-zinc-900
          border
          border-zinc-800
          rounded-xl
          sm:rounded-2xl
          p-4
          sm:p-6
        ">

          <h2 className="
            text-xl
            sm:text-2xl
            font-black
            text-purple-400
            mb-5
          ">
            Tournament Details
          </h2>

          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            gap-4
            sm:gap-5
          ">

            {/* GAME */}

            <div>
              <p className="text-xs sm:text-sm text-zinc-500">
                Game
              </p>

              <p className="text-sm sm:text-base font-bold mt-1">
                🎮 {tournament.game ||
                  "N/A"}
              </p>
            </div>

            {/* MODE */}

            <div>
              <p className="text-xs sm:text-sm text-zinc-500">
                Tournament Mode
              </p>

              <p className="text-sm sm:text-base font-bold mt-1">
                💰 {tournament.mode ||
                  "Paid"}
              </p>
            </div>

            {/* APPROVAL */}

            <div>
              <p className="text-xs sm:text-sm text-zinc-500">
                Approval Type
              </p>

              <p className="text-sm sm:text-base font-bold mt-1">
                ⚙️{" "}
                {tournament.approvalType ||
                  "Automatic"}
              </p>
            </div>

            {/* STATUS */}

            <div>
              <p className="text-xs sm:text-sm text-zinc-500">
                Tournament Status
              </p>

              <p className="text-sm sm:text-base font-bold mt-1">
                📢{" "}
                {tournament.status ||
                  "Registration Open"}
              </p>
            </div>

          </div>

        </div>

        {/* BOTTOM SPACING FOR MOBILE */}

        <div className="h-6 sm:h-10" />

      </div>
    </div>
  );
}