"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function EditTournamentPage() {
  const params = useParams();
  const router = useRouter();

  const tournamentId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    game: "BGMI",
    prizePool: "",
    entryFee: "",
    slots: "",
    unlimitedSlots: false,
    date: "",
    status: "Registration Open",
    approvalType: "Automatic",
  });

  useEffect(() => {
    const loadTournament = async () => {
      try {
        const tournamentRef = doc(
          db,
          "tournaments",
          tournamentId
        );

        const tournamentSnap = await getDoc(
          tournamentRef
        );

        if (!tournamentSnap.exists()) {
          toast.error("Tournament not found");
          router.push("/admin/tournaments");
          return;
        }

        const data = tournamentSnap.data();

        setForm({
          title: data.title || "",
          game: data.game || "BGMI",
          prizePool: String(data.prizePool ?? ""),
          entryFee: String(data.entryFee ?? ""),
          slots: String(data.slots ?? ""),
          unlimitedSlots: data.unlimitedSlots ?? false,
          date: data.date || "",
          status: data.status || "Registration Open",
          approvalType: data.approvalType || "Automatic",
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load tournament");
      } finally {
        setLoading(false);
      }
    };

    if (tournamentId) {
      loadTournament();
    }
  }, [tournamentId, router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Tournament title is required");
      return;
    }

    if (!form.game) {
      toast.error("Please select a game");
      return;
    }

    if (!form.entryFee) {
      toast.error("Entry fee is required");
      return;
    }

    if (!form.unlimitedSlots && !form.slots) {
      toast.error("Please enter tournament slots");
      return;
    }

    try {
      setSaving(true);

      const tournamentRef = doc(
        db,
        "tournaments",
        tournamentId
      );

      await updateDoc(tournamentRef, {
        title: form.title.trim(),
        game: form.game,
        prizePool: Number(form.prizePool || 0),
        entryFee: Number(form.entryFee || 0),
        slots: form.unlimitedSlots
          ? null
          : Number(form.slots || 0),
        unlimitedSlots: form.unlimitedSlots,
        date: form.date,
        status: form.status,
        approvalType: form.approvalType,
      });

      toast.success(
        "Tournament updated successfully"
      );

      router.push("/admin/tournaments");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update tournament");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-purple-400 text-xl">
          Loading tournament...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold text-purple-500">
          Edit Tournament
        </h1>

        <p className="text-zinc-400 mt-2 mb-8">
          Update your tournament information.
        </p>

        <form
          onSubmit={handleSave}
          className="bg-zinc-900 border border-purple-700 rounded-2xl p-6 space-y-6"
        >

          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              Tournament Name
            </label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full bg-zinc-800 rounded-xl p-4 outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Tournament Name"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              Game
            </label>

            <select
              name="game"
              value={form.game}
              onChange={handleChange}
              className="w-full bg-zinc-800 rounded-xl p-4"
            >
              <option value="BGMI">BGMI</option>
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
              Prize Pool
            </label>

            <input
              name="prizePool"
              type="number"
              value={form.prizePool}
              onChange={handleChange}
              className="w-full bg-zinc-800 rounded-xl p-4"
              placeholder="10000"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              Entry Fee
            </label>

            <input
              name="entryFee"
              type="number"
              value={form.entryFee}
              onChange={handleChange}
              className="w-full bg-zinc-800 rounded-xl p-4"
              placeholder="349"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.unlimitedSlots}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  unlimitedSlots: e.target.checked,
                }))
              }
              className="w-5 h-5"
            />

            <label>
              Unlimited Slots
            </label>
          </div>

          {!form.unlimitedSlots && (
            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Number of Slots
              </label>

              <input
                name="slots"
                type="number"
                value={form.slots}
                onChange={handleChange}
                className="w-full bg-zinc-800 rounded-xl p-4"
                placeholder="25"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              Tournament Date
            </label>

            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="w-full bg-zinc-800 rounded-xl p-4"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              Tournament Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full bg-zinc-800 rounded-xl p-4"
            >
              <option value="Registration Open">
                Registration Open
              </option>

              <option value="Registration Closed">
                Registration Closed
              </option>

              <option value="Upcoming">
                Upcoming
              </option>

              <option value="Live">
                Live
              </option>

              <option value="Completed">
                Completed
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              Approval Type
            </label>

            <select
              name="approvalType"
              value={form.approvalType}
              onChange={handleChange}
              className="w-full bg-zinc-800 rounded-xl p-4"
            >
              <option value="Automatic">
                Automatic
              </option>

              <option value="Manual">
                Manual
              </option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">

            <button
              type="button"
              onClick={() =>
                router.push("/admin/tournaments")
              }
              className="flex-1 bg-zinc-700 hover:bg-zinc-600 px-5 py-3 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl font-bold disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}