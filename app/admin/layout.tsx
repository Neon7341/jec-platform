"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      try {
        const tokenResult = await user.getIdTokenResult();

        if (tokenResult.claims.admin === true) {
          setIsAdmin(true);
        } else {
          router.replace("/dashboard");
        }
      } catch (error) {
        console.error("Admin verification failed:", error);
        router.replace("/dashboard");
      } finally {
        setCheckingAdmin(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Close mobile menu when navigating
  const closeMenu = () => {
    setMenuOpen(false);
  };

  if (checkingAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-4xl mb-4">👑</div>

          <p className="text-purple-400 text-lg">
            Verifying admin access...
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ========================= */}
      {/* MOBILE TOP BAR */}
      {/* ========================= */}

      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-zinc-950/95 backdrop-blur-xl border-b border-purple-500/20">

        <div className="h-full px-4 flex items-center justify-between">

          <Link
            href="/admin"
            onClick={closeMenu}
            className="flex items-center gap-2"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-white font-black">
                J
              </span>
            </div>

            <div>
              <p className="text-white font-black text-sm">
                JEC ADMIN
              </p>

              <p className="text-[9px] text-purple-400 tracking-widest">
                CONTROL PANEL
              </p>
            </div>
          </Link>

          {/* MENU BUTTON */}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 rounded-xl border border-purple-500/30 bg-zinc-900 flex items-center justify-center text-white text-xl active:scale-95 transition"
            aria-label="Toggle admin menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>

      </header>


      {/* ========================= */}
      {/* MOBILE OVERLAY */}
      {/* ========================= */}

      {menuOpen && (
        <div
          onClick={closeMenu}
          className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        />
      )}


      {/* ========================= */}
      {/* SIDEBAR */}
      {/* ========================= */}

      <aside
        className={`
          fixed
          top-0
          left-0
          z-50
          h-screen
          w-[280px]
          bg-zinc-950
          border-r
          border-purple-700/30
          p-5
          transition-transform
          duration-300
          ease-out

          lg:translate-x-0
          lg:w-72

          ${
            menuOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* SIDEBAR HEADER */}

        <div className="flex items-center justify-between mb-10">

          <Link
            href="/admin"
            onClick={closeMenu}
            className="flex items-center gap-3"
          >

            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-white font-black text-xl">
                J
              </span>
            </div>

            <div>
              <h1 className="text-lg font-black text-white">
                JEC ADMIN
              </h1>

              <p className="text-[9px] text-purple-400 font-bold tracking-[0.2em]">
                CONTROL PANEL
              </p>
            </div>

          </Link>


          {/* MOBILE CLOSE */}

          <button
            onClick={closeMenu}
            className="lg:hidden w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white"
          >
            ✕
          </button>

        </div>


        {/* NAVIGATION */}

        <nav className="space-y-2">

          <Link
            href="/admin"
            onClick={closeMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-300 hover:text-white hover:bg-purple-600/15 hover:border-purple-500/20 border border-transparent transition"
          >
            <span>📊</span>
            <span>Dashboard</span>
          </Link>


          <Link
            href="/admin/tournaments"
            onClick={closeMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-300 hover:text-white hover:bg-purple-600/15 hover:border-purple-500/20 border border-transparent transition"
          >
            <span>🏆</span>
            <span>Tournaments</span>
          </Link>


          <Link
            href="/admin/leaderboard"
            onClick={closeMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-300 hover:text-white hover:bg-purple-600/15 hover:border-purple-500/20 border border-transparent transition"
          >
            <span>🏆</span>
            <span>Leaderboard</span>
          </Link>


          <Link
            href="/admin/tournaments/create"
            onClick={closeMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-300 hover:text-white hover:bg-purple-600/15 hover:border-purple-500/20 border border-transparent transition"
          >
            <span>➕</span>
            <span>Create Tournament</span>
          </Link>


          <Link
            href="/admin/users"
            onClick={closeMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-300 hover:text-white hover:bg-purple-600/15 hover:border-purple-500/20 border border-transparent transition"
          >
            <span>👤</span>
            <span>Users</span>
          </Link>


          <Link
            href="/admin/payments"
            onClick={closeMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-300 hover:text-white hover:bg-purple-600/15 hover:border-purple-500/20 border border-transparent transition"
          >
            <span>💳</span>
            <span>Payments</span>
          </Link>


          <Link
            href="/admin/settings"
            onClick={closeMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-300 hover:text-white hover:bg-purple-600/15 hover:border-purple-500/20 border border-transparent transition"
          >
            <span>⚙️</span>
            <span>Settings</span>
          </Link>

        </nav>


        {/* SIDEBAR FOOTER */}

        <div className="absolute bottom-5 left-5 right-5">

          <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">

            <p className="text-xs text-zinc-500">
              JEC Admin Panel
            </p>

            <p className="text-sm text-purple-400 font-semibold mt-1">
              Secure Access
            </p>

          </div>

        </div>

      </aside>


      {/* ========================= */}
      {/* MAIN CONTENT */}
      {/* ========================= */}

      <main
        className="
          min-h-screen

          pt-20
          px-4
          sm:px-6
          pb-8

          lg:ml-72
          lg:pt-0
          lg:px-8
          lg:py-8
        "
      >

        <div className="w-full max-w-[1600px] mx-auto">
          {children}
        </div>

      </main>

    </div>
  );
}