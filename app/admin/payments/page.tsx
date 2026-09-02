"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Payment {
  id: string;
  teamName?: string;
  captainName?: string;
  captainEmail?: string;
  tournamentId?: string;
  tournamentName?: string;
  amount?: number;
  paymentStatus?: string;
  paymentId?: string;
  orderId?: string;
  createdAt?: any;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    failed: 0,
    revenue: 0,
  });

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const snapshot = await getDocs(
          collection(db, "registrations")
        );

        const paymentData: Payment[] = await Promise.all(
          snapshot.docs
            .filter((docSnap) => {
              const data = docSnap.data();

              return (
                data.paymentStatus !== undefined &&
                data.paymentStatus !== null
              );
            })
            .map(async (docSnap) => {
              const data = docSnap.data();

              let amount = 0;
              let tournamentName = "Unknown Tournament";

              if (data.tournamentId) {
                const tournamentRef = doc(
                  db,
                  "tournaments",
                  data.tournamentId
                );

                const tournamentSnap = await getDoc(
                  tournamentRef
                );

                if (tournamentSnap.exists()) {
                  const tournamentData =
                    tournamentSnap.data();

                  amount = Number(
                    tournamentData.entryFee || 0
                  );

                  tournamentName =
                    tournamentData.title ||
                    tournamentData.name ||
                    tournamentData.tournamentName ||
                    "Unknown Tournament";
                }
              }

              return {
                id: docSnap.id,
                ...data,
                amount,
                tournamentName,
              };
            })
        );

        setPayments(paymentData);

        const revenue = paymentData
          .filter(
            (item) => item.paymentStatus === "paid"
          )
          .reduce(
            (total, item) =>
              total + Number(item.amount || 0),
            0
          );

        setStats({
          total: paymentData.length,

          paid: paymentData.filter(
            (item) =>
              item.paymentStatus === "paid"
          ).length,

          pending: paymentData.filter(
            (item) =>
              item.paymentStatus === "pending"
          ).length,

          failed: paymentData.filter(
            (item) =>
              item.paymentStatus === "failed"
          ).length,

          revenue,
        });
      } catch (error) {
        console.error(
          "Failed to load payments:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  const formatDate = (timestamp: any) => {
    if (!timestamp) {
      return "—";
    }

    try {
      if (timestamp?.toDate) {
        return timestamp.toDate().toLocaleString(
          "en-IN",
          {
            dateStyle: "medium",
            timeStyle: "short",
          }
        );
      }

      const date = new Date(timestamp);

      if (isNaN(date.getTime())) {
        return "—";
      }

      return date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return "—";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-purple-400 text-xl">
          Loading payments...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">

      <h1 className="text-5xl font-bold text-purple-500">
        Payments
      </h1>

      <p className="text-zinc-400 mt-2">
        Manage tournament payments and transactions.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mt-10">

        <div className="bg-zinc-900 border border-purple-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold">
            Total Payments
          </h2>

          <p className="text-4xl mt-4 font-bold text-purple-400">
            {stats.total}
          </p>
        </div>

        <div className="bg-zinc-900 border border-green-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold">
            Successful
          </h2>

          <p className="text-4xl mt-4 font-bold text-green-400">
            {stats.paid}
          </p>
        </div>

        <div className="bg-zinc-900 border border-yellow-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold">
            Pending
          </h2>

          <p className="text-4xl mt-4 font-bold text-yellow-400">
            {stats.pending}
          </p>
        </div>

        <div className="bg-zinc-900 border border-red-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold">
            Failed
          </h2>

          <p className="text-4xl mt-4 font-bold text-red-400">
            {stats.failed}
          </p>
        </div>

        <div className="bg-zinc-900 border border-emerald-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold">
            Total Revenue
          </h2>

          <p className="text-4xl mt-4 font-bold text-emerald-400">
            ₹{stats.revenue.toLocaleString("en-IN")}
          </p>
        </div>

      </div>

      <div className="mt-10">

        <h2 className="text-2xl font-bold text-purple-400 mb-5">
          Payment Transactions
        </h2>

        {payments.length === 0 ? (

          <div className="bg-zinc-900 border border-purple-700 rounded-2xl p-8">
            <p className="text-zinc-400">
              No payment transactions found.
            </p>
          </div>

        ) : (

          <div className="space-y-5">

            {payments.map((payment) => (

              <div
                key={payment.id}
                className="bg-zinc-900 border border-purple-700 rounded-2xl p-6"
              >

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                  <div>

                    <h3 className="text-xl font-bold text-purple-400">
                      {payment.teamName ||
                        "Unknown Team"}
                    </h3>

                    <p className="text-green-400 font-bold text-xl mt-2">
                      ₹
                      {Number(
                        payment.amount || 0
                      ).toLocaleString("en-IN")}
                    </p>

                    <p className="text-zinc-300 mt-2">
                      👤{" "}
                      {payment.captainName ||
                        "Unknown Captain"}
                    </p>

                    <p className="text-zinc-400">
                      📧{" "}
                      {payment.captainEmail ||
                        "No Email"}
                    </p>

                  </div>

                  <div>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${
                        payment.paymentStatus ===
                        "paid"
                          ? "bg-green-600 text-white"
                          : payment.paymentStatus ===
                            "pending"
                          ? "bg-yellow-500 text-black"
                          : payment.paymentStatus ===
                            "failed"
                          ? "bg-red-600 text-white"
                          : "bg-zinc-700 text-white"
                      }`}
                    >
                      {payment.paymentStatus ||
                        "Unknown"}
                    </span>

                  </div>

                </div>

                <hr className="my-5 border-zinc-700" />

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 text-sm">

                  <div>
                    <p className="text-zinc-500">
                      Tournament
                    </p>

                    <p className="text-white mt-1 font-semibold">
                      {payment.tournamentName ||
                        "Unknown Tournament"}
                    </p>
                  </div>

                  <div>
                    <p className="text-zinc-500">
                      Payment Date
                    </p>

                    <p className="text-white mt-1">
                      {formatDate(
                        payment.createdAt
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-zinc-500">
                      Entry Fee
                    </p>

                    <p className="text-green-400 mt-1 font-semibold">
                      ₹
                      {Number(
                        payment.amount || 0
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div>
                    <p className="text-zinc-500">
                      Payment ID
                    </p>

                    <p className="text-white break-all mt-1">
                      {payment.paymentId || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-zinc-500">
                      Order ID
                    </p>

                    <p className="text-white break-all mt-1">
                      {payment.orderId || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-zinc-500">
                      Tournament ID
                    </p>

                    <p className="text-white break-all mt-1">
                      {payment.tournamentId || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-zinc-500">
                      Registration ID
                    </p>

                    <p className="text-white break-all mt-1">
                      {payment.id}
                    </p>
                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}