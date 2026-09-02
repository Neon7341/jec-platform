"use client";

import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    websiteName: "Jaipur Esports Club",
    supportEmail: "",
    contactNumber: "",
    defaultGame: "BGMI",
    defaultApproval: "Automatic",
    emailNotifications: true,
    paymentNotifications: true,
    registrationNotifications: true,
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsRef = doc(
          db,
          "settings",
          "admin"
        );

        const settingsSnap = await getDoc(
          settingsRef
        );

        if (settingsSnap.exists()) {
          const data = settingsSnap.data();

          setSettings({
            websiteName:
              data.websiteName ??
              "Jaipur Esports Club",

            supportEmail:
              data.supportEmail ?? "",

            contactNumber:
              data.contactNumber ?? "",

            defaultGame:
              data.defaultGame ?? "BGMI",

            defaultApproval:
              data.defaultApproval ??
              "Automatic",

            emailNotifications:
              data.emailNotifications ?? true,

            paymentNotifications:
              data.paymentNotifications ?? true,

            registrationNotifications:
              data.registrationNotifications ??
              true,
          });
        }
      } catch (error) {
        console.error(
          "Failed to load settings:",
          error
        );

        toast.error(
          "Failed to load settings"
        );
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setSaving(true);

      const settingsRef = doc(
        db,
        "settings",
        "admin"
      );

      await setDoc(
        settingsRef,
        {
          ...settings,
          updatedAt: new Date(),
        },
        {
          merge: true,
        }
      );

      toast.success(
        "Settings saved successfully"
      );
    } catch (error) {
      console.error(
        "Failed to save settings:",
        error
      );

      toast.error(
        "Failed to save settings"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-purple-400 text-xl">
          Loading settings...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">

      <div className="max-w-4xl">

        {/* HEADER */}

        <div className="mb-10">

          <h1 className="text-4xl md:text-5xl font-bold text-purple-500">
            Admin Settings
          </h1>

          <p className="text-zinc-400 mt-2">
            Manage your JEC website and admin preferences.
          </p>

        </div>

        <form
          onSubmit={handleSave}
          className="space-y-8"
        >

          {/* WEBSITE SETTINGS */}

          <div className="bg-zinc-900 border border-purple-700 rounded-2xl p-6">

            <h2 className="text-2xl font-bold text-purple-400 mb-6">
              🌐 Website Settings
            </h2>

            <div className="space-y-5">

              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Website Name
                </label>

                <input
                  name="websiteName"
                  value={settings.websiteName}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 outline-none focus:border-purple-500"
                  placeholder="Jaipur Esports Club"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Support Email
                </label>

                <input
                  name="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 outline-none focus:border-purple-500"
                  placeholder="support@example.com"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Contact Number
                </label>

                <input
                  name="contactNumber"
                  type="tel"
                  value={settings.contactNumber}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 outline-none focus:border-purple-500"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

            </div>
          </div>

          {/* TOURNAMENT SETTINGS */}

          <div className="bg-zinc-900 border border-purple-700 rounded-2xl p-6">

            <h2 className="text-2xl font-bold text-purple-400 mb-6">
              🏆 Tournament Defaults
            </h2>

            <div className="space-y-5">

              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Default Game
                </label>

                <select
                  name="defaultGame"
                  value={settings.defaultGame}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4"
                >
                  <option value="BGMI">
                    BGMI
                  </option>

                  <option value="Free Fire">
                    Free Fire
                  </option>

                  <option value="Valorant">
                    Valorant
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Default Approval Type
                </label>

                <select
                  name="defaultApproval"
                  value={settings.defaultApproval}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4"
                >
                  <option value="Automatic">
                    Automatic
                  </option>

                  <option value="Manual">
                    Manual
                  </option>
                </select>
              </div>

            </div>
          </div>

          {/* NOTIFICATIONS */}

          <div className="bg-zinc-900 border border-purple-700 rounded-2xl p-6">

            <h2 className="text-2xl font-bold text-purple-400 mb-6">
              🔔 Notifications
            </h2>

            <div className="space-y-5">

              <label className="flex items-center justify-between bg-zinc-800 rounded-xl p-4">

                <div>
                  <p className="font-semibold">
                    Email Notifications
                  </p>

                  <p className="text-sm text-zinc-400">
                    Receive important website notifications.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={
                    settings.emailNotifications
                  }
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      emailNotifications:
                        e.target.checked,
                    }))
                  }
                  className="w-5 h-5"
                />

              </label>

              <label className="flex items-center justify-between bg-zinc-800 rounded-xl p-4">

                <div>
                  <p className="font-semibold">
                    Payment Notifications
                  </p>

                  <p className="text-sm text-zinc-400">
                    Get notified about successful payments.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={
                    settings.paymentNotifications
                  }
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      paymentNotifications:
                        e.target.checked,
                    }))
                  }
                  className="w-5 h-5"
                />

              </label>

              <label className="flex items-center justify-between bg-zinc-800 rounded-xl p-4">

                <div>
                  <p className="font-semibold">
                    Registration Notifications
                  </p>

                  <p className="text-sm text-zinc-400">
                    Get notified when teams register.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={
                    settings.registrationNotifications
                  }
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      registrationNotifications:
                        e.target.checked,
                    }))
                  }
                  className="w-5 h-5"
                />

              </label>

            </div>
          </div>

          {/* SECURITY */}

          <div className="bg-zinc-900 border border-red-700 rounded-2xl p-6">

            <h2 className="text-2xl font-bold text-red-400 mb-4">
              🔐 Security
            </h2>

            <p className="text-zinc-400">
              Keep your admin account secure. Never store
              Razorpay secret keys, Firebase private keys,
              or other server secrets in this page.
            </p>

          </div>

          {/* SAVE */}

          <button
            type="submit"
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 px-8 py-4 rounded-xl font-bold text-lg"
          >
            {saving
              ? "Saving..."
              : "Save Settings"}
          </button>

        </form>
      </div>
    </div>
  );
}