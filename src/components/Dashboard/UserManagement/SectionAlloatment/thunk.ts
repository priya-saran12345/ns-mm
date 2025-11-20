import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  RootStateWithAP,
  AssignedPermission,
  AssignedPermissionsResponse,
} from "./types";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "https://69.62.73.62/api/v1/";

/** Attach Auth Token */
function authHeaders(state: RootStateWithAP) {
  const token = state.auth?.token ?? "";
  return {
    accept: "application/json",
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

/* ============================================================
    FETCH SINGLE USER PERMISSION ( /assigned-permissions/:id )
   ============================================================ */
export const fetchAssignedPermissionByIdThunk = createAsyncThunk<
  AssignedPermission,
  number | string,
  { state: RootStateWithAP; rejectValue: string }
>("assignedPermissions/fetchById", async (id, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const url = `${BASE_URL}assigned-permissions?userId=${id}`;

    const res = await fetch(url, { headers: authHeaders(state) });

    if (!res.ok) {
      return rejectWithValue(`HTTP ${res.status}`);
    }

    const json = await res.json();

    if (!json.success) {
      return rejectWithValue(json.message || "Failed to fetch permission by ID");
    }

    return json.data;
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Network error");
  }
});

/* ============================================================
    FETCH ALL ASSIGNED PERMISSIONS (list)
   ============================================================ */
export const fetchAssignedPermissionsThunk = createAsyncThunk<
  AssignedPermission[],
  void,
  { state: RootStateWithAP; rejectValue: string }
>("assignedPermissions/fetchAll", async (_arg, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const url = `${BASE_URL}assigned-permissions`;

    const res = await fetch(url, { headers: authHeaders(state) });

    if (!res.ok) {
      return rejectWithValue(`HTTP ${res.status}`);
    }

    const json = (await res.json()) as AssignedPermissionsResponse;

    if (!json.success) {
      return rejectWithValue(json.message || "Failed to fetch permissions");
    }

    return json.data || [];
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Network error");
  }
});
