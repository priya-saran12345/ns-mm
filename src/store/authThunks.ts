// src/store/authThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import type { LoginCredentials, AuthResponse, User } from "../types/auth.types";
import { setError } from "./authSlice";

const RAW_API_BASE =
  import.meta.env.VITE_API_BASE_URL ??
  "https://dudiya-admin-production.up.railway.app/api/v1";
const API_BASE = RAW_API_BASE.trim().replace(/\/+$/, "");

// Axios instance (Bearer-token flow; no cookies)
const http = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

function normalizeUser(rawUser: any, fallbackEmail: string): User {
  const u = (rawUser && typeof rawUser === "object") ? rawUser : {};
  return {
    id: u.id ?? "unknown",
    email: u.email ?? fallbackEmail,
    name: u.name ?? u.username ?? "User",
    role: u.role ?? "user",
    avatar: u.avatar,
    createdAt: u.createdAt ?? new Date().toISOString(),
    lastLogin: u.lastLogin ?? new Date().toISOString(),
  };
}

export const loginUser = createAsyncThunk<
  { user: User; token: string },
  LoginCredentials,
  { rejectValue: string }
>("auth/loginUser", async (credentials, { dispatch, rejectWithValue }) => {
  try {
    dispatch(setError(null));

    const payload = {
      email: (credentials.email ?? "").trim(),
      password: credentials.password ?? "",
      ...(credentials.role ? { role: String(credentials.role).trim() } : {}),
    };

    const { data } = await http.post<AuthResponse>("/auth/login", payload);
    if (!data?.success) {
      return rejectWithValue(data?.message || "Login failed");
    }

    const token = data.data?.token ?? "";
    if (!token) {
      return rejectWithValue("No access token returned by server");
    }

    const user = normalizeUser(data.data?.user, payload.email);
    return { user, token };
  } catch (err) {
    const ax = err as AxiosError<any>;
    const msg = ax.response?.data?.message ?? ax.message ?? "Login failed";
    return rejectWithValue(msg);
  }
});
