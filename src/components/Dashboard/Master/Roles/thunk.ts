// src/modules/UserManagement/Roles/state/thunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  RootState,
  Role,
  RolesPagination,
  RolesListApiResponse,
  RoleSingleApiResponse,
  RoleMutationResponse,
  FetchRolesParams,
  CreateRoleRequest,
  UpdateRoleRequest,
  RoleRow,
} from "./types";
/** ---------- Config ---------- */
const BASE_URL =
  import.meta.env.VITE_API_BASE ?? "https://69.62.73.62/api/v1/";

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
  return `${BASE_URL}${path.replace(/^\//, "")}${qs.toString() ? `?${qs}` : ""}`;
}

/** ---------- Mapping helpers ---------- */
export function toRow(r: Role): RoleRow {
  const catName = r.category?.name ?? "";
  const statusLabel = r.status ? "Active" : "Inactive";
  return {
    key: r.id,
    id: r.id,
    name: r.name,
    category: catName,
    status: statusLabel,
  };
}
function normalizePagination(p: any): RolesPagination {
  const page = Number(p?.currentPage ?? 1);
  const limit = Number(p?.itemsPerPage ?? 10);
  const total = Number(p?.totalItems ?? 0);
  const totalPages = Number(p?.totalPages ?? 0);
  return { page, limit, total, totalPages };
}

/** ---------- LIST: GET /roles?page&limit&search ---------- */
export const fetchRolesThunk = createAsyncThunk<
  { rows: RoleRow[]; pagination: RolesPagination },
  FetchRolesParams,
  { state: RootState; rejectValue: string }
>("roles/fetchList", async (args, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const url = buildUrl(args.path || "/api/v1/roles", {
      page: args.page ?? 1,
      limit: args.limit ?? 10,
      search: args.search ?? "",
    });
    const res = await fetch(url, { headers: authHeaders(state) });
    const json = (await res.json()) as RolesListApiResponse;

    if (!json.success || !json.data) {
      return rejectWithValue(json?.message || "Failed to fetch roles");
    }

    const rows = (json.data.roles || []).map(toRow);
    const pagination = normalizePagination(json.data.pagination);
    return { rows, pagination };
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Network error");
  }
});

/** ---------- SINGLE: GET /roles/:id ---------- */
export const fetchRoleByIdThunk = createAsyncThunk<
  Role,
  { path: string; id: number },
  { state: RootState; rejectValue: string }
>("roles/fetchById", async ({ path, id }, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const url = `${BASE_URL}${(path || "/api/v1/roles").replace(/^\//, "")}/${id}`;
    const res = await fetch(url, { headers: authHeaders(state) });
    const json = (await res.json()) as RoleSingleApiResponse;

    if (!json.success || !json.data) {
      return rejectWithValue(json?.message || "Failed to fetch role");
    }
    return json.data;
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Network error");
  }
});

/** ---------- CREATE: POST /roles ---------- */
export const createRoleThunk = createAsyncThunk<
  Role,
  { path: string; body: CreateRoleRequest },
  { state: RootState; rejectValue: string }
>("roles/create", async ({ path, body }, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const url = `${BASE_URL}${(path || "/api/v1/roles").replace(/^\//, "")}`;
    const res = await fetch(url, {
      method: "POST",
      headers: authHeaders(state),
      body: JSON.stringify({ ...body, status: body.status ?? true }),
    });
    const json = (await res.json()) as RoleMutationResponse;

    if (!json.success || !json.data) {
      return rejectWithValue(json?.message || "Failed to create role");
    }
    return json.data;
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Network error");
  }
});

/** ---------- UPDATE: PUT /roles/:id ---------- */
export const updateRoleThunk = createAsyncThunk<
  Role,
  { path: string; id: number; body: UpdateRoleRequest },
  { state: RootState; rejectValue: string }
>("roles/update", async ({ path, id, body }, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const url = `${BASE_URL}${(path || "/api/v1/roles").replace(/^\//, "")}/${id}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: authHeaders(state),
      body: JSON.stringify(body),
    });
    const json = (await res.json()) as RoleMutationResponse;

    if (!json.success || !json.data) {
      return rejectWithValue(json?.message || "Failed to update role");
    }
    return json.data;
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Network error");
  }
});

/** ---------- DELETE: DELETE /roles/:id ---------- */
export const deleteRoleThunk = createAsyncThunk<
  { id: number },
  { path: string; id: number },
  { state: RootState; rejectValue: string }
>("roles/delete", async ({ path, id }, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const url = `${BASE_URL}${(path || "/api/v1/roles").replace(/^\//, "")}/${id}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: authHeaders(state),
    });
    const json = (await res.json()) as { success: boolean; message?: string };

    if (!json.success) {
      return rejectWithValue(json?.message || "Failed to delete role");
    }
    return { id };
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Network error");
  }
});
