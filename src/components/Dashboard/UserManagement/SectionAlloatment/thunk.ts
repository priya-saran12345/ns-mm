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
    if (!("success" in json) || !json.success) {
      return rejectWithValue(json?.message || "Failed to fetch permissions");
    }
    return json.data || [];
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Network error");
  }
});
