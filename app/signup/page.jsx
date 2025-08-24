"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic client-side validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          department,
          position,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed");
        return;
      }

      // Save token
      localStorage.setItem("token", data.token);

      // Redirect based on role
      if (data.user.role === "manager") router.push("/dashboard/manager");
      else router.push("/dashboard/employee");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="p-4  flex items-center justify-center ">
        <form
          onSubmit={handleSignup}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-4 border border-teal-100"
        >
          <h2 className="text-2xl font-bold text-center text-gray-900">
            Create an Account
          </h2>

          {error && (
            <p className="text-red-600 bg-red-50 border border-red-200 rounded p-2 text-center text-sm">
              {error}
            </p>
          )}

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-400 border-gray-300"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-400 border-gray-300"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-400 border-gray-300"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full appearance-none p-3 pr-10 border rounded-lg 
             bg-white text-gray-700 font-medium
             focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400
             hover:border-teal-300 transition border-gray-300"
          >
            <option value="employee" className="text-gray-700 font-medium">
              👨‍💼 Employee
            </option>
            <option value="manager" className="text-teal-700 font-semibold">
              🧑‍💼 Manager
            </option>
          </select>

          <input
            type="text"
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 border-gray-300 focus:ring-teal-400"
          />

          <input
            type="text"
            placeholder="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 border-gray-300 focus:ring-teal-400"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-lg text-white font-semibold transition 
          ${
            loading
              ? "bg-teal-400 cursor-not-allowed"
              : "bg-teal-600 hover:bg-teal-700"
          }`}
          >
            {loading ? "Signing up..." : "Signup"}
          </button>
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-teal-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
