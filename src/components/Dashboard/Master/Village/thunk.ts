import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  RootStateWithVillages,
  FetchVillagesParams,
  VillagesListApiResponse,
  Village,
  VillagesPagination,
} from "./types";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "https://69.62.73.62/api/v1/";

function authHeaders(state: RootStateWithVillages) {
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

function normalizePagination(p: any): VillagesPagination {
  return {
    total: Number(p?.total ?? 0),
    page: Number(p?.page ?? 1),
    limit: Number(p?.limit ?? 10),
    totalPages: Number(p?.totalPages ?? 0),
  };
}

/**
 * GET /master-data/villages?page=1&limit=10[&search=&district_code=&tehsil_code=]
 * Matches your example:
 * https://69.62.73.62/api/v1/master-data/villages?page=1&limit=10
 */
export const fetchVillagesThunk = createAsyncThunk<
  { items: Village[]; pagination: VillagesPagination },
  FetchVillagesParams | void,
  { state: RootStateWithVillages; rejectValue: string }
>("villages/fetchList", async (args, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const page = args?.page ?? state.villages.page ?? 1;
    const limit = args?.limit ?? state.villages.limit ?? 10;

    const url = buildUrl("master-data/villages", {
      page,
      limit,
      search: args?.search ?? state.villages.search ?? "",
      district_code: args?.district_code ?? state.villages.district_code,
      tehsil_code: args?.tehsil_code ?? state.villages.tehsil_code,
    });

    const res = await fetch(url, { headers: authHeaders(state) });
    const json = (await res.json()) as VillagesListApiResponse;

    if (!("success" in json) || !json.success) {
      return rejectWithValue((json as any)?.message || "Failed to fetch villages");
    }

    const items = json.data?.villages ?? [];
    const pagination = normalizePagination(json.data?.pagination);
    return { items, pagination };
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Network error");
  }
});
