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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const tournamentRef = doc(
          db,
          "tournaments",
          tournamentId
        );

        const tournamentSnap = await getDoc(
          tournamentRef
        );

        if (tournamentSnap.exists()) {
          const data = tournamentSnap.data();

          setGame(data.game || "");
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
      } catch (error) {
        console.error(
          "Failed to load tournament:",
          error
        );

        toast.error(
          "Failed to load tournament"
        );
      }
    };

    if (tournamentId) {
      fetchTournament();
    }
  }, [tournamentId]);

  const uidLabel =
    game.toLowerCase() === "valorant"
      ? "Riot ID"
      : game.toLowerCase() === "free fire"
      ? "Free Fire UID"
      : "BGMI UID";

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
        where(
          "tournamentId",
          "==",
          tournamentId
        ),
        where(
          "teamName",
          "==",
          form.teamName
        )
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        toast.error(
          "This team is already registered for this tournament."
        );

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

        await addDoc(
          collection(db, "registrations"),
          {
            userId:
              auth.currentUser?.uid || "",

            tournamentId,

            teamName: form.teamName,

            captainName:
              form.captainName,

            captainEmail:
              form.captainEmail,

            captainPhone:
              form.captainPhone,

            captainUID:
              form.captainUID,

            captainAuthUID:
              auth.currentUser?.uid || "",

            player2Name:
              form.player2Name,

            player2UID:
              form.player2UID,

            player3Name:
              form.player3Name,

            player3UID:
              form.player3UID,

            player4Name:
              form.player4Name,

            player4UID:
              form.player4UID,

            player5Name:
              game.toLowerCase() ===
              "valorant"
                ? form.player5Name
                : "",

            player5UID:
              game.toLowerCase() ===
              "valorant"
                ? form.player5UID
                : "",

            substituteName:
              form.substituteName,

            substituteUID:
              form.substituteUID,

            registrationStatus,

            paymentStatus,

            paymentId,

            orderId,

            createdAt:
              serverTimestamp(),
          }
        );

        const tournamentRef = doc(
          db,
          "tournaments",
          tournamentId
        );

        await updateDoc(
          tournamentRef,
          {
            registeredTeams:
              increment(1),
          }
        );
      };

      // FREE TOURNAMENT
      if (tournament.mode === "Free") {
        await saveRegistration("free");

        toast.success(
          tournament.approvalType ===
            "Manual"
            ? "Registration Submitted! Waiting for Approval."
            : "Registration Successful!"
        );

        return;
      }

      // PAID TOURNAMENT
      const amount = Number(
        tournament.entryFee
      );

      if (!amount || amount <= 0) {
        toast.error(
          "Invalid tournament entry fee"
        );

        setLoading(false);
        return;
      }

      const orderResponse = await fetch(
        "/api/razorpay/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            amount,
          }),
        }
      );

      const orderData =
        await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(
          orderData.error ||
            "Failed to create payment order"
        );
      }

      // LOAD RAZORPAY
      if (!(window as any).Razorpay) {
        await new Promise<void>(
          (resolve, reject) => {
            const script =
              document.createElement(
                "script"
              );

            script.src =
              "https://checkout.razorpay.com/v1/checkout.js";

            script.onload = () =>
              resolve();

            script.onerror = () =>
              reject(
                new Error(
                  "Failed to load Razorpay"
                )
              );

            document.body.appendChild(
              script
            );
          }
        );
      }

      const Razorpay =
        (window as any).Razorpay;

      const options = {
        key: orderData.keyId,

        amount:
          orderData.amount,

        currency:
          orderData.currency,

        name:
          "Jaipur Esports Club",

        description:
          tournament.title,

        order_id:
          orderData.orderId,

        prefill: {
          name:
            form.captainName,

          email:
            form.captainEmail,

          contact:
            form.captainPhone,
        },

        theme: {
          color: "#9333EA",
        },

        handler: async (
          response: any
        ) => {
          try {
            const verifyResponse =
              await fetch(
                "/api/razorpay/verify-payment",
                {
                  method: "POST",

                  headers: {
                    "Content-Type":
                      "application/json",
                  },

                  body: JSON.stringify({
                    razorpay_order_id:
                      response.razorpay_order_id,

                    razorpay_payment_id:
                      response.razorpay_payment_id,

                    razorpay_signature:
                      response.razorpay_signature,
                  }),
                }
              );

            const verifyData =
              await verifyResponse.json();

            if (
              !verifyResponse.ok ||
              !verifyData.verified
            ) {
              toast.error(
                "Payment verification failed"
              );

              setLoading(false);
              return;
            }

            await saveRegistration(
              "paid",
              response.razorpay_payment_id,
              response.razorpay_order_id
            );

            toast.success(
              tournament.approvalType ===
                "Manual"
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

            toast.error(
              "Payment Cancelled"
            );
          },
        },
      };

      const razorpay =
        new Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.error(error);

      toast.error(
        "Registration Failed"
      );

      setLoading(false);
    }
  };

  const updateField = (
    field: string,
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white">

      <div className="
        w-full
        max-w-5xl
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        py-4
        sm:py-6
        lg:py-10
      ">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="
          relative
          overflow-hidden
          bg-gradient-to-br
          from-purple-950
          via-zinc-900
          to-black
          rounded-2xl
          sm:rounded-3xl
          p-5
          sm:p-8
          border
          border-purple-700/60
        ">

          <div className="
            absolute
            -top-20
            -right-20
            w-48
            h-48
            sm:w-72
            sm:h-72
            bg-purple-600/20
            blur-[70px]
            rounded-full
          " />

          <div className="relative">

            <div className="
              inline-flex
              items-center
              gap-2
              px-3
              py-1.5
              rounded-full
              bg-purple-600/20
              border
              border-purple-500/30
              text-purple-300
              text-xs
              sm:text-sm
              font-semibold
              mb-3
            ">
              <FaGamepad />
              {game || "Tournament"}
            </div>

            <h1 className="
              text-2xl
              sm:text-4xl
              lg:text-5xl
              font-black
              leading-tight
            ">
              Tournament Registration
            </h1>

            <p className="
              text-zinc-400
              text-sm
              sm:text-base
              mt-2
            ">
              Complete your registration carefully.
            </p>

            {tournament && (
              <div className="
                flex
                flex-wrap
                gap-2
                mt-5
              ">

                {tournament.entryFee && (
                  <span className="
                    px-3
                    py-1.5
                    rounded-full
                    bg-black/40
                    border
                    border-zinc-700
                    text-xs
                    sm:text-sm
                  ">
                    💳 Entry:{" "}
                    {tournament.mode ===
                    "Free"
                      ? "FREE"
                      : `₹${Number(
                          tournament.entryFee
                        ).toLocaleString(
                          "en-IN"
                        )}`}
                  </span>
                )}

                {tournament.slots && (
                  <span className="
                    px-3
                    py-1.5
                    rounded-full
                    bg-black/40
                    border
                    border-zinc-700
                    text-xs
                    sm:text-sm
                  ">
                    👥{" "}
                    {tournament.registeredTeams ??
                      0}
                    /
                    {tournament.slots}
                  </span>
                )}

              </div>
            )}

          </div>

        </div>

        {/* ==========================================
            TEAM INFORMATION
        ========================================== */}

        <div className="
          mt-5
          sm:mt-8
          bg-zinc-900
          rounded-2xl
          sm:rounded-3xl
          border
          border-purple-700/50
          p-4
          sm:p-6
          lg:p-8
        ">

          <SectionTitle
            icon={<FaGamepad />}
            title="Team Information"
          />

          <input
            className="
              w-full
              bg-zinc-800
              border
              border-zinc-700
              focus:border-purple-500
              focus:ring-1
              focus:ring-purple-500
              rounded-xl
              p-3.5
              sm:p-4
              outline-none
              text-sm
              sm:text-base
              transition
            "
            placeholder="Team Name"
            value={form.teamName}
            onChange={(e) =>
              updateField(
                "teamName",
                e.target.value
              )
            }
          />

        </div>

        {/* ==========================================
            CAPTAIN
        ========================================== */}

        <div className="
          mt-4
          sm:mt-6
          bg-zinc-900
          rounded-2xl
          sm:rounded-3xl
          border
          border-purple-700/50
          p-4
          sm:p-6
          lg:p-8
        ">

          <SectionTitle
            icon={<FaUserShield />}
            title="Captain Details"
          />

          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            gap-3
            sm:gap-5
          ">

            <Input
              placeholder="Captain Name"
              value={form.captainName}
              onChange={(value) =>
                updateField(
                  "captainName",
                  value
                )
              }
            />

            <Input
              type="email"
              placeholder="Captain Email"
              value={form.captainEmail}
              onChange={(value) =>
                updateField(
                  "captainEmail",
                  value
                )
              }
            />

            <Input
              type="tel"
              placeholder="Phone Number"
              value={form.captainPhone}
              onChange={(value) =>
                updateField(
                  "captainPhone",
                  value
                )
              }
            />

            <Input
              placeholder={`Captain ${uidLabel}`}
              value={form.captainUID}
              onChange={(value) =>
                updateField(
                  "captainUID",
                  value
                )
              }
            />

          </div>

        </div>

        {/* ==========================================
            PLAYER 2
        ========================================== */}

        <PlayerCard
          number={2}
          name={form.player2Name}
          uid={form.player2UID}
          uidLabel={uidLabel}
          onNameChange={(value) =>
            updateField(
              "player2Name",
              value
            )
          }
          onUIDChange={(value) =>
            updateField(
              "player2UID",
              value
            )
          }
        />

        {/* ==========================================
            PLAYER 3
        ========================================== */}

        <PlayerCard
          number={3}
          name={form.player3Name}
          uid={form.player3UID}
          uidLabel={uidLabel}
          onNameChange={(value) =>
            updateField(
              "player3Name",
              value
            )
          }
          onUIDChange={(value) =>
            updateField(
              "player3UID",
              value
            )
          }
        />

        {/* ==========================================
            PLAYER 4
        ========================================== */}

        <PlayerCard
          number={4}
          name={form.player4Name}
          uid={form.player4UID}
          uidLabel={uidLabel}
          onNameChange={(value) =>
            updateField(
              "player4Name",
              value
            )
          }
          onUIDChange={(value) =>
            updateField(
              "player4UID",
              value
            )
          }
        />

        {/* ==========================================
            PLAYER 5 - VALORANT ONLY
        ========================================== */}

        {game.toLowerCase() ===
          "valorant" && (
          <PlayerCard
            number={5}
            name={form.player5Name}
            uid={form.player5UID}
            uidLabel={uidLabel}
            onNameChange={(value) =>
              updateField(
                "player5Name",
                value
              )
            }
            onUIDChange={(value) =>
              updateField(
                "player5UID",
                value
              )
            }
          />
        )}

        {/* ==========================================
            SUBSTITUTE
        ========================================== */}

        <div className="
          mt-4
          sm:mt-6
          bg-zinc-900
          rounded-2xl
          sm:rounded-3xl
          border
          border-purple-700/50
          p-4
          sm:p-6
          lg:p-8
        ">

          <SectionTitle
            icon={<FaUsers />}
            title="Substitute (Optional)"
          />

          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            gap-3
            sm:gap-5
          ">

            <Input
              placeholder="Substitute Name"
              value={form.substituteName}
              onChange={(value) =>
                updateField(
                  "substituteName",
                  value
                )
              }
            />

            <Input
              placeholder={`Substitute ${uidLabel}`}
              value={form.substituteUID}
              onChange={(value) =>
                updateField(
                  "substituteUID",
                  value
                )
              }
            />

          </div>

        </div>

        {/* ==========================================
            RULES + SUBMIT
        ========================================== */}

        <div className="
          mt-4
          sm:mt-6
          bg-zinc-900
          rounded-2xl
          sm:rounded-3xl
          border
          border-purple-700/50
          p-4
          sm:p-6
          lg:p-8
        ">

          <label className="
            flex
            items-start
            gap-3
            cursor-pointer
          ">

            <input
              type="checkbox"
              checked={form.agree}
              onChange={(e) =>
                updateField(
                  "agree",
                  e.target.checked
                )
              }
              className="
                w-5
                h-5
                mt-0.5
                shrink-0
                accent-purple-600
              "
            />

            <span className="
              text-sm
              sm:text-base
              text-zinc-300
              leading-relaxed
            ">
              I agree to all Tournament Rules
              & Conditions.
            </span>

          </label>

          {/* PAYMENT INFO */}

          {tournament &&
            tournament.mode === "Paid" && (
              <div className="
                mt-5
                p-3.5
                sm:p-4
                rounded-xl
                bg-purple-600/10
                border
                border-purple-500/20
              ">

                <p className="
                  text-xs
                  sm:text-sm
                  text-purple-300
                ">
                  🔒 Secure Payment
                </p>

                <p className="
                  text-[11px]
                  sm:text-xs
                  text-zinc-500
                  mt-1
                ">
                  You will be redirected to
                  Razorpay Checkout to complete
                  your payment.
                </p>

              </div>
            )}

          <button
            onClick={handleSubmit}
            disabled={
              loading ||
              tournamentFull
            }
            className={`
              mt-5
              w-full
              transition-all
              py-3.5
              sm:py-4
              rounded-xl
              text-base
              sm:text-lg
              font-bold
              flex
              items-center
              justify-center
              gap-3
              active:scale-[0.98]
              ${
                tournamentFull
                  ? "bg-zinc-700 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 shadow-[0_0_25px_rgba(124,58,237,0.2)]"
              }
              disabled:opacity-60
            `}
          >

            <FaCheckCircle />

            {loading
              ? "Processing..."
              : tournamentFull
              ? "Tournament Full"
              : tournament?.mode ===
                "Paid"
              ? "Continue to Payment"
              : "Complete Registration"}

          </button>

        </div>

        <div className="h-6 sm:h-10" />

      </div>
    </div>
  );
}

/* ==================================================
   SECTION TITLE
================================================== */

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="
      flex
      items-center
      gap-3
      mb-4
      sm:mb-6
    ">

      <div className="
        w-9
        h-9
        sm:w-10
        sm:h-10
        shrink-0
        rounded-xl
        bg-purple-600/15
        border
        border-purple-500/20
        flex
        items-center
        justify-center
        text-purple-500
      ">
        {icon}
      </div>

      <h2 className="
        text-lg
        sm:text-2xl
        lg:text-3xl
        font-bold
      ">
        {title}
      </h2>

    </div>
  );
}

/* ==================================================
   INPUT
================================================== */

function Input({
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      className="
        w-full
        bg-zinc-800
        border
        border-zinc-700
        focus:border-purple-500
        focus:ring-1
        focus:ring-purple-500
        rounded-xl
        p-3.5
        sm:p-4
        outline-none
        text-sm
        sm:text-base
        transition
      "
      placeholder={placeholder}
      value={value}
      onChange={(e) =>
        onChange(e.target.value)
      }
    />
  );
}

/* ==================================================
   PLAYER CARD
================================================== */

function PlayerCard({
  number,
  name,
  uid,
  uidLabel,
  onNameChange,
  onUIDChange,
}: {
  number: number;
  name: string;
  uid: string;
  uidLabel: string;
  onNameChange: (value: string) => void;
  onUIDChange: (value: string) => void;
}) {
  return (
    <div className="
      mt-4
      sm:mt-6
      bg-zinc-900
      rounded-2xl
      sm:rounded-3xl
      border
      border-purple-700/50
      p-4
      sm:p-6
      lg:p-8
    ">

      <SectionTitle
        icon={<FaUsers />}
        title={`Player ${number}`}
      />

      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        gap-3
        sm:gap-5
      ">

        <Input
          placeholder={`Player ${number} Name`}
          value={name}
          onChange={onNameChange}
        />

        <Input
          placeholder={`Player ${number} ${uidLabel}`}
          value={uid}
          onChange={onUIDChange}
        />

      </div>

    </div>
  );
}