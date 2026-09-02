"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Tournament {
  id: string;
  title?: string;
  name?: string;
  game?: string;
}

interface Team {
  registrationId: string;
  teamName: string;
  kills: number;
  placementPoints: number;
  killPoints: number;
  totalPoints: number;
}

interface SavedMatch {
  matchNumber: number;
  results: Team[];
}

export default function PublicLeaderboardPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>(
    []
  );

  const [selectedTournament, setSelectedTournament] =
    useState("");

  const [leaderboard, setLeaderboard] = useState<Team[]>([]);
  const [matches, setMatches] = useState<SavedMatch[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingLeaderboard, setLoadingLeaderboard] =
    useState(false);

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
      } finally {
        setLoading(false);
      }
    };

    loadTournaments();
  }, []);

  useEffect(() => {
    if (!selectedTournament) {
      setLeaderboard([]);
      setMatches([]);
      return;
    }

    const loadLeaderboard = async () => {
      try {
        setLoadingLeaderboard(true);

        const leaderboardRef = doc(
          db,
          "leaderboards",
          selectedTournament
        );

        const leaderboardSnap = await getDoc(
          leaderboardRef
        );

        if (!leaderboardSnap.exists()) {
          setLeaderboard([]);
          setMatches([]);
          return;
        }

        const data = leaderboardSnap.data();

        const savedMatches: SavedMatch[] =
          data.matches || [];

        setMatches(savedMatches);

        const totals: Record<string, Team> = {};

        savedMatches.forEach((match) => {
          match.results.forEach((team) => {
            if (!totals[team.registrationId]) {
              totals[team.registrationId] = {
                registrationId: team.registrationId,
                teamName: team.teamName,
                kills: 0,
                placementPoints: 0,
                killPoints: 0,
                totalPoints: 0,
              };
            }

            totals[team.registrationId].kills +=
              team.kills;

            totals[team.registrationId].placementPoints +=
              team.placementPoints;

            totals[team.registrationId].killPoints +=
              team.killPoints;

            totals[team.registrationId].totalPoints +=
              team.totalPoints;
          });
        });

        const sorted = Object.values(totals).sort(
          (a, b) => {
            if (b.totalPoints !== a.totalPoints) {
              return b.totalPoints - a.totalPoints;
            }

            return b.kills - a.kills;
          }
        );

        setLeaderboard(sorted);
      } catch (error) {
        console.error(
          "Failed to load leaderboard:",
          error
        );
      } finally {
        setLoadingLeaderboard(false);
      }
    };

    loadLeaderboard();
  }, [selectedTournament]);

  const selectedTournamentData = tournaments.find(
    (tournament) =>
      tournament.id === selectedTournament
  );

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
    <main className="min-h-screen bg-black text-white">

      {/* HEADER */}

      <div className="border-b border-purple-900 bg-zinc-950">

        <div className="max-w-7xl mx-auto px-6 py-12">

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">

            <div>

              <p className="text-purple-400 font-semibold mb-2">
                JAIPUR ESPORTS CLUB
              </p>

              <h1 className="text-5xl md:text-6xl font-black">
                🏆 Leaderboard
              </h1>

              <p className="text-zinc-400 mt-3">
                Live tournament standings & match results
              </p>

            </div>

            {selectedTournamentData && (
              <div className="bg-purple-600/10 border border-purple-600/40 rounded-2xl px-6 py-4">

                <p className="text-zinc-500 text-sm">
                  Current Tournament
                </p>

                <p className="text-xl font-bold text-purple-400">
                  {selectedTournamentData.title ||
                    selectedTournamentData.name ||
                    "Tournament"}
                </p>

                {selectedTournamentData.game && (
                  <p className="text-zinc-400 text-sm mt-1">
                    🎮 {selectedTournamentData.game}
                  </p>
                )}

              </div>
            )}

          </div>

        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* TOURNAMENT SELECT */}

        <div className="bg-zinc-900 border border-purple-700/70 rounded-2xl p-6 shadow-xl shadow-purple-950/20">

          <label className="block text-purple-400 font-bold mb-3">
            Select Tournament
          </label>

          <select
            value={selectedTournament}
            onChange={(e) =>
              setSelectedTournament(e.target.value)
            }
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-white outline-none focus:border-purple-500"
          >
            <option value="">
              Select a tournament
            </option>

            {tournaments.map((tournament) => (
              <option
                key={tournament.id}
                value={tournament.id}
              >
                {tournament.title ||
                  tournament.name ||
                  "Unnamed Tournament"}

                {tournament.game
                  ? ` - ${tournament.game}`
                  : ""}
              </option>
            ))}
          </select>

        </div>

        {!selectedTournament ? (
          <div className="mt-10 bg-zinc-900 border border-zinc-800 rounded-2xl p-16 text-center">

            <div className="text-6xl mb-5">
              🏆
            </div>

            <h2 className="text-2xl font-bold">
              Select a Tournament
            </h2>

            <p className="text-zinc-500 mt-2">
              Choose a tournament above to view its leaderboard.
            </p>

          </div>
        ) : loadingLeaderboard ? (
          <div className="py-20 text-center">
            <p className="text-purple-400 text-xl">
              Loading results...
            </p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="mt-10 bg-zinc-900 border border-purple-700 rounded-2xl p-16 text-center">

            <div className="text-5xl mb-4">
              📊
            </div>

            <h2 className="text-2xl font-bold">
              No Results Yet
            </h2>

            <p className="text-zinc-500 mt-2">
              Results will appear here once the admin publishes match scores.
            </p>

          </div>
        ) : (
          <>

            {/* SUMMARY */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">

              <div className="bg-zinc-900 border border-purple-700 rounded-2xl p-6">
                <p className="text-zinc-500">
                  Teams
                </p>

                <p className="text-4xl font-black text-purple-400 mt-2">
                  {leaderboard.length}
                </p>
              </div>

              <div className="bg-zinc-900 border border-purple-700 rounded-2xl p-6">
                <p className="text-zinc-500">
                  Matches
                </p>

                <p className="text-4xl font-black text-blue-400 mt-2">
                  {matches.length}
                </p>
              </div>

              <div className="bg-zinc-900 border border-purple-700 rounded-2xl p-6">
                <p className="text-zinc-500">
                  Leader
                </p>

                <p className="text-2xl font-black text-green-400 mt-2 truncate">
                  {leaderboard[0]?.teamName}
                </p>
              </div>

            </div>

            {/* TOP 3 */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

              {leaderboard
                .slice(0, 3)
                .map((team, index) => (
                  <div
                    key={team.registrationId}
                    className={`relative overflow-hidden rounded-2xl p-7 text-center border ${
                      index === 0
                        ? "border-yellow-500/70 bg-yellow-500/10"
                        : index === 1
                        ? "border-zinc-400/70 bg-zinc-400/10"
                        : "border-orange-600/70 bg-orange-600/10"
                    }`}
                  >

                    <div className="text-5xl">
                      {index === 0
                        ? "🥇"
                        : index === 1
                        ? "🥈"
                        : "🥉"}
                    </div>

                    <p className="text-zinc-500 text-sm mt-3">
                      RANK #{index + 1}
                    </p>

                    <h2 className="text-2xl font-black mt-2">
                      {team.teamName}
                    </h2>

                    <div className="mt-5">

                      <span className="text-5xl font-black text-purple-400">
                        {team.totalPoints}
                      </span>

                      <p className="text-zinc-500">
                        TOTAL POINTS
                      </p>

                    </div>

                    <div className="flex justify-center gap-8 mt-5 text-sm">

                      <div>
                        <p className="text-zinc-500">
                          Kills
                        </p>

                        <p className="font-bold">
                          {team.kills}
                        </p>
                      </div>

                      <div>
                        <p className="text-zinc-500">
                          Placement
                        </p>

                        <p className="font-bold">
                          {team.placementPoints}
                        </p>
                      </div>

                    </div>

                  </div>
                ))}

            </div>

            {/* FULL TABLE */}

            <div className="mt-8 bg-zinc-900 border border-purple-700 rounded-2xl overflow-hidden">

              <div className="px-6 py-5 border-b border-zinc-800">

                <h2 className="text-2xl font-bold text-purple-400">
                  Overall Standings
                </h2>

                <p className="text-zinc-500 text-sm mt-1">
                  Rankings are based on total points.
                </p>

              </div>

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead>
                    <tr className="bg-zinc-800/70 text-zinc-400 text-sm">

                      <th className="p-5 text-left">
                        Rank
                      </th>

                      <th className="p-5 text-left">
                        Team
                      </th>

                      <th className="p-5 text-center">
                        Kills
                      </th>

                      <th className="p-5 text-center">
                        Placement
                      </th>

                      <th className="p-5 text-center">
                        Kill Points
                      </th>

                      <th className="p-5 text-center">
                        Total
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {leaderboard.map(
                      (team, index) => (
                        <tr
                          key={
                            team.registrationId
                          }
                          className="border-t border-zinc-800 hover:bg-purple-900/10 transition"
                        >

                          <td className="p-5">

                            <span
                              className={`font-black text-lg ${
                                index === 0
                                  ? "text-yellow-400"
                                  : index === 1
                                  ? "text-zinc-300"
                                  : index === 2
                                  ? "text-orange-400"
                                  : "text-purple-400"
                              }`}
                            >
                              #{index + 1}
                            </span>

                          </td>

                          <td className="p-5">

                            <p className="font-bold text-lg">
                              {team.teamName}
                            </p>

                          </td>

                          <td className="p-5 text-center">
                            {team.kills}
                          </td>

                          <td className="p-5 text-center">
                            {team.placementPoints}
                          </td>

                          <td className="p-5 text-center">
                            {team.killPoints}
                          </td>

                          <td className="p-5 text-center">

                            <span className="text-green-400 font-black text-xl">
                              {team.totalPoints}
                            </span>

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

            {/* MATCHES */}

            <div className="mt-8 bg-zinc-900 border border-purple-700 rounded-2xl p-6">

              <h2 className="text-xl font-bold text-purple-400">
                Matches Completed
              </h2>

              <div className="flex flex-wrap gap-3 mt-5">

                {matches.map((match) => (
                  <div
                    key={match.matchNumber}
                    className="px-5 py-3 rounded-xl bg-purple-600/10 border border-purple-600/50"
                  >
                    <span className="text-purple-400 font-bold">
                      Match {match.matchNumber}
                    </span>
                  </div>
                ))}

              </div>

            </div>

          </>
        )}

      </div>

    </main>
  );
}