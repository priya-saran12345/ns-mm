import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootStateWithApprovalHierarchy } from "./types";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "https://69.62.73.62/api/v1/";

// Build auth headers from Redux state
const authHeaders = (state: RootStateWithApprovalHierarchy) => {
  const token = state.auth?.token ?? "";
  return {
    accept: "application/json",
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
};

// ---------- LIST ----------
export const fetchApprovalHierarchyThunk = createAsyncThunk<
  { rows: any[]; total: number },
  { page: number; limit: number; search: string; levelFilter?: number },
  { state: RootStateWithApprovalHierarchy }
>(
  "approvalHierarchy/fetchList",
  async ({ page, limit, search, levelFilter }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const url = new URL(`${BASE_URL}hierarchy`);
      url.searchParams.set("page", String(page));
      url.searchParams.set("limit", String(limit));
      if (search) url.searchParams.set("search", search);
      if (levelFilter) url.searchParams.set("levelFilter", String(levelFilter));

      const res = await fetch(url.toString(), { headers: authHeaders(state) });
      const json = await res.json().catch(() => ({}));

      if (!res.ok || json?.success === false) {
        return rejectWithValue(json?.message ?? `HTTP ${res.status}`);
      }

      return {
        rows: json.data ?? json.items ?? [],
        total: json.pagination?.total ?? json.total ?? 0,
      };
    } catch {
      return rejectWithValue("Failed to fetch approval hierarchy");
    }
  }
);

// ---------- ADD (NO `name`, send Bearer) ----------
export const addApprovalHierarchy = createAsyncThunk<
  any,
  { level: number; levels: { level: number; role_id: number }[] },
  { state: RootStateWithApprovalHierarchy }
>(
  "approvalHierarchy/add",
  async (body, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const res = await fetch(`${BASE_URL}hierarchy`, {
        method: "POST",
        headers: authHeaders(state),
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        return rejectWithValue(json?.message ?? `HTTP ${res.status}`);
      }
      return json;
    } catch (err: any) {
      return rejectWithValue(err?.message ?? "Failed to add approval hierarchy");
    }
  }
);

// ---------- UPDATE (send Bearer) ----------
export const updateApprovalHierarchy = createAsyncThunk<
  any,
  { id: number; level: number; levels: { level: number; role_id: number }[] },
  { state: RootStateWithApprovalHierarchy }
>(
  "approvalHierarchy/update",
  async ({ id, ...rest }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const res = await fetch(`${BASE_URL}hierarchy/${id}`, {
        method: "PUT",
        headers: authHeaders(state),
        body: JSON.stringify(rest),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        return rejectWithValue(json?.message ?? `HTTP ${res.status}`);
      }
      return json;
    } catch (err: any) {
      return rejectWithValue(err?.message ?? "Failed to update approval hierarchy");
    }
  }
);
