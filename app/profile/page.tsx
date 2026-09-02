"use client";

import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import toast from "react-hot-toast";

interface UserProfile {
  name?: string;
  email?: string;
  phone?: string;
  username?: string;
  dob?: string;
  role?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    username: "",
    dob: "",
    role: "User",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (!user) {
          setLoading(false);
          return;
        }

        try {
          const userRef = doc(
            db,
            "users",
            user.uid
          );

          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();

            setProfile({
              name: data.name || "",
              email: user.email || data.email || "",
              phone: data.phone || "",
              username: data.username || "",
              dob: data.dob || "",
              role: data.role || "User",
            });
          } else {
            setProfile({
              name: user.displayName || "",
              email: user.email || "",
              phone: "",
              username: "",
              dob: "",
              role: "User",
            });
          }
        } catch (error) {
          console.error(
            "Failed to load profile:",
            error
          );

          toast.error(
            "Failed to load profile"
          );
        } finally {
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const handleChange = (
    field: keyof UserProfile,
    value: string
  ) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    const user = auth.currentUser;

    if (!user) {
      toast.error("You are not logged in");
      return;
    }

    if (!profile.name?.trim()) {
      toast.error("Please enter your name");
      return;
    }

    try {
      setSaving(true);

      const userRef = doc(
        db,
        "users",
        user.uid
      );

      await setDoc(
        userRef,
        {
          name: profile.name.trim(),
          phone: profile.phone || "",
          username: profile.username || "",
          dob: profile.dob || "",
          email: user.email || "",
          role: profile.role || "User",
        },
        {
          merge: true,
        }
      );

      toast.success(
        "Profile updated successfully"
      );

      setEditing(false);
    } catch (error) {
      console.error(
        "Failed to update profile:",
        error
      );

      toast.error(
        "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-purple-400 text-xl">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}

        <div className="mb-10">

          <p className="text-purple-400 font-semibold">
            JAIPUR ESPORTS CLUB
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mt-2">
            My Profile
          </h1>

          <p className="text-zinc-400 mt-2">
            Manage your personal information.
          </p>

        </div>

        {/* PROFILE CARD */}

        <div className="bg-zinc-900 border border-purple-700 rounded-2xl p-8">

          {/* TOP */}

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">

            {/* AVATAR */}

            <div className="w-28 h-28 rounded-full bg-purple-600 flex items-center justify-center text-5xl font-bold">
              {profile.name
                ? profile.name
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </div>

            <div className="flex-1 text-center md:text-left">

              <h2 className="text-3xl font-bold">
                {profile.name ||
                  "User"}
              </h2>

              <p className="text-zinc-400 mt-2">
                {profile.email}
              </p>

              <span className="inline-block mt-4 bg-purple-600/20 border border-purple-600 text-purple-400 px-4 py-2 rounded-full text-sm font-semibold">
                {profile.role || "User"}
              </span>

            </div>

            {/* EDIT BUTTON */}

            {!editing && (
              <button
                type="button"
                onClick={() =>
                  setEditing(true)
                }
                className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold transition"
              >
                ✏️ Edit Profile
              </button>
            )}

          </div>

          {/* INFORMATION */}

          <div className="border-t border-zinc-800 mt-8 pt-8">

            <div className="flex items-center justify-between mb-6">

              <h3 className="text-xl font-bold text-purple-400">
                Personal Information
              </h3>

              {editing && (
                <span className="text-sm text-yellow-400">
                  Editing Mode
                </span>
              )}

            </div>

            <div className="grid md:grid-cols-2 gap-5">

              {/* NAME */}

              <div className="bg-zinc-800 rounded-xl p-5">

                <label className="text-zinc-500 text-sm">
                  Full Name
                </label>

                {editing ? (
                  <input
                    type="text"
                    value={
                      profile.name || ""
                    }
                    onChange={(e) =>
                      handleChange(
                        "name",
                        e.target.value
                      )
                    }
                    className="w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-lg p-3 outline-none focus:border-purple-500"
                    placeholder="Enter your name"
                  />
                ) : (
                  <p className="font-semibold mt-2">
                    {profile.name ||
                      "Not provided"}
                  </p>
                )}

              </div>

              {/* EMAIL - LOCKED */}

              <div className="bg-zinc-800 rounded-xl p-5">

                <div className="flex justify-between items-center">

                  <label className="text-zinc-500 text-sm">
                    Email
                  </label>

                  <span className="text-xs text-zinc-500">
                    🔒 Locked
                  </span>

                </div>

                <p className="font-semibold mt-2 text-zinc-300 break-all">
                  {profile.email ||
                    "Not provided"}
                </p>

              </div>

              {/* PHONE */}

              <div className="bg-zinc-800 rounded-xl p-5">

                <label className="text-zinc-500 text-sm">
                  Phone Number
                </label>

                {editing ? (
                  <input
                    type="tel"
                    value={
                      profile.phone || ""
                    }
                    onChange={(e) =>
                      handleChange(
                        "phone",
                        e.target.value
                      )
                    }
                    className="w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-lg p-3 outline-none focus:border-purple-500"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="font-semibold mt-2">
                    {profile.phone ||
                      "Not provided"}
                  </p>
                )}

              </div>

              {/* USERNAME */}

              <div className="bg-zinc-800 rounded-xl p-5">

                <label className="text-zinc-500 text-sm">
                  Username / IGN
                </label>

                {editing ? (
                  <input
                    type="text"
                    value={
                      profile.username || ""
                    }
                    onChange={(e) =>
                      handleChange(
                        "username",
                        e.target.value
                      )
                    }
                    className="w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-lg p-3 outline-none focus:border-purple-500"
                    placeholder="Enter gaming name"
                  />
                ) : (
                  <p className="font-semibold mt-2">
                    {profile.username ||
                      "Not provided"}
                  </p>
                )}

              </div>

              {/* DOB */}

              <div className="bg-zinc-800 rounded-xl p-5">

                <label className="text-zinc-500 text-sm">
                  Date of Birth
                </label>

                {editing ? (
                  <input
                    type="date"
                    value={
                      profile.dob || ""
                    }
                    onChange={(e) =>
                      handleChange(
                        "dob",
                        e.target.value
                      )
                    }
                    className="w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-lg p-3 outline-none focus:border-purple-500"
                  />
                ) : (
                  <p className="font-semibold mt-2">
                    {profile.dob ||
                      "Not provided"}
                  </p>
                )}

              </div>

              {/* ROLE */}

              <div className="bg-zinc-800 rounded-xl p-5">

                <label className="text-zinc-500 text-sm">
                  Account Role
                </label>

                <p className="font-semibold mt-2 text-purple-400">
                  {profile.role ||
                    "User"}
                </p>

                <p className="text-xs text-zinc-500 mt-1">
                  This cannot be changed by the player.
                </p>

              </div>

            </div>

          </div>

          {/* SAVE / CANCEL */}

          {editing && (
            <div className="border-t border-zinc-800 mt-8 pt-6 flex flex-col sm:flex-row gap-4">

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-7 py-3 rounded-xl font-bold"
              >
                {saving
                  ? "Saving..."
                  : "💾 Save Changes"}
              </button>

              <button
                type="button"
                onClick={() =>
                  setEditing(false)
                }
                disabled={saving}
                className="bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 px-7 py-3 rounded-xl font-bold"
              >
                Cancel
              </button>

            </div>
          )}

        </div>

        {/* SECURITY NOTE */}

        <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-xl p-5">

          <p className="text-sm text-zinc-400">
            🔒 Your email address and account role
            cannot be changed from your profile.
          </p>

        </div>

      </div>

    </main>
  );
}