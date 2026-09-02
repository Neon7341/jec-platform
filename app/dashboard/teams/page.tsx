"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";

interface Team {
  id: string;
  teamName?: string;
  captainName?: string;
  captainEmail?: string;

  // Game UID — BGMI / Valorant / Free Fire
  captainUID?: string;

  // Firebase Authentication UID
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

  tournamentId?: string;
  registrationStatus?: string;
  paymentStatus?: string;
}

interface Tournament {
  title?: string;
  tournamentName?: string;
  game?: string;
}

export default function MyTeamPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [tournaments, setTournaments] = useState<
    Record<string, Tournament>
  >({});
  const [loading, setLoading] = useState(true);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [viewingTeam, setViewingTeam] = useState<Team | null>(null);

const [editForm, setEditForm] = useState({
  teamName: "",
  captainName: "",
  captainUID: "",
  player2Name: "",
  player2UID: "",
  player3Name: "",
  player3UID: "",
  player4Name: "",
  player4UID: "",
  player5Name: "",
  player5UID: "",
  substituteName: "",
  substituteUID: "",
});

const [saving, setSaving] = useState(false);
const [deletingTeam, setDeletingTeam] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (!user) {
          setLoading(false);
          return;
        }

        try {
          // Get registrations belonging to the logged-in Firebase user
const registrationsQuery = query(
  collection(db, "registrations"),
  where("captainAuthUID", "==", user.uid)
);

const snapshot = await getDocs(registrationsQuery);

          const teamData: Team[] = snapshot.docs.map(
            (docSnap) => ({
              id: docSnap.id,
              ...docSnap.data(),
            })
          );

          setTeams(teamData);

          // Get tournament information
          const tournamentMap: Record<
            string,
            Tournament
          > = {};

          await Promise.all(
            teamData.map(async (team) => {
              if (!team.tournamentId) return;

              try {
                const tournamentRef = doc(
                  db,
                  "tournaments",
                  team.tournamentId
                );

                const tournamentSnap =
                  await getDoc(tournamentRef);

                if (tournamentSnap.exists()) {
                  tournamentMap[team.tournamentId] =
                    tournamentSnap.data() as Tournament;
                }
              } catch (error) {
                console.error(
                  "Tournament loading error:",
                  error
                );
              }
            })
          );

          setTournaments(tournamentMap);
        } catch (error) {
          console.error(
            "Failed to load team:",
            error
          );
        } finally {
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const openEditTeam = (team: Team) => {
  setEditingTeam(team);

  setEditForm({
    teamName: team.teamName || "",
    captainName: team.captainName || "",
    captainUID: team.captainUID || "",
    player2Name: team.player2Name || "",
    player2UID: team.player2UID || "",
    player3Name: team.player3Name || "",
    player3UID: team.player3UID || "",
    player4Name: team.player4Name || "",
    player4UID: team.player4UID || "",
    player5Name: team.player5Name || "",
    player5UID: team.player5UID || "",
    substituteName: team.substituteName || "",
    substituteUID: team.substituteUID || "",
  });
};

const closeEditTeam = () => {
  setEditingTeam(null);
};

const deleteTeam = async (teamId: string) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete/leave this team? This action cannot be undone."
  );

  if (!confirmed) return;

  try {
    setDeletingTeam(teamId);

    const teamRef = doc(db, "registrations", teamId);

    await updateDoc(teamRef, {
      registrationStatus: "cancelled",
    });

    setTeams((previousTeams) =>
      previousTeams.filter((team) => team.id !== teamId)
    );

    alert("Team deleted successfully!");
  } catch (error) {
    console.error("Failed to delete team:", error);
    alert("Failed to delete team. Please try again.");
  } finally {
    setDeletingTeam(null);
  }
};

const closeViewTeam = () => {
  setViewingTeam(null);
};

const saveTeamChanges = async () => {
  if (!editingTeam) return;

  try {
    setSaving(true);

    const teamRef = doc(
      db,
      "registrations",
      editingTeam.id
    );

    await updateDoc(teamRef, {
      teamName: editForm.teamName.trim(),
      captainName: editForm.captainName.trim(),
      captainUID: editForm.captainUID.trim(),

      player2Name: editForm.player2Name.trim(),
      player2UID: editForm.player2UID.trim(),

      player3Name: editForm.player3Name.trim(),
      player3UID: editForm.player3UID.trim(),

      player4Name: editForm.player4Name.trim(),
      player4UID: editForm.player4UID.trim(),

      player5Name: editForm.player5Name.trim(),
      player5UID: editForm.player5UID.trim(),

      substituteName: editForm.substituteName.trim(),
      substituteUID: editForm.substituteUID.trim(),
    });

    setTeams((previousTeams) =>
      previousTeams.map((team) =>
        team.id === editingTeam.id
          ? {
              ...team,
              ...editForm,
            }
          : team
      )
    );

    setEditingTeam(null);

    alert("Team updated successfully!");
  } catch (error) {
    console.error("Failed to update team:", error);
    alert("Failed to update team. Please try again.");
  } finally {
    setSaving(false);
  }
};

  const getPlayers = (team: Team) => {
    return [
      {
        name: team.captainName,
        uid: team.captainUID,
        role: "Captain",
      },
      {
        name: team.player2Name,
        uid: team.player2UID,
        role: "Player 2",
      },
      {
        name: team.player3Name,
        uid: team.player3UID,
        role: "Player 3",
      },
      {
        name: team.player4Name,
        uid: team.player4UID,
        role: "Player 4",
      },
      {
        name: team.player5Name,
        uid: team.player5UID,
        role: "Player 5",
      },
    ].filter(
      (player) => player.name || player.uid
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-purple-400 text-xl">
          Loading your team...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">

      {/* HEADER */}

      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl md:text-5xl font-bold text-purple-500">
          👥 My Team
        </h1>

        <p className="text-zinc-400 mt-3">
          Manage and view your registered tournament teams.
        </p>

        {/* NO TEAM */}

        {teams.length === 0 ? (
          <div className="mt-10 bg-zinc-900 border border-purple-700 rounded-2xl p-10 text-center">

            <div className="text-6xl mb-5">
              👥
            </div>

            <h2 className="text-2xl font-bold">
              No Team Found
            </h2>

            <p className="text-zinc-400 mt-3">
              You have not registered a team yet.
            </p>

          </div>
        ) : (

          /* TEAM LIST */

          <div className="mt-10 space-y-8">

            {teams.map((team) => {

              const tournament =
                team.tournamentId
                  ? tournaments[team.tournamentId]
                  : undefined;

              const players = getPlayers(team);

              return (
                <div
                  key={team.id}
                  className="bg-zinc-900 border border-purple-700 rounded-2xl overflow-hidden"
                >

                  {/* TEAM HEADER */}

                  <div className="p-6 border-b border-zinc-800">

                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-5">

                      <div>

                        <p className="text-purple-400 text-sm font-semibold">
                          TEAM
                        </p>

                        <h2 className="text-3xl font-bold mt-1">
                          {team.teamName ||
                            "Unknown Team"}
                        </h2>

                        {/* TOURNAMENT */}

                        <p className="text-zinc-300 mt-3">
                          🏆{" "}
                          {tournament?.title ||
                            tournament?.tournamentName ||
                            "Unknown Tournament"}
                        </p>

                        {/* GAME */}

                        <p className="text-zinc-400 mt-1">
                          🎮{" "}
                          {tournament?.game ||
                            "Game not specified"}
                        </p>

                      </div>

                      {/* EDIT BUTTON */}

<div className="flex gap-3 flex-wrap">

  <button
    onClick={() => setViewingTeam(team)}
    className="px-5 py-2 rounded-xl bg-zinc-700 hover:bg-zinc-600 font-bold transition"
  >
    👁️ View Team
  </button>

  <button
    onClick={() => openEditTeam(team)}
    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 font-bold transition"
  >
    ✏️ Edit Team
  </button>

  <button
  onClick={() => deleteTeam(team.id)}
  disabled={deletingTeam === team.id}
  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 font-bold transition"
>
  {deletingTeam === team.id
    ? "Deleting..."
    : "🗑️ Delete Team"}
</button>

</div>

                      {/* STATUS */}

                      <div className="flex flex-col gap-3">

                        <span
                          className={`px-4 py-2 rounded-full text-sm font-bold text-center ${
                            team.registrationStatus ===
                            "approved"
                              ? "bg-green-600"
                              : team.registrationStatus ===
                                "pending"
                              ? "bg-yellow-500 text-black"
                              : "bg-zinc-700"
                          }`}
                        >
                          Registration:{" "}
                          {team.registrationStatus ||
                            "Unknown"}
                        </span>

                        {team.paymentStatus && (
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-bold text-center ${
                              team.paymentStatus ===
                              "paid"
                                ? "bg-green-600"
                                : team.paymentStatus ===
                                  "pending"
                                ? "bg-yellow-500 text-black"
                                : "bg-red-600"
                            }`}
                          >
                            Payment:{" "}
                            {team.paymentStatus}
                          </span>
                        )}

                      </div>

                    </div>

                  </div>

                  {/* PLAYERS */}

                  <div className="p-6">

                    <h3 className="text-2xl font-bold text-purple-400 mb-5">
                      Team Players
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                      {players.map(
                        (player, index) => (
                          <div
                            key={index}
                            className="bg-zinc-800 border border-zinc-700 rounded-xl p-5"
                          >

                            <div className="flex items-center gap-4">

                              <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-xl font-bold">
                                {player.name
                                  ? player.name
                                      .charAt(0)
                                      .toUpperCase()
                                  : "P"}
                              </div>

                              <div>

                                <h4 className="text-lg font-bold">
                                  {player.name ||
                                    "Unknown Player"}
                                </h4>

                                <p className="text-purple-400 text-sm">
                                  {player.role}
                                </p>

                              </div>

                            </div>

                            <div className="mt-4">

                              <p className="text-zinc-500 text-xs">
                                Player UID
                              </p>

                              <p className="text-zinc-300 break-all mt-1">
                                {player.uid ||
                                  "Not provided"}
                              </p>

                            </div>

                          </div>
                        )
                      )}

                    </div>

                  </div>

                  {/* REGISTRATION INFORMATION */}

                  <div className="px-6 pb-6">

                    <div className="border-t border-zinc-800 pt-6">

                      <h3 className="text-xl font-bold text-purple-400 mb-5">
                        Team Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <div className="bg-zinc-800 rounded-xl p-4">
                          <p className="text-zinc-500 text-sm">
                            Captain
                          </p>

                          <p className="font-semibold mt-1">
                            {team.captainName ||
                              "Unknown"}
                          </p>
                        </div>

                        <div className="bg-zinc-800 rounded-xl p-4">
                          <p className="text-zinc-500 text-sm">
                            Captain Email
                          </p>

                          <p className="font-semibold mt-1 break-all">
                            {team.captainEmail ||
                              "No Email"}
                          </p>
                        </div>

                        <div className="bg-zinc-800 rounded-xl p-4">
                          <p className="text-zinc-500 text-sm">
                            Registration ID
                          </p>

                          <p className="font-semibold mt-1 break-all">
                            {team.id}
                          </p>
                        </div>

                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

        {editingTeam && (
  <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">

    <div className="bg-zinc-900 border border-purple-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

      {/* MODAL HEADER */}

      <div className="p-6 border-b border-zinc-800 flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold text-purple-400">
            ✏️ Edit Team
          </h2>

          <p className="text-zinc-400 text-sm mt-1">
            Update your team and player details
          </p>
        </div>

        <button
          onClick={closeEditTeam}
          className="text-zinc-400 hover:text-white text-2xl"
        >
          ✕
        </button>

      </div>

      {/* FORM */}

      <div className="p-6 space-y-6">

        {/* TEAM NAME */}

        <div>
          <label className="block text-sm text-zinc-400 mb-2">
            Team Name
          </label>

          <input
            value={editForm.teamName}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                teamName: e.target.value,
              })
            }
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white"
          />
        </div>

        {/* CAPTAIN */}

        <div>
          <h3 className="text-lg font-bold text-purple-400 mb-3">
            Captain
          </h3>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              placeholder="Captain Name"
              value={editForm.captainName}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  captainName: e.target.value,
                })
              }
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-3"
            />

            <input
              placeholder="Captain Game UID"
              value={editForm.captainUID}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  captainUID: e.target.value,
                })
              }
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-3"
            />

          </div>
        </div>

        {/* PLAYER 2 */}

        <div>
          <h3 className="text-lg font-bold text-purple-400 mb-3">
            Player 2
          </h3>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              placeholder="Player 2 Name"
              value={editForm.player2Name}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  player2Name: e.target.value,
                })
              }
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-3"
            />

            <input
              placeholder="Player 2 UID"
              value={editForm.player2UID}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  player2UID: e.target.value,
                })
              }
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-3"
            />

          </div>
        </div>

        {/* PLAYER 3 */}

        <div>
          <h3 className="text-lg font-bold text-purple-400 mb-3">
            Player 3
          </h3>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              placeholder="Player 3 Name"
              value={editForm.player3Name}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  player3Name: e.target.value,
                })
              }
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-3"
            />

            <input
              placeholder="Player 3 UID"
              value={editForm.player3UID}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  player3UID: e.target.value,
                })
              }
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-3"
            />

          </div>
        </div>

        {/* PLAYER 4 */}

        <div>
          <h3 className="text-lg font-bold text-purple-400 mb-3">
            Player 4
          </h3>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              placeholder="Player 4 Name"
              value={editForm.player4Name}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  player4Name: e.target.value,
                })
              }
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-3"
            />

            <input
              placeholder="Player 4 UID"
              value={editForm.player4UID}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  player4UID: e.target.value,
                })
              }
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-3"
            />

          </div>
        </div>

        {/* PLAYER 5 */}

        <div>
          <h3 className="text-lg font-bold text-purple-400 mb-3">
            Player 5
          </h3>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              placeholder="Player 5 Name"
              value={editForm.player5Name}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  player5Name: e.target.value,
                })
              }
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-3"
            />

            <input
              placeholder="Player 5 UID"
              value={editForm.player5UID}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  player5UID: e.target.value,
                })
              }
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-3"
            />

          </div>
        </div>

        {/* SUBSTITUTE */}

        <div>
          <h3 className="text-lg font-bold text-purple-400 mb-3">
            Substitute
          </h3>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              placeholder="Substitute Name"
              value={editForm.substituteName}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  substituteName: e.target.value,
                })
              }
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-3"
            />

            <input
              placeholder="Substitute UID"
              value={editForm.substituteUID}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  substituteUID: e.target.value,
                })
              }
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-3"
            />

          </div>
        </div>

      </div>

      {/* MODAL FOOTER */}

      <div className="p-6 border-t border-zinc-800 flex gap-3 justify-end">

        <button
          onClick={closeEditTeam}
          disabled={saving}
          className="px-5 py-3 rounded-xl bg-zinc-700 hover:bg-zinc-600 font-bold"
        >
          Cancel
        </button>

        <button
          onClick={saveTeamChanges}
          disabled={saving}
          className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 font-bold"
        >
          {saving ? "Saving..." : "💾 Save Changes"}
        </button>

      </div>

    </div>

  </div>
)} 

{viewingTeam && (
  <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">

    <div className="bg-zinc-900 border border-purple-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

      {/* HEADER */}

      <div className="p-6 border-b border-zinc-800 flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold text-purple-400">
            👁️ Team Details
          </h2>

          <p className="text-zinc-400 text-sm mt-1">
            View your registered team information
          </p>
        </div>

        <button
          onClick={closeViewTeam}
          className="text-zinc-400 hover:text-white text-2xl"
        >
          ✕
        </button>

      </div>

      {/* TEAM INFORMATION */}

      <div className="p-6 space-y-6">

        {/* TEAM NAME */}

        <div className="bg-zinc-800 rounded-xl p-5">

          <p className="text-purple-400 text-sm font-semibold">
            TEAM NAME
          </p>

          <h3 className="text-2xl font-bold mt-1">
            {viewingTeam.teamName || "Unknown Team"}
          </h3>

        </div>

        {/* TOURNAMENT */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="bg-zinc-800 rounded-xl p-4">

            <p className="text-zinc-500 text-sm">
              Tournament
            </p>

            <p className="font-semibold mt-1">
              {viewingTeam.tournamentId
                ? tournaments[viewingTeam.tournamentId]?.title ||
                  tournaments[viewingTeam.tournamentId]?.tournamentName ||
                  "Unknown Tournament"
                : "Unknown Tournament"}
            </p>

          </div>

          <div className="bg-zinc-800 rounded-xl p-4">

            <p className="text-zinc-500 text-sm">
              Game
            </p>

            <p className="font-semibold mt-1">
              {viewingTeam.tournamentId
                ? tournaments[viewingTeam.tournamentId]?.game ||
                  "Game not specified"
                : "Game not specified"}
            </p>

          </div>

        </div>

        {/* PLAYERS */}

        <div>

          <h3 className="text-xl font-bold text-purple-400 mb-4">
            👥 Team Players
          </h3>

          <div className="space-y-3">

            {getPlayers(viewingTeam).map(
              (player, index) => (

                <div
                  key={index}
                  className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >

                  <div>

                    <p className="font-bold text-lg">
                      {player.name || "Unknown Player"}
                    </p>

                    <p className="text-purple-400 text-sm">
                      {player.role}
                    </p>

                  </div>

                  <div className="md:text-right">

                    <p className="text-zinc-500 text-xs">
                      Game UID
                    </p>

                    <p className="text-zinc-300 break-all">
                      {player.uid || "Not provided"}
                    </p>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

        {/* SUBSTITUTE */}

        {(viewingTeam.substituteName ||
          viewingTeam.substituteUID) && (

          <div className="bg-zinc-800 rounded-xl p-4">

            <p className="text-purple-400 text-sm font-semibold">
              SUBSTITUTE
            </p>

            <p className="font-bold mt-1">
              {viewingTeam.substituteName || "Unknown"}
            </p>

            <p className="text-zinc-400 text-sm mt-1 break-all">
              UID: {viewingTeam.substituteUID || "Not provided"}
            </p>

          </div>

        )}

        {/* STATUS */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="bg-zinc-800 rounded-xl p-4">

            <p className="text-zinc-500 text-sm">
              Registration Status
            </p>

            <p className="font-bold text-green-400 mt-1">
              {viewingTeam.registrationStatus || "Unknown"}
            </p>

          </div>

          <div className="bg-zinc-800 rounded-xl p-4">

            <p className="text-zinc-500 text-sm">
              Payment Status
            </p>

            <p className="font-bold mt-1">
              {viewingTeam.paymentStatus || "Free"}
            </p>

          </div>

        </div>

        {/* REGISTRATION ID */}

        <div className="bg-zinc-800 rounded-xl p-4">

          <p className="text-zinc-500 text-sm">
            Registration ID
          </p>

          <p className="font-semibold mt-1 break-all">
            {viewingTeam.id}
          </p>

        </div>

      </div>

      {/* FOOTER */}

      <div className="p-6 border-t border-zinc-800 flex justify-end">

        <button
          onClick={closeViewTeam}
          className="px-6 py-3 rounded-xl bg-zinc-700 hover:bg-zinc-600 font-bold"
        >
          Close
        </button>

      </div>

    </div>

  </div>
)}

      </div>

    </div>
  );
}