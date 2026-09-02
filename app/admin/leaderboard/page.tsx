"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

interface Tournament {
  id: string;
  title?: string;
  game?: string;
}

interface Team {
  registrationId: string;
  teamName: string;
  placement: number;
  kills: number;
  placementPoints: number;
  killPoints: number;
  totalPoints: number;
}

interface SavedMatch {
  matchNumber: number;
  results: Team[];
}

const getPlacementPoints = (placement: number) => {
  if (placement === 1) return 10;
  if (placement === 2) return 6;
  if (placement === 3) return 5;
  if (placement === 4) return 4;
  if (placement === 5) return 3;
  if (placement === 6) return 2;
  if (placement === 7 || placement === 8) return 1;

  return 0;
};

export default function LeaderboardPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>(
    []
  );

  const [selectedTournament, setSelectedTournament] =
    useState("");

  const [matchNumber, setMatchNumber] = useState(1);

  const [teams, setTeams] = useState<Team[]>([]);

  const [savedMatches, setSavedMatches] = useState<SavedMatch[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [saving, setSaving] = useState(false);

  /*
   * LOAD TOURNAMENTS
   */

  useEffect(() => {
    const loadTournaments = async () => {
      try {
        const snapshot = await getDocs(
          collection(db, "tournaments")
        );

        const data: Tournament[] = snapshot.docs.map(
          (docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          })
        );

        setTournaments(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load tournaments");
      } finally {
        setLoading(false);
      }
    };

    loadTournaments();
  }, []);

  /*
   * LOAD REGISTERED TEAMS
   */

  useEffect(() => {
    if (!selectedTournament) {
      setTeams([]);
      setSavedMatches([]);
      return;
    }

    const loadTeams = async () => {
      try {
        setLoadingTeams(true);

        const registrationsSnapshot = await getDocs(
          collection(db, "registrations")
        );

        const registeredTeams: Team[] =
          registrationsSnapshot.docs
            .filter((docSnap) => {
              const data = docSnap.data();

              return (
                data.tournamentId ===
                  selectedTournament &&
                data.registrationStatus === "approved"
              );
            })
            .map((docSnap) => {
              const data = docSnap.data();

              return {
                registrationId: docSnap.id,
                teamName:
                  data.teamName || "Unknown Team",
                placement: 0,
                kills: 0,
                placementPoints: 0,
                killPoints: 0,
                totalPoints: 0,
              };
            });

        setTeams(registeredTeams);

        /*
         * LOAD EXISTING LEADERBOARD
         */

        const leaderboardRef = doc(
          db,
          "leaderboards",
          selectedTournament
        );

        const leaderboardSnap = await getDoc(
          leaderboardRef
        );

        if (leaderboardSnap.exists()) {
          const data = leaderboardSnap.data();

          setSavedMatches(
            data.matches || []
          );
        } else {
          setSavedMatches([]);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load teams");
      } finally {
        setLoadingTeams(false);
      }
    };

    loadTeams();
  }, [selectedTournament]);

  /*
   * UPDATE TEAM RESULT
   */

  const updateTeam = (
    registrationId: string,
    field: "placement" | "kills",
    value: number
  ) => {
    setTeams((prev) =>
      prev.map((team) => {
        if (
          team.registrationId !==
          registrationId
        ) {
          return team;
        }

        const placement =
          field === "placement"
            ? value
            : team.placement;

        const kills =
          field === "kills"
            ? value
            : team.kills;

        const placementPoints =
          getPlacementPoints(placement);

        const killPoints = kills;

        return {
          ...team,
          placement,
          kills,
          placementPoints,
          killPoints,
          totalPoints:
            placementPoints + killPoints,
        };
      })
    );
  };

  /*
   * SAVE MATCH
   */

  const saveMatch = async () => {
    if (!selectedTournament) {
      toast.error("Select a tournament first");
      return;
    }

    if (matchNumber < 1) {
      toast.error("Match number must be at least 1");
      return;
    }

    try {
      setSaving(true);

      const leaderboardRef = doc(
        db,
        "leaderboards",
        selectedTournament
      );

      const leaderboardSnap = await getDoc(
        leaderboardRef
      );

      let matches: SavedMatch[] = [];

      if (leaderboardSnap.exists()) {
        matches =
          leaderboardSnap.data().matches || [];
      }

      const newMatch: SavedMatch = {
        matchNumber,
        results: teams,
      };

      /*
       * Replace the match if it already exists.
       */

      const existingMatchIndex =
        matches.findIndex(
          (match) =>
            match.matchNumber ===
            matchNumber
        );

      if (existingMatchIndex !== -1) {
        matches[existingMatchIndex] =
          newMatch;
      } else {
        matches.push(newMatch);
      }

      matches.sort(
        (a, b) =>
          a.matchNumber -
          b.matchNumber
      );

      await setDoc(
        leaderboardRef,
        {
          tournamentId: selectedTournament,
          matches,
          updatedAt: serverTimestamp(),
        },
        {
          merge: true,
        }
      );

      setSavedMatches(matches);

      toast.success(
        `Match ${matchNumber} saved successfully`
      );
    } catch (error) {
      console.error(error);
      toast.error(
        "Failed to save leaderboard"
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * LOAD AN EXISTING MATCH
   */

  const loadMatch = (number: number) => {
    const match = savedMatches.find(
      (item) =>
        item.matchNumber === number
    );

    if (!match) {
      setTeams((prev) =>
        prev.map((team) => ({
          ...team,
          placement: 0,
          kills: 0,
          placementPoints: 0,
          killPoints: 0,
          totalPoints: 0,
        }))
      );

      toast("No saved result for this match");
      return;
    }

    setTeams(match.results);

    toast.success(
      `Match ${number} loaded`
    );
  };

  /*
   * CREATE TOTAL LEADERBOARD
   */

  const getOverallLeaderboard = () => {
    const totals: Record<
      string,
      Team
    > = {};

    savedMatches.forEach((match) => {
      match.results.forEach((team) => {
        if (!totals[team.registrationId]) {
          totals[team.registrationId] = {
            ...team,
            placement: 0,
            kills: 0,
            placementPoints: 0,
            killPoints: 0,
            totalPoints: 0,
          };
        }

        totals[team.registrationId].kills +=
          team.kills;

        totals[
          team.registrationId
        ].placementPoints +=
          team.placementPoints;

        totals[
          team.registrationId
        ].killPoints += team.killPoints;

        totals[
          team.registrationId
        ].totalPoints += team.totalPoints;
      });
    });

    return Object.values(totals).sort(
      (a, b) => {
        if (
          b.totalPoints !==
          a.totalPoints
        ) {
          return (
            b.totalPoints -
            a.totalPoints
          );
        }

        return (
          b.kills -
          a.kills
        );
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-purple-400 text-xl">
          Loading leaderboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">

      {/* HEADER */}

      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-purple-500">
          🏆 Leaderboard
        </h1>

        <p className="text-zinc-400 mt-2">
          Manage tournament match results and rankings.
        </p>
      </div>

      {/* TOURNAMENT SELECT */}

      <div className="bg-zinc-900 border border-purple-700 rounded-2xl p-6 mb-8">

        <h2 className="text-2xl font-bold text-purple-400 mb-5">
          Select Tournament
        </h2>

        <select
          value={selectedTournament}
          onChange={(e) =>
            setSelectedTournament(
              e.target.value
            )
          }
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4"
        >
          <option value="">
            Select a tournament
          </option>

          {tournaments.map(
            (tournament) => (
              <option
                key={tournament.id}
                value={tournament.id}
              >
                {tournament.title ||
                  "Unnamed Tournament"}{" "}
                {tournament.game
                  ? `- ${tournament.game}`
                  : ""}
              </option>
            )
          )}
        </select>

      </div>

      {/* MATCH MANAGEMENT */}

      {selectedTournament && (
        <>
          <div className="bg-zinc-900 border border-purple-700 rounded-2xl p-6 mb-8">

            <h2 className="text-2xl font-bold text-purple-400 mb-5">
              Match Results
            </h2>

            <div className="flex flex-col md:flex-row gap-4">

              <input
                type="number"
                min="1"
                value={matchNumber}
                onChange={(e) =>
                  setMatchNumber(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="bg-zinc-800 border border-zinc-700 rounded-xl p-4"
                placeholder="Match Number"
              />

              <button
                type="button"
                onClick={() =>
                  loadMatch(
                    matchNumber
                  )
                }
                className="bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-xl font-bold"
              >
                Load Match
              </button>

              <button
                type="button"
                onClick={saveMatch}
                disabled={
                  saving ||
                  loadingTeams
                }
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 px-6 py-4 rounded-xl font-bold"
              >
                {saving
                  ? "Saving..."
                  : `Save Match ${matchNumber}`}
              </button>

            </div>

          </div>

          {/* TEAMS */}

          <div className="bg-zinc-900 border border-purple-700 rounded-2xl p-6 mb-8">

            <h2 className="text-2xl font-bold text-purple-400 mb-5">
              Team Results
            </h2>

            {loadingTeams ? (
              <p className="text-zinc-400">
                Loading registered teams...
              </p>
            ) : teams.length === 0 ? (
              <p className="text-zinc-400">
                No approved teams found for this tournament.
              </p>
            ) : (
              <div className="space-y-4">

                {teams.map(
                  (team) => (
                    <div
                      key={
                        team.registrationId
                      }
                      className="bg-zinc-800 border border-zinc-700 rounded-xl p-4"
                    >

                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">

                        <div>
                          <p className="text-zinc-500 text-sm">
                            Team
                          </p>

                          <p className="font-bold text-lg text-purple-300">
                            {team.teamName}
                          </p>
                        </div>

                        <div>
                          <label className="text-zinc-500 text-sm">
                            Placement
                          </label>

                          <input
                            type="number"
                            min="0"
                            value={
                              team.placement
                            }
                            onChange={(e) =>
                              updateTeam(
                                team.registrationId,
                                "placement",
                                Number(
                                  e.target.value
                                )
                              )
                            }
                            className="w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-lg p-3"
                          />
                        </div>

                        <div>
                          <label className="text-zinc-500 text-sm">
                            Kills
                          </label>

                          <input
                            type="number"
                            min="0"
                            value={
                              team.kills
                            }
                            onChange={(e) =>
                              updateTeam(
                                team.registrationId,
                                "kills",
                                Number(
                                  e.target.value
                                )
                              )
                            }
                            className="w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-lg p-3"
                          />
                        </div>

                        <div>
                          <p className="text-zinc-500 text-sm">
                            Placement Points
                          </p>

                          <p className="text-yellow-400 font-bold text-xl">
                            {
                              team.placementPoints
                            }
                          </p>
                        </div>

                        <div>
                          <p className="text-zinc-500 text-sm">
                            Total Points
                          </p>

                          <p className="text-green-400 font-bold text-2xl">
                            {
                              team.totalPoints
                            }
                          </p>
                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          </div>

          {/* OVERALL LEADERBOARD */}

          <div className="bg-zinc-900 border border-purple-700 rounded-2xl p-6">

            <h2 className="text-2xl font-bold text-purple-400 mb-5">
              Overall Leaderboard
            </h2>

            {savedMatches.length === 0 ? (
              <p className="text-zinc-400">
                Save a match to generate the leaderboard.
              </p>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full text-left">

                  <thead>
                    <tr className="border-b border-zinc-700 text-zinc-400">

                      <th className="p-4">
                        Rank
                      </th>

                      <th className="p-4">
                        Team
                      </th>

                      <th className="p-4">
                        Kills
                      </th>

                      <th className="p-4">
                        Placement Points
                      </th>

                      <th className="p-4">
                        Kill Points
                      </th>

                      <th className="p-4">
                        Total
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {getOverallLeaderboard().map(
                      (team, index) => (
                        <tr
                          key={
                            team.registrationId
                          }
                          className="border-b border-zinc-800"
                        >

                          <td className="p-4 font-bold text-purple-400">
                            #{index + 1}
                          </td>

                          <td className="p-4 font-bold">
                            {team.teamName}
                          </td>

                          <td className="p-4">
                            {team.kills}
                          </td>

                          <td className="p-4">
                            {team.placementPoints}
                          </td>

                          <td className="p-4">
                            {team.killPoints}
                          </td>

                          <td className="p-4 text-green-400 font-bold text-xl">
                            {team.totalPoints}
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>
            )}

          </div>
        </>
      )}

    </div>
  );
}