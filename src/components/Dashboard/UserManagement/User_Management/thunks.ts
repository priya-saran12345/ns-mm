// src/modules/UserManagement/state/thunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  RootState,
  User,
  FetchUsersParams,
  UsersPagination,
  UpdateUserRequest,
  UpdateUserResponse,
} from "./types";
/** ---------- Table Row for your AntD table ---------- */
export type UsersTableRow = {
  key: number;
  id: number;
  name: string;
  username: string;
  password: string; // masked placeholder
  role: string;
  email: string;
};
export type UsersTablePayload = {
  rows: UsersTableRow[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
};
/** ---------- API response shapes ---------- */
type UsersApiSuccess = {
  success: true;
  message: string;
  data: { users: User[]; pagination: UsersPagination };
};
type UsersApiError = { success: false; message: string };
type UsersApiResponse = UsersApiSuccess | UsersApiError;

type SingleUserApiResponse =
  | { success: true; message: string; data: User }
  | { success: false; message: string };

/** ---------- Config ---------- */
const BASE_URL =
  import.meta.env.VITE_API_BASE ?? "https://dudiya-admin-production.up.railway.app";

/** ---------- Helpers ---------- */
function authHeaders(state: RootState) {
  const token = state.auth?.token ?? "";
  return {
    accept: "application/json",
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}
function buildUrl(path: string, query?: Record<string, string | number | undefined>) {
  const qs = new URLSearchParams();
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v).trim() !== "") qs.set(k, String(v));
    });
  }
  return `${BASE_URL}${path}${qs.toString() ? `?${qs}` : ""}`;
}
/** ---------- Thunks ---------- */
/** LIST: GET /api/v1/user?page&limit&search → rows for table */
export const fetchUsersThunk = createAsyncThunk<
  UsersTablePayload,
  FetchUsersParams,
  { state: RootState; rejectValue: string }
>("users/fetchTableRows", async (args, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const url = buildUrl(args.path, { page: args.page, limit: args.limit, search: args.search });

    const res = await fetch(url, { headers: authHeaders(state) });
    const response = (await res.json()) as UsersApiResponse;

    if (!response.success || !response.data) {
      return rejectWithValue(response.message || "Failed to fetch users");
    }

    const { users, pagination } = response.data;
    const rows: UsersTableRow[] = (users || []).map((u) => ({
      key: u.id,
      id: u.id,
      name: [u.first_name, u.last_name].filter(Boolean).join(" ") || u.username || u.email,
      username: u.username || u.email,
      password: "********",
      role: u.role,
      email: u.email ?? "",
    }));

    return {
      rows,
      pagination: {
        total: pagination?.total ?? rows.length,
        page: pagination?.page ?? (args.page || 1),
        limit: pagination?.limit ?? (args.limit || 10),
        totalPages: pagination?.totalPages ?? 1,
      },
    };
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Network error");
  }
});

/** SINGLE: GET /api/v1/user/:id → one User for edit form */
export const fetchUserByIdThunk = createAsyncThunk<
  User,
  { path: string; id: number },
  { state: RootState; rejectValue: string }
>("users/fetchUserById", async ({ path, id }, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const url = `${BASE_URL}${path}/${id}`;

    const res = await fetch(url, { headers: authHeaders(state) });
    const response = (await res.json()) as SingleUserApiResponse;

    if (!response.success || !response.data) {
      return rejectWithValue(response.message || "Failed to fetch user");
    }

    return response.data;
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Network error");
  }
});

/** UPDATE: PUT /api/v1/user/:id with your exact payload */
export const updateUserThunk = createAsyncThunk<
  User, // return updated user
  { path: string; id: number; body: UpdateUserRequest },
  { state: RootState; rejectValue: string }
>("users/updateUser", async ({ path, id, body }, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const url = `${BASE_URL}${path}/${id}`;

    const res = await fetch(url, {
      method: "PUT",
      headers: authHeaders(state),
      body: JSON.stringify(body),
    });

    const response = (await res.json()) as UpdateUserResponse;

    if (!response.success) {
      return rejectWithValue(response.message || "Failed to update user");
    }

    return response.data;
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Network error");
  }
});
type DeactivateUserResponse =
  | { success: true; message: string; data: User }
  | { success: false; message: string };

export const deactivateUserThunk = createAsyncThunk<
  User,                                   // return updated user
  { path: string; id: number },           // args
  { state: RootState; rejectValue: string }
>("users/deactivateUser", async ({ path, id }, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const url = `${BASE_URL}${path}/${id}/deactivate`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: authHeaders(state),
    });

    const json = (await res.json()) as DeactivateUserResponse;

    if (!json.success || !json.data) {
      return rejectWithValue(json.message || "Failed to deactivate user");
    }

    return json.data; // <- updated user
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Network error");
  }
});