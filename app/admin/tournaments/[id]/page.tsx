"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

interface Tournament {
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

interface Team {
  id: string;
  teamName?: string;

  captainName?: string;
  captainEmail?: string;
  captainPhone?: string;
  captainUID?: string;

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

export default function ManageTournamentPage() {
  const params = useParams();

  const tournamentId = params.id as string;

  const [tournament, setTournament] =
    useState<Tournament | null>(null);

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  // =====================================================
  // FETCH TOURNAMENT + REGISTRATIONS
  // =====================================================

  const fetchData = async () => {
    try {
      setLoading(true);

      // Tournament
      const tournamentRef = doc(
        db,
        "tournaments",
        tournamentId
      );

      const tournamentSnap =
        await getDoc(tournamentRef);

      if (!tournamentSnap.exists()) {
        toast.error("Tournament not found");
        return;
      }

      setTournament({
        ...tournamentSnap.data(),
      } as Tournament);

      // Registrations
      const registrationQuery = query(
        collection(db, "registrations"),
        where(
          "tournamentId",
          "==",
          tournamentId
        )
      );

      const snapshot =
        await getDocs(registrationQuery);

      const registrations = snapshot.docs.map(
        (registrationDoc) => ({
          id: registrationDoc.id,
          ...registrationDoc.data(),
        })
      ) as Team[];

      setTeams(registrations);
    } catch (error) {
      console.error(error);
      toast.error(
        "Failed to load tournament"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tournamentId) {
      fetchData();
    }
  }, [tournamentId]);

  // =====================================================
  // STATUS UPDATE
  // =====================================================

  const updateRegistrationStatus = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      setUpdatingId(id);

      await updateDoc(
        doc(db, "registrations", id),
        {
          registrationStatus: status,
        }
      );

      toast.success(
        status === "approved"
          ? "Team Approved ✅"
          : "Team Rejected ❌"
      );

      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error(
        "Failed to update status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
  // DELETE REGISTRATION
  // =====================================================

  const deleteRegistration = async (
    team: Team
  ) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${team.teamName || "this registration"}"?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setUpdatingId(team.id);

      await deleteDoc(
        doc(db, "registrations", team.id)
      );

      /*
       * Recalculate registeredTeams from the
       * remaining registrations instead of blindly
       * decrementing the old value.
       */

      const remainingQuery = query(
        collection(db, "registrations"),
        where(
          "tournamentId",
          "==",
          tournamentId
        )
      );

      const remainingSnapshot =
        await getDocs(remainingQuery);

      await updateDoc(
        doc(db, "tournaments", tournamentId),
        {
          registeredTeams:
            remainingSnapshot.size,
        }
      );

      toast.success(
        "Registration deleted successfully"
      );

      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalTeams = teams.length;

  const approvedTeams = teams.filter(
    (team) =>
      (team.registrationStatus ||
        "pending") === "approved"
  ).length;

  const pendingTeams = teams.filter(
    (team) =>
      (team.registrationStatus ||
        "pending") === "pending"
  ).length;

  const rejectedTeams = teams.filter(
    (team) =>
      team.registrationStatus ===
      "rejected"
  ).length;

  const paidTeams = teams.filter(
    (team) =>
      team.paymentStatus === "paid"
  ).length;

  const freeTeams = teams.filter(
    (team) =>
      team.paymentStatus === "free"
  ).length;

  const slotsRemaining =
    tournament?.unlimitedSlots
      ? "∞"
      : Math.max(
          Number(tournament?.slots || 0) -
            totalTeams,
          0
        );

  // =====================================================
  // FILTERED TEAMS
  // =====================================================

  const filteredTeams = teams.filter(
    (team) => {
      const registrationStatus =
        team.registrationStatus ||
        "pending";

      const paymentStatus =
        team.paymentStatus ||
        (tournament?.mode === "Free"
          ? "free"
          : "pending");

      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        team.teamName
          ?.toLowerCase()
          .includes(searchText) ||
        team.captainName
          ?.toLowerCase()
          .includes(searchText) ||
        team.captainEmail
          ?.toLowerCase()
          .includes(searchText) ||
        team.captainUID
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "all" ||
        registrationStatus ===
          statusFilter;

      const matchesPayment =
        paymentFilter === "all" ||
        paymentStatus ===
          paymentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment
      );
    }
  );

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />

          <p className="text-purple-400 text-xl mt-5">
            Loading tournament...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-black text-white pb-16">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-8">

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">

          <div>

            <div className="flex items-center gap-3 mb-3">

              <span className="px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-bold">
                TOURNAMENT MANAGEMENT
              </span>

              {tournament?.status && (
                <span className="px-3 py-1 rounded-full bg-green-600/15 border border-green-500/30 text-green-400 text-xs font-bold">
                  {tournament.status}
                </span>
              )}

            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white">
              {tournament?.title ||
                "Tournament"}
            </h1>

            <p className="text-zinc-500 mt-2">
              Manage registrations,
              teams and payments.
            </p>

          </div>

          <div className="text-left lg:text-right">

            <p className="text-xs uppercase tracking-widest text-zinc-500">
              Tournament ID
            </p>

            <p className="text-sm text-zinc-400 break-all mt-1">
              {tournamentId}
            </p>

          </div>

        </div>

      </div>

      {/* =================================================
          TOURNAMENT INFO
      ================================================= */}

      <div className="bg-zinc-900/80 border border-white/10 rounded-3xl p-6 mb-8">

        <div className="flex items-center justify-between mb-6">

          <div>
            <h2 className="text-xl font-bold text-white">
              Tournament Information
            </h2>

            <p className="text-sm text-zinc-500 mt-1">
              Current tournament configuration
            </p>
          </div>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">

          <div>
            <p className="text-xs text-zinc-500 uppercase">
              Game
            </p>

            <p className="font-bold mt-1">
              {tournament?.game ||
                "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-zinc-500 uppercase">
              Prize Pool
            </p>

            <p className="font-bold mt-1 text-purple-400">
              ₹{tournament?.prizePool ||
                0}
            </p>
          </div>

          <div>
            <p className="text-xs text-zinc-500 uppercase">
              Entry Fee
            </p>

            <p className="font-bold mt-1">
              ₹{tournament?.entryFee ||
                0}
            </p>
          </div>

          <div>
            <p className="text-xs text-zinc-500 uppercase">
              Mode
            </p>

            <p className="font-bold mt-1">
              {tournament?.mode ||
                "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-zinc-500 uppercase">
              Approval
            </p>

            <p className="font-bold mt-1">
              {tournament?.approvalType ||
                "Automatic"}
            </p>
          </div>

          <div>
            <p className="text-xs text-zinc-500 uppercase">
              Slots
            </p>

            <p className="font-bold mt-1">
              {tournament?.unlimitedSlots
                ? "Unlimited"
                : tournament?.slots ??
                  0}
            </p>
          </div>

        </div>

      </div>

      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">

        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5">
          <p className="text-xs font-bold text-zinc-500">
            TOTAL
          </p>

          <p className="text-3xl font-black text-white mt-2">
            {totalTeams}
          </p>
        </div>

        <div className="bg-zinc-900 border border-green-500/20 rounded-2xl p-5">
          <p className="text-xs font-bold text-green-400">
            APPROVED
          </p>

          <p className="text-3xl font-black text-white mt-2">
            {approvedTeams}
          </p>
        </div>

        <div className="bg-zinc-900 border border-yellow-500/20 rounded-2xl p-5">
          <p className="text-xs font-bold text-yellow-400">
            PENDING
          </p>

          <p className="text-3xl font-black text-white mt-2">
            {pendingTeams}
          </p>
        </div>

        <div className="bg-zinc-900 border border-red-500/20 rounded-2xl p-5">
          <p className="text-xs font-bold text-red-400">
            REJECTED
          </p>

          <p className="text-3xl font-black text-white mt-2">
            {rejectedTeams}
          </p>
        </div>

        <div className="bg-zinc-900 border border-purple-500/20 rounded-2xl p-5">
          <p className="text-xs font-bold text-purple-400">
            PAID
          </p>

          <p className="text-3xl font-black text-white mt-2">
            {paidTeams}
          </p>
        </div>

        <div className="bg-zinc-900 border border-blue-500/20 rounded-2xl p-5">
          <p className="text-xs font-bold text-blue-400">
            SLOTS LEFT
          </p>

          <p className="text-3xl font-black text-white mt-2">
            {slotsRemaining}
          </p>
        </div>

      </div>

      {/* =================================================
          REGISTRATION MANAGEMENT
      ================================================= */}

      <div className="bg-zinc-900/60 border border-white/10 rounded-3xl p-6">

        {/* HEADER */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-6">

          <div>

            <h2 className="text-2xl font-black text-white">
              Registered Teams
            </h2>

            <p className="text-sm text-zinc-500 mt-1">
              Showing{" "}
              <span className="text-white font-bold">
                {filteredTeams.length}
              </span>{" "}
              of{" "}
              <span className="text-white font-bold">
                {teams.length}
              </span>{" "}
              registrations
            </p>

          </div>

          <div className="text-sm text-zinc-400">
            Free Teams:{" "}
            <span className="text-green-400 font-bold">
              {freeTeams}
            </span>
          </div>

        </div>

        {/* SEARCH + FILTERS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search team, captain, email or UID..."
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500"
          >
            <option value="all">
              All Registration Status
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="approved">
              Approved
            </option>

            <option value="rejected">
              Rejected
            </option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) =>
              setPaymentFilter(
                e.target.value
              )
            }
            className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500"
          >
            <option value="all">
              All Payment Status
            </option>

            <option value="paid">
              Paid
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="free">
              Free
            </option>
          </select>

        </div>

        {/* TEAM LIST */}

        <div className="space-y-5">

          {filteredTeams.length === 0 ? (

            <div className="bg-black/30 border border-white/10 rounded-2xl p-10 text-center">

              <div className="text-4xl mb-3">
                🔍
              </div>

              <p className="text-zinc-400">
                No registrations match
                your search or filters.
              </p>

            </div>

          ) : (

            filteredTeams.map((team) => {

              const registrationStatus =
                team.registrationStatus ||
                "pending";

              const paymentStatus =
                team.paymentStatus ||
                (tournament?.mode ===
                "Free"
                  ? "free"
                  : "pending");

              const isUpdating =
                updatingId === team.id;

              return (

                <div
                  key={team.id}
                  className="bg-black/40 border border-white/10 hover:border-purple-500/40 rounded-2xl p-5 md:p-6 transition"
                >

                  {/* TEAM HEADER */}

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    <div>

                      <p className="text-xs text-zinc-500 uppercase tracking-widest">
                        Team
                      </p>

                      <h3 className="text-2xl font-black text-purple-400 mt-1">
                        {team.teamName ||
                          "Unnamed Team"}
                      </h3>

                    </div>

                    <div className="flex gap-2 flex-wrap">

                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                          registrationStatus ===
                          "approved"
                            ? "bg-green-600/20 text-green-400 border border-green-500/20"
                            : registrationStatus ===
                              "rejected"
                            ? "bg-red-600/20 text-red-400 border border-red-500/20"
                            : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20"
                        }`}
                      >
                        REGISTRATION:{" "}
                        {registrationStatus.toUpperCase()}
                      </span>

                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                          paymentStatus ===
                            "paid" ||
                          paymentStatus ===
                            "free"
                            ? "bg-green-600/20 text-green-400 border border-green-500/20"
                            : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20"
                        }`}
                      >
                        PAYMENT:{" "}
                        {paymentStatus.toUpperCase()}
                      </span>

                    </div>

                  </div>

                  {/* CAPTAIN */}

                  <div className="mt-6 grid md:grid-cols-3 gap-4">

                    <div className="bg-zinc-900/70 rounded-xl p-4">
                      <p className="text-xs text-zinc-500">
                        CAPTAIN
                      </p>

                      <p className="font-bold mt-1">
                        {team.captainName ||
                          "—"}
                      </p>
                    </div>

                    <div className="bg-zinc-900/70 rounded-xl p-4">
                      <p className="text-xs text-zinc-500">
                        EMAIL
                      </p>

                      <p className="font-bold mt-1 break-all">
                        {team.captainEmail ||
                          "—"}
                      </p>
                    </div>

                    <div className="bg-zinc-900/70 rounded-xl p-4">
                      <p className="text-xs text-zinc-500">
                        PHONE
                      </p>

                      <p className="font-bold mt-1">
                        {team.captainPhone ||
                          "—"}
                      </p>
                    </div>

                  </div>

                  {/* PLAYERS */}

                  <div className="mt-6">

                    <h4 className="text-lg font-bold text-purple-300 mb-3">
                      Players
                    </h4>

                    <div className="grid md:grid-cols-2 gap-2">

                      <PlayerRow
                        number="1"
                        name={
                          team.captainName
                        }
                        uid={
                          team.captainUID
                        }
                      />

                      <PlayerRow
                        number="2"
                        name={
                          team.player2Name
                        }
                        uid={
                          team.player2UID
                        }
                      />

                      <PlayerRow
                        number="3"
                        name={
                          team.player3Name
                        }
                        uid={
                          team.player3UID
                        }
                      />

                      <PlayerRow
                        number="4"
                        name={
                          team.player4Name
                        }
                        uid={
                          team.player4UID
                        }
                      />

                      {team.player5Name && (
                        <PlayerRow
                          number="5"
                          name={
                            team.player5Name
                          }
                          uid={
                            team.player5UID
                          }
                        />
                      )}

                    </div>

                  </div>

                  {/* SUBSTITUTE */}

                  {team.substituteName && (
                    <div className="mt-5">

                      <h4 className="text-sm font-bold text-zinc-400 uppercase mb-2">
                        Substitute
                      </h4>

                      <PlayerRow
                        number="S"
                        name={
                          team.substituteName
                        }
                        uid={
                          team.substituteUID
                        }
                      />

                    </div>
                  )}

                  {/* PAYMENT */}

                  <div className="mt-6 bg-zinc-900/70 border border-white/5 rounded-xl p-5">

                    <h4 className="text-sm font-bold text-purple-300 uppercase tracking-wider mb-3">
                      Payment Information
                    </h4>

                    <div className="grid md:grid-cols-3 gap-4 text-sm">

                      <div>
                        <p className="text-zinc-500">
                          STATUS
                        </p>

                        <p className="font-bold mt-1">
                          {paymentStatus}
                        </p>
                      </div>

                      <div>
                        <p className="text-zinc-500">
                          PAYMENT ID
                        </p>

                        <p className="font-bold mt-1 break-all">
                          {team.paymentId ||
                            "Not available"}
                        </p>
                      </div>

                      <div>
                        <p className="text-zinc-500">
                          ORDER ID
                        </p>

                        <p className="font-bold mt-1 break-all">
                          {team.orderId ||
                            "Not available"}
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-3 mt-6 flex-wrap">

                    {registrationStatus !==
                      "approved" && (
                      <button
                        disabled={
                          isUpdating
                        }
                        onClick={() =>
                          updateRegistrationStatus(
                            team.id,
                            "approved"
                          )
                        }
                        className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-5 py-2.5 rounded-xl font-bold transition"
                      >
                        {isUpdating
                          ? "Updating..."
                          : "✅ Approve"}
                      </button>
                    )}

                    {registrationStatus !==
                      "rejected" && (
                      <button
                        disabled={
                          isUpdating
                        }
                        onClick={() =>
                          updateRegistrationStatus(
                            team.id,
                            "rejected"
                          )
                        }
                        className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 px-5 py-2.5 rounded-xl font-bold transition"
                      >
                        {isUpdating
                          ? "Updating..."
                          : "❌ Reject"}
                      </button>
                    )}

                    <button
                      disabled={isUpdating}
                      onClick={() =>
                        deleteRegistration(
                          team
                        )
                      }
                      className="bg-red-600 hover:bg-red-700 disabled:opacity-50 px-5 py-2.5 rounded-xl font-bold transition"
                    >
                      {isUpdating
                        ? "Deleting..."
                        : "🗑 Delete"}
                    </button>

                  </div>

                </div>
              );
            })
          )}

        </div>

      </div>

    </div>
  );
}

// =====================================================
// PLAYER ROW
// =====================================================

function PlayerRow({
  number,
  name,
  uid,
}: {
  number: string;
  name?: string;
  uid?: string;
}) {
  if (!name && !uid) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-4 bg-zinc-900/60 border border-white/5 rounded-xl px-4 py-3">

      <div className="flex items-center gap-3 min-w-0">

        <span className="w-8 h-8 shrink-0 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold">
          {number}
        </span>

        <div className="min-w-0">

          <p className="font-semibold truncate">
            {name || "Unknown Player"}
          </p>

          <p className="text-xs text-zinc-500 truncate">
            UID: {uid || "—"}
          </p>

        </div>

      </div>

    </div>
  );
}