"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

interface User {
  id: string;
  name?: string;
  email?: string;
  fullName?: string;
  phone?: string;
  createdAt?: any;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const usersQuery = query(
        collection(db, "users"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(usersQuery);

      const userList = snapshot.docs.map((userDoc) => ({
        id: userDoc.id,
        ...userDoc.data(),
      })) as User[];

      setUsers(userList);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    return (
  user.fullName?.toLowerCase().includes(searchText) ||
  user.name?.toLowerCase().includes(searchText) ||
  user.email?.toLowerCase().includes(searchText) ||
  user.phone?.includes(searchText)
);
  });

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div>
        <h1 className="text-4xl font-bold text-purple-500">
          👤 Users
        </h1>

        <p className="mt-2 text-zinc-400">
          Manage registered users of Jaipur Esports Club.
        </p>
      </div>

      {/* SEARCH */}

      <div>
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-900 border border-purple-700 rounded-xl p-4 text-white outline-none focus:border-purple-400"
        />
      </div>

      {/* USER COUNT */}

      <div className="bg-zinc-900 border border-purple-700 rounded-2xl p-5">
        <p className="text-zinc-400">
          Total Users
        </p>

        <p className="text-3xl font-bold text-purple-400 mt-2">
          {users.length}
        </p>
      </div>

      {/* USERS */}

      <div className="space-y-4">

        {loading ? (
          <div className="bg-zinc-900 rounded-2xl p-6">
            Loading users...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
            <p className="text-zinc-400">
              No users found.
            </p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-zinc-900 border border-purple-700 rounded-2xl p-6"
            >

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                <div>

                  <h2 className="text-xl font-bold text-purple-400">
                     {user.fullName || user.name || "No Name"}
                    </h2>

                  <p className="text-zinc-300 mt-2">
                    📧 {user.email || "No Email"}
                  </p>

                  {user.phone && (
                    <p className="text-zinc-400 mt-1">
                      📱 {user.phone}
                    </p>
                  )}

                </div>

                <div className="text-sm text-zinc-500">
                  User ID:
                  <br />
                  <span className="text-zinc-400">
                    {user.id}
                  </span>
                </div>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}