// src/store/authThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { LoginCredentials, AuthResponse, User } from "../types/auth.types";
import { setError } from "./authSlice";

const RAW_API_BASE =
  import.meta.env.VITE_API_BASE_URL ??
  "https://dudiya-admin-production.up.railway.app/api/v1";

// normalize: trim spaces and remove trailing slashes
const API_BASE = RAW_API_BASE.trim().replace(/\/+$/, "");

export const loginUser = createAsyncThunk<
  { user: User; token: string },
  LoginCredentials,
  { rejectValue: string }
>("auth/loginUser", async (credentials, { dispatch, rejectWithValue }) => {
  try {
    dispatch(setError(null));

    // sanitize payload
    const payload = {
      email: credentials.email?.trim() ?? "",
      password: credentials.password ?? "",
       role: "field_user"
      // ensure role  matches exactly what backend expects (e.g., "field_user")
      // ...(credentials.role ? { role: String(credentials.role).trim()||"field_user" } : {}),
    };

    const url = `${API_BASE}/auth/login`;

    const { data } = await axios.post<AuthResponse>(url, payload, {
      headers: { "Content-Type": "application/json" },
      withCredentials: false,
    });

    if (!data?.success) {
      const msg = data?.message || "Login failed";
      return rejectWithValue(msg);
    }

    const accessToken = data.data?.accessToken ?? "";
    const refreshToken = data.data?.refreshToken;
    const rawUser = data.data?.user;

    // normalize user
    let parsedUser: Partial<User> = {};
    if (typeof rawUser === "string") {
      try {
        parsedUser = JSON.parse(rawUser) as Partial<User>;
      } catch {
        parsedUser = {
          id: rawUser,
          email: payload.email,
          name: rawUser,
          role: "user",
          createdAt: new Date().toISOString(),
        };
      }
    } else if (rawUser && typeof rawUser === "object") {
      parsedUser = rawUser as Partial<User>;
    }

    const user: User = {
      id: parsedUser.id ?? "unknown",
      email: parsedUser.email ?? payload.email,
      name: parsedUser.name ?? "User",
      role: (parsedUser.role as User["role"]) ?? "user",
      avatar: parsedUser.avatar,
      createdAt: parsedUser.createdAt ?? new Date().toISOString(),
      lastLogin: parsedUser.lastLogin ?? new Date().toISOString(),
    };

    if (accessToken) localStorage.setItem("auth_token", accessToken);
    if (refreshToken) localStorage.setItem("refresh_token", String(refreshToken));

    return { user, token: accessToken };
  } catch (err: unknown) {
    const e = err as { response?: { data?: any }; message?: string };
    const msg =
      e?.response?.data?.message ??
      e?.message ??
      "Login failed";
    return rejectWithValue(msg);
  }
});
