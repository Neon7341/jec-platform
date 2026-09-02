"use client";

import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  updatePassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [userEmail, setUserEmail] = useState("");
  const [displayName, setDisplayName] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [changingPassword, setChangingPassword] = useState(false);
  const [notifications, setNotifications] = useState({
  tournamentUpdates: true,
  paymentUpdates: true,
  matchUpdates: true,
});

const [savingNotifications, setSavingNotifications] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      setUserEmail(user.email || "");
      setDisplayName(user.displayName || "");
    });

    return () => unsubscribe();
  }, []);

  const handleChangePassword = async () => {
    if (!auth.currentUser) {
      toast.error("You are not logged in.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      toast.error("Please enter both password fields.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setChangingPassword(true);

      await updatePassword(auth.currentUser, newPassword);

      setNewPassword("");
      setConfirmPassword("");

      toast.success("Password changed successfully!");
    } catch (error: any) {
      console.error("Password change error:", error);

      if (error.code === "auth/requires-recent-login") {
        toast.error(
          "Please log out and log in again before changing your password."
        );
      } else {
        toast.error(error.message || "Failed to change password.");
      }
    } finally {
      setChangingPassword(false);
    }
  };

  const saveNotificationSettings = async () => {
  if (!auth.currentUser) {
    toast.error("You are not logged in.");
    return;
  }

  try {
    setSavingNotifications(true);

    await setDoc(
      doc(db, "users", auth.currentUser.uid),
      {
        notifications,
      },
      { merge: true }
    );

    toast.success("Notification settings saved!");
  } catch (error) {
    console.error(
      "Failed to save notification settings:",
      error
    );

    toast.error(
      "Failed to save notification settings."
    );
  } finally {
    setSavingNotifications(false);
  }
};

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}

        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-500">
            ⚙️ Settings
          </h1>

          <p className="text-zinc-400 mt-3">
            Manage your JEC account and security settings.
          </p>
        </div>

        {/* ACCOUNT */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">

          <h2 className="text-2xl font-bold text-purple-400 mb-6">
            👤 Account
          </h2>

          <div className="space-y-5">

            {/* NAME */}

            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Name
              </label>

              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white outline-none focus:border-purple-500"
              />

<button
  onClick={async () => {
    if (!auth.currentUser) {
      toast.error("You are not logged in.");
      return;
    }

    try {
        await updateProfile(auth.currentUser, {
  displayName: displayName.trim(),
});
      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        {
          displayName: displayName.trim(),
          email: auth.currentUser.email || "",
        },
        { merge: true }
      );

      toast.success("Name updated successfully!");
    } catch (error) {
      console.error("Failed to update name:", error);
      toast.error("Failed to update name.");
    }
  }}
  className="mt-3 bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-xl font-bold transition"
>
  💾 Save Name
</button>

            </div>

            {/* EMAIL */}

            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Email
              </label>

              <input
                type="email"
                value={userEmail}
                disabled
                className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl p-3 text-zinc-500 cursor-not-allowed"
              />

              <p className="text-xs text-zinc-500 mt-2">
                Your email cannot be changed from here.
              </p>
            </div>

          </div>

        </div>

        {/* SECURITY */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">

          <h2 className="text-2xl font-bold text-purple-400 mb-6">
            🔐 Security
          </h2>

          <div className="space-y-5">

            {/* NEW PASSWORD */}

            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                New Password
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white outline-none focus:border-purple-500"
              />
            </div>

            {/* CONFIRM PASSWORD */}

            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Confirm New Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white outline-none focus:border-purple-500"
              />
            </div>

            {/* CHANGE PASSWORD */}

            <button
              onClick={handleChangePassword}
              disabled={changingPassword}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 px-6 py-3 rounded-xl font-bold transition"
            >
              {changingPassword
                ? "Changing Password..."
                : "🔑 Change Password"}
            </button>

            <button
  onClick={async () => {
    if (!auth.currentUser?.email) {
      toast.error("No email address found.");
      return;
    }

    try {
      await sendPasswordResetEmail(
        auth,
        auth.currentUser.email
      );

      toast.success(
        "Password reset email sent successfully!"
      );
    } catch (error: any) {
      console.error(
        "Password reset error:",
        error
      );

      toast.error(
        error.message ||
          "Failed to send password reset email."
      );
    }
  }}
  className="bg-zinc-700 hover:bg-zinc-600 px-6 py-3 rounded-xl font-bold transition"
>
  📧 Send Password Reset Email
</button>

          </div>

        </div>

        {/* NOTIFICATIONS */}

<div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">

  <h2 className="text-2xl font-bold text-purple-400 mb-6">
    🔔 Notifications
  </h2>

  <div className="space-y-4">

    {/* TOURNAMENT */}

    <label className="flex items-center justify-between bg-zinc-800 rounded-xl p-4 cursor-pointer">

      <div>
        <p className="font-semibold">
          🏆 Tournament Updates
        </p>

        <p className="text-zinc-500 text-sm mt-1">
          Get updates about your tournaments and registrations.
        </p>
      </div>

      <input
        type="checkbox"
        checked={notifications.tournamentUpdates}
        onChange={(e) =>
          setNotifications({
            ...notifications,
            tournamentUpdates: e.target.checked,
          })
        }
        className="w-5 h-5 accent-purple-600"
      />

    </label>

    {/* PAYMENT */}

    <label className="flex items-center justify-between bg-zinc-800 rounded-xl p-4 cursor-pointer">

      <div>
        <p className="font-semibold">
          💳 Payment Updates
        </p>

        <p className="text-zinc-500 text-sm mt-1">
          Get updates about payments and transactions.
        </p>
      </div>

      <input
        type="checkbox"
        checked={notifications.paymentUpdates}
        onChange={(e) =>
          setNotifications({
            ...notifications,
            paymentUpdates: e.target.checked,
          })
        }
        className="w-5 h-5 accent-purple-600"
      />

    </label>

    {/* MATCH */}

    <label className="flex items-center justify-between bg-zinc-800 rounded-xl p-4 cursor-pointer">

      <div>
        <p className="font-semibold">
          🎮 Match & Results Updates
        </p>

        <p className="text-zinc-500 text-sm mt-1">
          Get updates about matches, results and leaderboards.
        </p>
      </div>

      <input
        type="checkbox"
        checked={notifications.matchUpdates}
        onChange={(e) =>
          setNotifications({
            ...notifications,
            matchUpdates: e.target.checked,
          })
        }
        className="w-5 h-5 accent-purple-600"
      />

    </label>

    {/* SAVE */}

    <button
      onClick={saveNotificationSettings}
      disabled={savingNotifications}
      className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 px-6 py-3 rounded-xl font-bold transition"
    >
      {savingNotifications
        ? "Saving..."
        : "💾 Save Notification Settings"}
    </button>

  </div>

</div>

        {/* ACCOUNT INFORMATION */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

          <h2 className="text-2xl font-bold text-purple-400 mb-6">
            ℹ️ Account Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="bg-zinc-800 rounded-xl p-4">
              <p className="text-zinc-500 text-sm">
                Account Status
              </p>

              <p className="text-green-400 font-bold mt-1">
                Active
              </p>
            </div>

            <div className="bg-zinc-800 rounded-xl p-4">
              <p className="text-zinc-500 text-sm">
                Authentication
              </p>

              <p className="font-bold mt-1">
                Firebase
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}