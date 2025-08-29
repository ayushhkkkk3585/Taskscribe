"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.error || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "manager") router.push("/dashboard/manager");
      else router.push("/dashboard/employee");
    } catch {
      setError("Something went wrong");
    }
  }

  return (
    <div>
      <Navbar />
      <div className="mt-20 flex items-center justify-center  px-4">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6 border border-gray-100"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Welcome Back 👋
          </h2>
          <p className="text-center text-gray-500">Login to your account</p>

          {error && (
            <p className="text-red-500 text-center text-sm bg-red-50 p-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-teal-400 focus:border-teal-400
                       outline-none transition"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg 
            focus:ring-2 focus:ring-teal-400 focus:border-teal-400
            outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white 
          p-3 rounded-lg font-semibold shadow-md 
          hover:opacity-90 transition"
          >
            Login
          </button>

          <p className="text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="text-teal-600 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
