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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "🏠",
    },
    {
      name: "Tournaments",
      href: "/dashboard/tournaments",
      icon: "🏆",
    },
    {
      name: "My Team",
      href: "/dashboard/teams",
      icon: "👥",
    },
    {
      name: "Strategy Planner",
      href: "/dashboard/strategy",
      icon: "🗺️",
    },
    {
      name: "Leaderboard",
      href: "/leaderboard",
      icon: "📊",
    },
    {
      name: "Profile",
      href: "/profile",
      icon: "👤",
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: "⚙️",
    },
  ];

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-black text-white">

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex w-64 shrink-0 bg-zinc-900 border-r border-purple-700 p-6 flex-col">

        <h1 className="text-2xl font-bold text-purple-500 mb-10">
          JEC Dashboard
        </h1>

        <nav className="space-y-4">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 hover:text-purple-400 transition"
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

      </aside>


      {/* ================= MOBILE MENU OVERLAY ================= */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 md:hidden"
          onClick={closeMobileMenu}
        />
      )}


      {/* ================= MOBILE SIDEBAR ================= */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 max-w-[85vw] bg-zinc-900 border-r border-purple-700 p-6 transform transition-transform duration-300 md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        <div className="flex items-center justify-between mb-10">

          <h1 className="text-xl font-bold text-purple-500">
            JEC Dashboard
          </h1>

          <button
            onClick={closeMobileMenu}
            className="text-2xl text-zinc-400 hover:text-white"
            aria-label="Close menu"
          >
            ✕
          </button>

        </div>

        <nav className="space-y-2">

          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMobileMenu}
              className="flex items-center gap-4 rounded-xl px-4 py-3 hover:bg-purple-600/20 hover:text-purple-400 transition"
            >
              <span className="text-xl">
                {item.icon}
              </span>

              <span className="font-medium">
                {item.name}
              </span>
            </Link>
          ))}

        </nav>

        {/* Mobile Logout */}
        <div className="absolute bottom-6 left-6 right-6">

          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 px-4 py-3 rounded-xl transition font-medium"
          >
            Logout
          </button>

        </div>

      </aside>


      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 min-w-0 flex flex-col">


        {/* ================= TOP NAVBAR ================= */}
        <header className="h-16 shrink-0 border-b border-purple-700 bg-zinc-900 flex items-center justify-between px-4 sm:px-6 md:px-8">

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-zinc-800 transition text-xl"
            aria-label="Open menu"
          >
            ☰
          </button>


          {/* Desktop Title */}
          <h2 className="hidden md:block text-xl font-semibold">
            Jaipur Esports Club
          </h2>


          {/* Mobile Title */}
          <h2 className="md:hidden text-base sm:text-lg font-semibold">
            JEC
          </h2>


          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-4">

            {/* Notification */}
            <button
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-zinc-800 transition text-xl"
              aria-label="Notifications"
            >
              🔔
            </button>


            {/* Desktop Welcome */}
            <div className="hidden sm:block bg-purple-600 px-4 py-2 rounded-lg max-w-[220px] truncate">
              Welcome {userName}
            </div>


            {/* Mobile User */}
            <div className="sm:hidden w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>


            {/* Desktop Logout */}
            <button
              onClick={handleLogout}
              className="hidden sm:block bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>

          </div>

        </header>


        {/* ================= PAGE CONTENT ================= */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 overflow-x-hidden">
          {children}
        </main>

      </div>

    </div>
  );
}