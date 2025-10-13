// src/store/authThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import type { LoginCredentials, AuthResponse, User, RawUser } from "../types/auth.types";
import { setError } from "./authSlice";

const RAW_API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "https://69.62.73.62/api/v1/";
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

function normalizeUser(rawUser: RawUser | undefined, fallbackEmail: string): User {
  const u = (rawUser && typeof rawUser === "object") ? rawUser : ({} as RawUser);

  // Prefer first_name + last_name; then name; then username; fallback "User"
  const composedName = [u.first_name, u.last_name].filter(Boolean).join(" ").trim();
  const name = composedName || u.name || u.username || "User";

  return {
    id: String(u.id ?? "unknown"),
    email: u.email ?? fallbackEmail,
    name,
    avatar: u.avatar ?? null,
    createdAt: u.createdAt ?? new Date().toISOString(),
    lastLogin: u.last_login ?? new Date().toISOString(),
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
    };

    const { data } = await http.post<AuthResponse>("/auth/login", payload);

    if (!data?.success) {
      return rejectWithValue(data?.message || "Login failed");
    }

    const token = data.data?.token ?? "";
    if (!token) {
      return rejectWithValue("No access token returned by server");
    }

    const user = normalizeUser(data.data?.user as RawUser | undefined, payload.email);
    return { user, token };
  } catch (err) {
    const ax = err as AxiosError<any>;
    const msg = ax.response?.data?.message ?? ax.message ?? "Login failed";
    return rejectWithValue(msg);
  }
});
