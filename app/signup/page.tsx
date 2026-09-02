"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import {
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignupPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignup = async () => {
    if (
      !form.fullName ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password should be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );

      await updateProfile(userCredential.user, {
        displayName: form.fullName,
      });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        fullName: form.fullName,
        email: form.email,
        role: "player",
        createdAt: serverTimestamp(),
      });

      toast.success("Account Created Successfully!");

      router.push("/login");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
  try {
    setLoading(true);

    const result = await signInWithPopup(auth, googleProvider);

    await setDoc(
      doc(db, "users", result.user.uid),
      {
        uid: result.user.uid,
        fullName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        role: "player",
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );

    toast.success("Welcome to Jaipur Esports Club!");

    router.push("/dashboard");
  } catch (error: any) {
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">

      <div className="bg-zinc-900 w-full max-w-md rounded-3xl p-8 border border-purple-600">

        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Create Account
        </h1>

        <input
          className="w-full mb-4 p-3 rounded-xl bg-zinc-800 text-white"
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) =>
            setForm({
              ...form,
              fullName: e.target.value,
            })
          }
        />

        <input
          className="w-full mb-4 p-3 rounded-xl bg-zinc-800 text-white"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <div className="relative mb-4">
          <input
            className="w-full p-3 rounded-xl bg-zinc-800 text-white"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />

          <button
            type="button"
            className="absolute right-4 top-4 text-white"
            onClick={() =>
              setShowPassword(!showPassword)
            }
          >
            {showPassword ? (
              <FaEyeSlash />
            ) : (
              <FaEye />
            )}
          </button>
        </div>

        <div className="relative mb-6">
          <input
            className="w-full p-3 rounded-xl bg-zinc-800 text-white"
            placeholder="Confirm Password"
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({
                ...form,
                confirmPassword: e.target.value,
              })
            }
          />

          <button
            type="button"
            className="absolute right-4 top-4 text-white"
            onClick={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
          >
            {showConfirmPassword ? (
              <FaEyeSlash />
            ) : (
              <FaEye />
            )}
          </button>
        </div>
<button
  type="button"
  onClick={handleGoogleSignup}
  disabled={loading}
  className="w-full mb-4 flex items-center justify-center gap-3 bg-white text-black rounded-xl py-3 font-semibold hover:bg-gray-100 transition"
>
  <img
    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
    alt="Google"
    className="w-5 h-5"
  />
  Continue with Google
</button>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 transition rounded-xl py-3 font-bold text-white"
        >
          {loading
            ? "Creating Account..."
            : "Create Account"}
        </button>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <span
            className="text-purple-400 cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>

      </div>

    </div>
  );
}