// thunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  RootStateWithAP,
  AssignedPermission,
  AssignedPermissionsResponse,
} from "./types";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "https://69.62.73.62/api/v1/";

function authHeaders(state: RootStateWithAP) {
  const token = state.auth?.token ?? "";
  return {
    accept: "application/json",
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

/* ============ SINGLE USER PERMISSION ============ */
export const fetchAssignedPermissionByIdThunk = createAsyncThunk<
  AssignedPermission | null,
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

    const json = (await res.json()) as AssignedPermissionsResponse;

    if (!json.success) {
      return rejectWithValue(json.message || "Failed to fetch permission by ID");
    }

    // 👇 API returns data: [ { ...permission } ]
    const first = Array.isArray(json.data) ? json.data[0] : (json.data as any);

    return (first ?? null) as AssignedPermission | null;
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Network error");
  }
});

/* ============ LIST ALL PERMISSIONS (unchanged) ============ */
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
export const upsertAssignedPermissionThunk = createAsyncThunk<
  AssignedPermission,
  {
    userId: number | string;
    mccCode?: string | null;
    mppCodes?: string[];
    formStepIds?: number[];
  },
  { state: RootStateWithAP; rejectValue: string }
>("assignedPermissions/upsert", async (args, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const url = `${BASE_URL}assigned-permissions`;

    const body = {
      user_id: Number(args.userId),
      mcc_codes: args.mccCode ? [args.mccCode] : [],
      mpp_codes: args.mppCodes ?? [],
      formsteps_ids: args.formStepIds ?? [],
    };

    const res = await fetch(url, {
      method: "POST", // or PUT if your API expects it
      headers: authHeaders(state),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return rejectWithValue(`HTTP ${res.status}`);
    }

    // API may return array or single object; handle both
    const json = (await res.json()) as any;

    if (!json.success) {
      return rejectWithValue(json.message || "Failed to save permissions");
    }

    const created: AssignedPermission = Array.isArray(json.data)
      ? json.data[0]
      : json.data;

    return created;
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Network error");
  }
});
