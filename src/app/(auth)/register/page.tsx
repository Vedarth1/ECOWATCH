"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";  // Changed from next/router
import Link from "next/link";  // Added for client-side navigation
import { useAuth } from "@/hooks/useAuth";

const SignupPage = () => {
  const router = useRouter();
  const { signup, loading, error } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [userType, setUserType] = useState("user");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Password and confirm password do not match.");
      return;
    }

    try {
      await signup(username, email, password, confirmPassword, userType);
      alert("Signup successful! Please log in.");
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            className="w-full bg-black text-white placeholder-white border rounded px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full bg-black text-white placeholder-white border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full bg-black text-white placeholder-white border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            className="w-full bg-black text-white placeholder-white border rounded px-3 py-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">User Type</label>
          <select
            className="w-full bg-black text-white border rounded px-3 py-2"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:text-blue-600">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;