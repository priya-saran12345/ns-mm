import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  PermissionsApiResponse,
  SavePermissionsApiResponse,
  SavePermissionsRequest,
} from "./types";
import type { UIModule } from "../../Master/Modules/types";

type RootState = {
  auth: { token: string | null };
  // if you need modules list here, it's already in another slice
};

const BASE_URL = import.meta.env.VITE_API_BASE ?? "https://69.62.73.62/api/v1/";

function authHeaders(state: RootState) {
  const token = state.auth?.token ?? "";
  return {
    accept: "application/json",
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

function buildUrl(path: string) {
  return `${BASE_URL}${path.replace(/^\//, "")}`;
}

/** GET /permissions/{role_id} → returns assigned modules for that role */
export const fetchPermissionsByRoleThunk = createAsyncThunk<
  { roleId: number; selectedIds: number[] },
  number,
  { state: RootState; rejectValue: string }
>("permissions/fetchByRole", async (roleId, { getState, rejectWithValue }) => {
  try {
    const res = await fetch(buildUrl(`permissions/${roleId}`), {
      headers: authHeaders(getState()),
    });
    const json = (await res.json()) as PermissionsApiResponse;
    if (!("success" in json) || !json.success) {
      return rejectWithValue((json as any)?.message || "Failed to fetch permissions");
    }

    // Keep only granted modules (status === true) and map to the module's id
    const selectedIds =
      (json.data?.modules ?? [])
        .filter((p) => p.status && p.module?.id != null)
        .map((p) => p.module.id);

    return { roleId, selectedIds };
  } catch (e: any) {
    return rejectWithValue(e?.message ?? "Network error");
  }
});

/**
 * (Optional) PUT/POST to save permissions for role.
 * If your API is different, adjust URL/method/body accordingly.
 */
export const savePermissionsForRoleThunk = createAsyncThunk<
  void,
  { roleId: number; payload: SavePermissionsRequest },
  { state: RootState; rejectValue: string }
>("permissions/saveForRole", async ({ roleId, payload }, { getState, rejectWithValue }) => {
  try {
    const res = await fetch(`${BASE_URL}permissions/${roleId}`, {
      method: "PUT",
      headers: authHeaders(getState()),
      body: JSON.stringify(payload),
    });
    const json = (await res.json()) as SavePermissionsApiResponse;
    if (!("success" in json) || !json.success) {
      return rejectWithValue((json as any)?.message || "Failed to save permissions");
    }
  } catch (e: any) {
    return rejectWithValue(e?.message ?? "Network error");
  }
});
