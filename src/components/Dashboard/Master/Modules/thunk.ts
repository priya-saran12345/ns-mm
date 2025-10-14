import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  RootStateWithModules,
  FetchModulesParams,
  ModulesListApiResponse,
  UIModule,
  ModulesPagination,
} from "./types";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "https://69.62.73.62/api/v1/";

function authHeaders(state: RootStateWithModules) {
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

function normalizePagination(p: any): ModulesPagination {
  return {
    page: Number(p?.currentPage ?? 1),
    limit: Number(p?.itemsPerPage ?? 10),
    total: Number(p?.totalItems ?? 0),
    totalPages: Number(p?.totalPages ?? 0),
  };
}

/** GET /modules?page&limit&sort_by&sort */
export const fetchModulesThunk = createAsyncThunk<
  { items: UIModule[]; pagination: ModulesPagination },
  FetchModulesParams,
  { state: RootStateWithModules; rejectValue: string }
>("modules/fetchList", async (args, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const url = buildUrl(args.path || "modules", {
      page: args.page ?? 1,
      limit: args.limit ?? 10,
      sort_by: args.sort_by ?? "created_at",
      sort: args.sort ?? "desc",
      search: args.search ?? "",
    });

    const res = await fetch(url, { headers: authHeaders(state) });
    const json = (await res.json()) as ModulesListApiResponse;

    if (!("success" in json) || !json.success) {
      return rejectWithValue((json as any)?.message || "Failed to fetch modules");
    }

    const items = json.data?.modules ?? [];
    const pagination = normalizePagination(json.data?.pagination);
    return { items, pagination };
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Network error");
  }
});
