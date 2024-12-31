"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginPage = () => {
  const router = useRouter();
  const { login, loading, error } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("user");

  useEffect(() => {
    // Check for existing token in a try-catch block to handle storage access issues
    try {
      if (localStorage.getItem("token")) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await login(email, password, userType);
      if (response?.token) {
        try {
          localStorage.setItem("token", response.token);
          console.log(response.token + "TOKEN");
          router.push("/dashboard");
        } catch (storageError) {
          console.error("Error storing token:", storageError);
          alert("Failed to store login credentials. Please check your browser settings.");
        }
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      alert(err?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit}>
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
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      {/* Added sign up link */}
      <div className="mt-4 text-center">
        <p className="text-sm">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:text-blue-600">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;