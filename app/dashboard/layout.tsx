"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const [userName, setUserName] = useState("Player");
    const router = useRouter();

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserName(user.displayName || "Player");
    } else {
      router.push("/login");
    }
  });

  return () => unsubscribe();
}, [router]);

const handleLogout = async () => {
  try {
    await signOut(auth);
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

  return (
    <div className="flex min-h-screen bg-black text-white">

      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-purple-700 p-6">

        <h1 className="text-2xl font-bold text-purple-500 mb-10">
          JEC Dashboard
        </h1>

        <nav className="space-y-4">

          <Link href="/dashboard" className="block hover:text-purple-400">
            🏠 Dashboard
          </Link>

          <Link href="/dashboard/tournaments" className="block hover:text-purple-400">
            🏆 Tournaments
          </Link>

         <Link
  href="/dashboard/teams"
  className="block hover:text-purple-400"
>
  👥 My Team
</Link>

          <Link href="/dashboard/strategy" className="block hover:text-purple-400">
            🗺️ Strategy Planner
          </Link>

          <Link href="/leaderboard" className="block hover:text-purple-400">
            📊 Leaderboard
          </Link>

          <Link href="/profile" className="block hover:text-purple-400">
             👤 Profile
           </Link>

          <Link href="/dashboard/settings" className="block hover:text-purple-400">
            ⚙️ Settings
          </Link>

        </nav>

      </aside>

      <div className="flex-1 flex flex-col">

  {/* Top Navbar */}
  <header className="h-16 border-b border-purple-700 bg-zinc-900 flex items-center justify-between px-8">

    <h2 className="text-xl font-semibold">
      Jaipur Esports Club
    </h2>

   <div className="flex items-center gap-4">

  <button className="text-2xl">
    🔔
  </button>

  <div className="bg-purple-600 px-4 py-2 rounded-lg">
    Welcome {userName}
  </div>

  <button
    onClick={handleLogout}
    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
  >
    Logout
  </button>

</div>

  </header>

  <main className="flex-1 p-8">
    {children}
  </main>

</div>

    </div>
  );
}