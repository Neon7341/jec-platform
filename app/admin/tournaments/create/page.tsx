"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function CreateTournamentPage() {
  const [unlimitedSlots, setUnlimitedSlots] = useState(false);

  const [form, setForm] = useState({
    title: "",
    game: "BGMI",
    prizePool: "",
    entryFee: "",
    mode: "Paid",
    approvalType: "Automatic",
    slots: "",
    date: "",
    status: "Registration Open",
  });

  const handleSubmit = async () => {
    if (
      !form.title ||
      !form.prizePool ||
      !form.entryFee ||
      (!unlimitedSlots && !form.slots) ||
      !form.date
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, "tournaments"), {
        title: form.title,
        game: form.game,
        prizePool: form.prizePool,
        entryFee: form.entryFee,
        mode: form.mode,
        approvalType: form.approvalType,
        slots: unlimitedSlots ? null : Number(form.slots),
        unlimitedSlots: unlimitedSlots,
        registeredTeams: 0,
        date: form.date,
        status: form.status,
        createdAt: serverTimestamp(),
      });

      toast.success("Tournament Created Successfully!");

      setForm({
        title: "",
        game: "BGMI",
        prizePool: "",
        entryFee: "",
        mode: "Paid",
        approvalType: "Automatic",
        slots: "",
        date: "",
        status: "Registration Open",
      });

      setUnlimitedSlots(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create tournament");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-purple-500 mb-8">
        Create Tournament
      </h1>

      <div className="bg-zinc-900 border border-purple-700 rounded-2xl p-8 space-y-6">
        <input
          placeholder="Tournament Name"
          className="w-full p-3 rounded-xl bg-zinc-800 text-white"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <select
          className="w-full p-3 rounded-xl bg-zinc-800 text-white"
          value={form.game}
          onChange={(e) =>
            setForm({ ...form, game: e.target.value })
          }
        >
          <option>BGMI</option>
          <option>Free Fire</option>
          <option>Valorant</option>
        </select>

        <input
          placeholder="Prize Pool"
          className="w-full p-3 rounded-xl bg-zinc-800 text-white"
          value={form.prizePool}
          onChange={(e) =>
            setForm({ ...form, prizePool: e.target.value })
          }
        />

        <input
          placeholder="Entry Fee"
          className="w-full p-3 rounded-xl bg-zinc-800 text-white"
          value={form.entryFee}
          onChange={(e) =>
            setForm({ ...form, entryFee: e.target.value })
          }
        />

        <select
          className="w-full p-3 rounded-xl bg-zinc-800 text-white"
          value={form.mode}
          onChange={(e) =>
            setForm({ ...form, mode: e.target.value })
          }
        >
          <option>Paid</option>
          <option>Free</option>
        </select>

        <select
          className="w-full p-3 rounded-xl bg-zinc-800 text-white"
          value={form.approvalType}
          onChange={(e) =>
            setForm({
              ...form,
              approvalType: e.target.value,
            })
          }
        >
          <option>Automatic</option>
          <option>Manual</option>
        </select>

        <div className="space-y-4">
          <label className="font-semibold text-lg">
            Team Slots
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={unlimitedSlots}
              onChange={(e) =>
                setUnlimitedSlots(e.target.checked)
              }
              className="w-5 h-5"
            />

            Unlimited Teams
          </label>

          {!unlimitedSlots && (
            <input
              placeholder="Total Slots"
              type="number"
              className="w-full p-3 rounded-xl bg-zinc-800 text-white"
              value={form.slots}
              onChange={(e) =>
                setForm({
                  ...form,
                  slots: e.target.value,
                })
              }
            />
          )}
        </div>

        <input
          type="date"
          className="w-full p-3 rounded-xl bg-zinc-800 text-white"
          value={form.date}
          onChange={(e) =>
            setForm({ ...form, date: e.target.value })
          }
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-xl font-bold text-lg"
        >
          Create Tournament
        </button>
      </div>
    </div>
  );
}