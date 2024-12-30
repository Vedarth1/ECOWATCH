"use client"
import { useState } from "react";
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

  const login = async (email: string, password: string, userType: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post<AuthResponse>(`${API_BASE_URL}/login`, {
        email,
        password,
        user_type: userType,
      });

      return response.data;
    } catch (err: unknown) {
      setError(err.response?.data?.message || "Login failed");
      throw new Error(error);
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

      return response.data;
    } catch (err: unknown) {
      setError(err.response?.data?.message || "Signup failed");
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };

  return { login, signup, loading, error };
};
