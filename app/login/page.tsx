"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ================================
  // LOGIN
  // ================================
  const login = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Refresh Firebase ID token
      // so the latest admin custom claim is available.
      await user.getIdToken(true);

      // Get latest custom claims
      const tokenResult = await user.getIdTokenResult();

      console.log("ADMIN CLAIM:", tokenResult.claims.admin);
      console.log("ALL CLAIMS:", tokenResult.claims);

      toast.success("Login Successful!");

      // ================================
      // ADMIN REDIRECT
      // ================================
      if (tokenResult.claims.admin === true) {
        console.log("✅ Admin detected");
        router.push("/admin");
      } else {
        console.log("👤 Normal user detected");
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);

      if (error.code === "auth/invalid-credential") {
        toast.error("Invalid email or password.");
      } else if (error.code === "auth/user-not-found") {
        toast.error("No account found with this email.");
      } else if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password.");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Please enter a valid email.");
      } else {
        toast.error(error.message || "Login failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // FORGOT PASSWORD
  // ================================
  const forgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email address first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);

      toast.success(
        "Password reset email sent! Check your inbox."
      );
    } catch (error: any) {
      console.error("Password reset error:", error);

      if (error.code === "auth/user-not-found") {
        toast.error("No account found with this email.");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Please enter a valid email address.");
      } else {
        toast.error("Failed to send password reset email.");
      }
    }
  };

  // ================================
  // UI
  // ================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-5">

      <div className="bg-zinc-900 border border-purple-500/20 p-8 rounded-2xl w-full max-w-md shadow-2xl">

        <h1 className="text-3xl font-bold text-white mb-2">
          Login
        </h1>

        <p className="text-zinc-400 mb-6">
          Login to your JEC account
        </p>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded-xl bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-purple-500"
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-2 rounded-xl bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-purple-500"
        />

        {/* FORGOT PASSWORD */}
        <div className="text-right mb-6">
          <button
            type="button"
            onClick={forgotPassword}
            className="text-sm text-purple-400 hover:text-purple-300"
          >
            Forgot Password?
          </button>
        </div>

        {/* LOGIN BUTTON */}
        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed p-3 rounded-xl font-bold text-white transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </div>
    </div>
  );
}