"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface AuthResponse {
  status: string;
  message: string;
  token?: string;
  error?: string;
}

const API_BASE_URL = "http://localhost:8000/api";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set the Authorization header with token for subsequent requests
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  const login = async (email: string, password: string, userType: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post<AuthResponse>(`${API_BASE_URL}/login`, {
        email,
        password,
        user_type: userType,
      });

      // Set the token in localStorage and axios default headers
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
      }

      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      throw new Error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
    userType: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post<AuthResponse>(`${API_BASE_URL}/signup`, {
        username,
        email,
        password,
        confirm_password: confirmPassword,
        user_type: userType,
      });

      // Set the token in localStorage and axios default headers (if token is returned on signup)
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
      }

      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
      throw new Error(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear the token from localStorage and axios default headers
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  return { login, signup, logout, loading, error };
};
