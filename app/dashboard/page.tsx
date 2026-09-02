export default function DashboardPage() {
  return (
    <div>

      <h1 className="text-4xl font-bold text-purple-500">
        Dashboard
      </h1>

      <p className="text-gray-400 mt-2">
        Welcome to Jaipur Esports Club.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">

        <div className="bg-zinc-900 rounded-2xl p-6 border border-purple-700">
          <h2 className="text-gray-400">Tournaments</h2>
          <p className="text-4xl font-bold mt-3">0</p>
        </div>

        <div className="bg-zinc-900 rounded-2xl p-6 border border-purple-700">
          <h2 className="text-gray-400">Teams</h2>
          <p className="text-4xl font-bold mt-3">0</p>
        </div>

        <div className="bg-zinc-900 rounded-2xl p-6 border border-purple-700">
          <h2 className="text-gray-400">Wins</h2>
          <p className="text-4xl font-bold mt-3">0</p>
        </div>

        <div className="bg-zinc-900 rounded-2xl p-6 border border-purple-700">
          <h2 className="text-gray-400">Ranking</h2>
          <p className="text-4xl font-bold mt-3">#--</p>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="mt-12">

        <h2 className="text-2xl font-bold mb-6">
          Quick Actions
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <button className="bg-purple-600 hover:bg-purple-700 rounded-2xl p-6 font-bold">
            Register Tournament
          </button>

          <button className="bg-zinc-900 border border-purple-700 rounded-2xl p-6 font-bold">
            Create Team
          </button>

          <button className="bg-zinc-900 border border-purple-700 rounded-2xl p-6 font-bold">
            Open Strategy Planner
          </button>

        </div>

      </div>

    </div>
  );
}