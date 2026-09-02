"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  FaGamepad,
  FaUsers,
  FaUserShield,
  FaCheckCircle,
} from "react-icons/fa";

import { auth, db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  increment,
  getDoc,
} from "firebase/firestore";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RegisterTournamentPage() {
  const params = useParams();
const tournamentId = params.id as string;
const [tournament, setTournament] = useState<any>(null);
const [tournamentFull, setTournamentFull] = useState(false);
const [game, setGame] = useState("");
useEffect(() => {
  const fetchTournament = async () => {
    const tournamentRef = doc(db, "tournaments", tournamentId);
    const tournamentSnap = await getDoc(tournamentRef);
if (tournamentSnap.exists()) {
  const data = tournamentSnap.data();

  setGame(data.game);
  setTournament(data);

  if (
    data.unlimitedSlots !== true &&
    data.slots != null &&
    (data.registeredTeams ?? 0) >= data.slots
  ) {
    setTournamentFull(true);
  } else {
    setTournamentFull(false);
  }
}
  };

  fetchTournament();
}, [tournamentId]);

const uidLabel =
  game.toLowerCase() === "valorant"
    ? "Riot ID"
    : game.toLowerCase() === "free fire"
    ? "Free Fire UID"
    : "BGMI UID";
  const [loading, setLoading] = useState(false);

 const [form, setForm] = useState({
    teamName: "",

    captainName: "",
    captainEmail: "",
    captainPhone: "",
    captainUID: "",

    player2Name: "",
    player2UID: "",

    player3Name: "",
    player3UID: "",

    player4Name: "",
    player4UID: "",

    // Only used for Valorant
    player5Name: "",
    player5UID: "",

    substituteName: "",
    substituteUID: "",

    agree: false,
});

  const handleSubmit = async () => {
    if (tournamentFull) {
  toast.error("This tournament is full");
  return;
}

    if (
      tournament &&
      !tournament.unlimitedSlots &&
      tournament.registeredTeams >= tournament.slots
    ) {
      toast.error("Tournament is Full");
      return;
    }

    if (!form.teamName) {
      toast.error("Enter Team Name");
      return;
    }

    if (!form.captainName) {
      toast.error("Enter Captain Name");
      return;
    }

    if (!form.captainEmail) {
      toast.error("Enter Captain Email");
      return;
    }

    if (!form.captainPhone) {
      toast.error("Enter Phone Number");
      return;
    }

    if (!form.captainUID) {
      toast.error(`Enter Captain ${uidLabel}`);
      return;
    }

    if (!form.player2Name || !form.player2UID) {
      toast.error("Fill Player 2 Details");
      return;
    }

    if (!form.player3Name || !form.player3UID) {
      toast.error("Fill Player 3 Details");
      return;
    }

    if (!form.player4Name || !form.player4UID) {
      toast.error("Fill Player 4 Details");
      return;
    }

    if (
      game.toLowerCase() === "valorant" &&
      (!form.player5Name || !form.player5UID)
    ) {
      toast.error("Fill Player 5 Details");
      return;
    }

    if (!form.agree) {
      toast.error("Accept Tournament Rules");
      return;
    }

    setLoading(true);

    try {
      const q = query(
        collection(db, "registrations"),
        where("tournamentId", "==", tournamentId),
        where("teamName", "==", form.teamName)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        toast.error("This team is already registered for this tournament.");
        setLoading(false);
        return;
      }

      const saveRegistration = async (
        paymentStatus: string,
        paymentId = "",
        orderId = ""
      ) => {
        const registrationStatus =
          tournament.approvalType === "Manual"
            ? "pending"
            : tournament.mode === "Free"
              ? "approved"
              : "approved";

        await addDoc(collection(db, "registrations"), {
          userId: auth.currentUser?.uid || "",
          tournamentId,

          teamName: form.teamName,
          captainName: form.captainName,
          captainEmail: form.captainEmail,
          captainPhone: form.captainPhone,
          captainUID: form.captainUID,
          captainAuthUID: auth.currentUser?.uid || "",

          player2Name: form.player2Name,
          player2UID: form.player2UID,

          player3Name: form.player3Name,
          player3UID: form.player3UID,

          player4Name: form.player4Name,
          player4UID: form.player4UID,

          player5Name:
            game.toLowerCase() === "valorant"
              ? form.player5Name
              : "",

          player5UID:
            game.toLowerCase() === "valorant"
              ? form.player5UID
              : "",

          substituteName: form.substituteName,
          substituteUID: form.substituteUID,

          registrationStatus,
          paymentStatus,
          paymentId,
          orderId,
          createdAt: serverTimestamp(),
        });

        const tournamentRef = doc(db, "tournaments", tournamentId);

        await updateDoc(tournamentRef, {
          registeredTeams: increment(1),
        });
      };

      // FREE TOURNAMENT
      if (tournament.mode === "Free") {
        await saveRegistration("free");

        toast.success(
          tournament.approvalType === "Manual"
            ? "Registration Submitted! Waiting for Approval."
            : "Registration Successful!"
        );

        return;
      }

      // PAID TOURNAMENT - CREATE RAZORPAY ORDER
      const amount = Number(tournament.entryFee);

      if (!amount || amount <= 0) {
        toast.error("Invalid tournament entry fee");
        return;
      }

      const orderResponse = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.error || "Failed to create payment order");
      }

      // Load Razorpay Checkout
      if (!(window as any).Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve();
          script.onerror = () =>
            reject(new Error("Failed to load Razorpay"));
          document.body.appendChild(script);
        });
      }

      const Razorpay = (window as any).Razorpay;

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Jaipur Esports Club",
        description: tournament.title,
        order_id: orderData.orderId,

        prefill: {
          name: form.captainName,
          email: form.captainEmail,
          contact: form.captainPhone,
        },

        theme: {
          color: "#9333EA",
        },

        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch(
              "/api/razorpay/verify-payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok || !verifyData.verified) {
              toast.error("Payment verification failed");
              setLoading(false);
              return;
            }

            await saveRegistration(
              "paid",
              response.razorpay_payment_id,
              response.razorpay_order_id
            );

            toast.success(
              tournament.approvalType === "Manual"
                ? "Payment Successful! Registration Waiting for Approval."
                : "Payment Successful! Registration Approved."
            );
          } catch (error) {
            console.error(error);
            toast.error(
              "Payment received, but registration could not be completed. Contact admin."
            );
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error("Payment Cancelled");
          },
        },
      };

      const razorpay = new Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
      toast.error("Registration Failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-10">

      <div className="max-w-5xl mx-auto px-5">

        <div className="bg-gradient-to-r from-purple-900 to-zinc-900 rounded-3xl p-8 border border-purple-700">

          <h1 className="text-5xl font-bold">
            Tournament Registration
          </h1>

          <p className="text-zinc-300 mt-3">
            Complete your registration carefully.
          </p>

        </div>

        <div className="mt-10 bg-zinc-900 rounded-3xl border border-purple-700 p-8">

          <div className="flex items-center gap-3 mb-6">

            <FaGamepad className="text-purple-500 text-2xl" />

            <h2 className="text-3xl font-bold">
              Team Information
            </h2>

          </div>

          <input
            className="w-full bg-zinc-800 rounded-xl p-4 outline-none"
            placeholder="Team Name"
            value={form.teamName}
            onChange={(e) =>
              setForm({
                ...form,
                teamName: e.target.value,
              })
            }
          />

        </div>

        <div className="mt-8 bg-zinc-900 rounded-3xl border border-purple-700 p-8">

          <div className="flex items-center gap-3 mb-6">

            <FaUserShield className="text-purple-500 text-2xl" />

            <h2 className="text-3xl font-bold">
              Captain Details
            </h2>

          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <input
              className="bg-zinc-800 rounded-xl p-4"
              placeholder="Captain Name"
              value={form.captainName}
              onChange={(e) =>
                setForm({
                  ...form,
                  captainName: e.target.value,
                })
              }
            />

            <input
              className="bg-zinc-800 rounded-xl p-4"
              placeholder="Captain Email"
              value={form.captainEmail}
              onChange={(e) =>
                setForm({
                  ...form,
                  captainEmail: e.target.value,
                })
              }
            />

            <input
              className="bg-zinc-800 rounded-xl p-4"
              placeholder="Phone Number"
              value={form.captainPhone}
              onChange={(e) =>
                setForm({
                  ...form,
                  captainPhone: e.target.value,
                })
              }
            />

            <input
              className="bg-zinc-800 rounded-xl p-4"
              placeholder={`Captain ${uidLabel}`}
              value={form.captainUID}
              onChange={(e) =>
                setForm({
                  ...form,
                  captainUID: e.target.value,
                })
              }
            />

          </div>

        </div>

        <div className="mt-8 bg-zinc-900 rounded-3xl border border-purple-700 p-8">

          <div className="flex items-center gap-3 mb-6">

            <FaUsers className="text-purple-500 text-2xl" />

            <h2 className="text-3xl font-bold">
              Player 2
            </h2>

          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <input
              className="bg-zinc-800 rounded-xl p-4"
              placeholder="Player 2 Name"
              value={form.player2Name}
              onChange={(e) =>
                setForm({
                  ...form,
                  player2Name: e.target.value,
                })
              }
            />

            <input
              className="bg-zinc-800 rounded-xl p-4"
              placeholder={`Player 2 ${uidLabel}`}
              value={form.player2UID}
              onChange={(e) =>
                setForm({
                  ...form,
                  player2UID: e.target.value,
                })
              }
            />

          </div>

        </div>
                <div className="mt-8 bg-zinc-900 rounded-3xl border border-purple-700 p-8">

          <div className="flex items-center gap-3 mb-6">

            <FaUsers className="text-purple-500 text-2xl" />

            <h2 className="text-3xl font-bold">
              Player 3
            </h2>

          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <input
              className="bg-zinc-800 rounded-xl p-4"
              placeholder="Player 3 Name"
              value={form.player3Name}
              onChange={(e) =>
                setForm({
                  ...form,
                  player3Name: e.target.value,
                })
              }
            />

            <input
              className="bg-zinc-800 rounded-xl p-4"
              placeholder={`Player 3 ${uidLabel}`}
              value={form.player3UID}
              onChange={(e) =>
                setForm({
                  ...form,
                  player3UID: e.target.value,
                })
              }
            />

          </div>

        </div>

        <div className="mt-8 bg-zinc-900 rounded-3xl border border-purple-700 p-8">

          <div className="flex items-center gap-3 mb-6">

            <FaUsers className="text-purple-500 text-2xl" />

            <h2 className="text-3xl font-bold">
              Player 4
            </h2>

          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <input
              className="bg-zinc-800 rounded-xl p-4"
              placeholder="Player 4 Name"
              value={form.player4Name}
              onChange={(e) =>
                setForm({
                  ...form,
                  player4Name: e.target.value,
                })
              }
            />

            <input
              className="bg-zinc-800 rounded-xl p-4"
              placeholder={`Player 4   ${uidLabel}`}
              value={form.player4UID}
              onChange={(e) =>
                setForm({
                  ...form,
                  player4UID: e.target.value,
                })
              }
            />

          </div>

        </div>

        {game.toLowerCase() === "valorant" && (
  <div className="mt-8 bg-zinc-900 rounded-3xl border border-purple-700 p-8">

    <div className="flex items-center gap-3 mb-6">

      <FaUsers className="text-purple-500 text-2xl" />

      <h2 className="text-3xl font-bold">
        Player 5
      </h2>

    </div>

    <div className="grid md:grid-cols-2 gap-5">

      <input
        className="bg-zinc-800 rounded-xl p-4"
        placeholder="Player 5 Name"
        value={form.player5Name}
        onChange={(e) =>
          setForm({
            ...form,
            player5Name: e.target.value,
          })
        }
      />

      <input
        className="bg-zinc-800 rounded-xl p-4"
        placeholder={`Player 5 ${uidLabel}`}
        value={form.player5UID}
        onChange={(e) =>
          setForm({
            ...form,
            player5UID: e.target.value,
          })
        }
      />

    </div>

  </div>
)}

        <div className="mt-8 bg-zinc-900 rounded-3xl border border-purple-700 p-8">

          <div className="flex items-center gap-3 mb-6">

            <FaUsers className="text-purple-500 text-2xl" />

            <h2 className="text-3xl font-bold">
              Substitute (Optional)
            </h2>

          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <input
              className="bg-zinc-800 rounded-xl p-4"
              placeholder="Substitute Name"
              value={form.substituteName}
              onChange={(e) =>
                setForm({
                  ...form,
                  substituteName: e.target.value,
                })
              }
            />

            <input
              className="bg-zinc-800 rounded-xl p-4"
              placeholder={`Substitute ${uidLabel}`}
              value={form.substituteUID}
              onChange={(e) =>
                setForm({
                  ...form,
                  substituteUID: e.target.value,
                })
              }
            />

          </div>

        </div>

        <div className="mt-8 bg-zinc-900 rounded-3xl border border-purple-700 p-8">

          <label className="flex items-center gap-4 cursor-pointer">

            <input
              type="checkbox"
              checked={form.agree}
              onChange={(e) =>
                setForm({
                  ...form,
                  agree: e.target.checked,
                })
              }
              className="w-5 h-5"
            />

            <span className="text-lg">
              I agree to all Tournament Rules & Conditions.
            </span>

          </label>

          <button
            onClick={handleSubmit}
           disabled={loading || tournamentFull}
           className={`mt-8 w-full transition py-4 rounded-xl text-xl font-bold flex items-center justify-center gap-3 ${
  tournamentFull
    ? "bg-gray-600 cursor-not-allowed"
    : "bg-purple-600 hover:bg-purple-700"
} disabled:opacity-60`}
          >
            <FaCheckCircle />

           {loading
  ? "Processing..."
  : tournamentFull
  ? "Tournament Full"
  : tournament?.mode === "Paid"
  ? "Continue to Payment"
  : "Complete Registration"}
          </button>

        </div>

      </div>
    </div>
  );
}