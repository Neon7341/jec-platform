export default function DashboardPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-500">
          Dashboard
        </h1>

        <p className="text-gray-400 text-sm sm:text-base mt-1 sm:mt-2">
          Welcome to Jaipur Esports Club.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6 mt-6 sm:mt-10">

        {/* Tournaments */}
        <div className="bg-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-700/70">
          <h2 className="text-gray-400 text-xs sm:text-sm">
            Tournaments
          </h2>

          <p className="text-2xl sm:text-4xl font-bold mt-2 sm:mt-3">
            0
          </p>
        </div>

        {/* Teams */}
        <div className="bg-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-700/70">
          <h2 className="text-gray-400 text-xs sm:text-sm">
            Teams
          </h2>

          <p className="text-2xl sm:text-4xl font-bold mt-2 sm:mt-3">
            0
          </p>
        </div>

        {/* Wins */}
        <div className="bg-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-700/70">
          <h2 className="text-gray-400 text-xs sm:text-sm">
            Wins
          </h2>

          <p className="text-2xl sm:text-4xl font-bold mt-2 sm:mt-3">
            0
          </p>
        </div>

        {/* Ranking */}
        <div className="bg-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-700/70">
          <h2 className="text-gray-400 text-xs sm:text-sm">
            Ranking
          </h2>

          <p className="text-2xl sm:text-4xl font-bold mt-2 sm:mt-3">
            #--
          </p>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="mt-8 sm:mt-12">

        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">

          {/* Register Tournament */}
          <button
            className="
              w-full
              bg-purple-600
              hover:bg-purple-700
              active:scale-[0.98]
              transition
              rounded-xl sm:rounded-2xl
              p-4 sm:p-6
              text-sm sm:text-base
              font-bold
              text-left
            "
          >
            <span className="block text-base sm:text-lg">
              Register Tournament
            </span>

            <span className="block text-xs sm:text-sm text-purple-200 mt-1 font-normal">
              Join an upcoming tournament
            </span>
          </button>

          {/* Create Team */}
          <button
            className="
              w-full
              bg-zinc-900
              border border-purple-700/70
              hover:border-purple-500
              active:scale-[0.98]
              transition
              rounded-xl sm:rounded-2xl
              p-4 sm:p-6
              text-sm sm:text-base
              font-bold
              text-left
            "
          >
            <span className="block text-base sm:text-lg">
              Create Team
            </span>

            <span className="block text-xs sm:text-sm text-gray-400 mt-1 font-normal">
              Build your esports team
            </span>
          </button>

          {/* Strategy Planner */}
          <button
            className="
              w-full
              bg-zinc-900
              border border-purple-700/70
              hover:border-purple-500
              active:scale-[0.98]
              transition
              rounded-xl sm:rounded-2xl
              p-4 sm:p-6
              text-sm sm:text-base
              font-bold
              text-left
            "
          >
            <span className="block text-base sm:text-lg">
              Strategy Planner
            </span>

            <span className="block text-xs sm:text-sm text-gray-400 mt-1 font-normal">
              Plan your next match
            </span>
          </button>

        </div>

      </div>

    </div>
  );
}