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

  if (checkingAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
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
    <div className="flex min-h-screen bg-black text-white">

      {/* Sidebar */}
      <aside className="w-72 bg-zinc-900 border-r border-purple-700 p-6">

        <h1 className="text-3xl font-bold text-purple-500 mb-10">
          👑 JEC Admin
        </h1>

        <nav className="space-y-4">

          <Link
            href="/admin"
            className="block hover:text-purple-400"
          >
            📊 Dashboard
          </Link>

          <Link
            href="/admin/tournaments"
            className="block hover:text-purple-400"
          >
            🏆 Tournaments
          </Link>

          <Link
            href="/admin/leaderboard"
            className="block hover:text-purple-400"
          >
            🏆 Leaderboard
          </Link>

          <Link
            href="/admin/tournaments/create"
            className="block hover:text-purple-400"
          >
            ➕ Create Tournament
          </Link>

          <Link
            href="/admin/users"
            className="block hover:text-purple-400"
          >
            👤 Users
          </Link>

          <Link
            href="/admin/payments"
            className="block hover:text-purple-400"
          >
            💳 Payments
          </Link>

          <Link
            href="/admin/settings"
            className="block hover:text-purple-400"
          >
            ⚙️ Settings
          </Link>

        </nav>

      </aside>

      <main className="flex-1 p-8">
        {children}
      </main>

    </div>
  );
}