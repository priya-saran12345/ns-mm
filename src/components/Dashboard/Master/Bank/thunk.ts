import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  RootStateWithBanks,
  FetchBanksParams,
  BanksListApiResponse,
  Bank,
  BanksPagination,
} from "./types";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "https://69.62.73.62/api/v1/";

function authHeaders(state: RootStateWithBanks) {
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

function normalizePagination(p: any): BanksPagination {
  return {
    page: Number(p?.currentPage ?? 1),
    limit: Number(p?.itemsPerPage ?? 10),
    total: Number(p?.totalItems ?? 0),
    totalPages: Number(p?.totalPages ?? 0),
  };
}

/**
 * GET /banks?page=&limit=&sort_by=&sort[&search=]
 * Matches your example:
 * https://69.62.73.62/api/v1/banks?page=1&limit=10&sort_by=created_at&sort=desc
 */
export const fetchBanksThunk = createAsyncThunk<
  { items: Bank[]; pagination: BanksPagination },
  FetchBanksParams | void,
  { state: RootStateWithBanks; rejectValue: string }
>("banks/fetchList", async (args, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const s = state.banks;

    const url = buildUrl("banks", {
      page: args?.page ?? s.page ?? 1,
      limit: args?.limit ?? s.limit ?? 10,
      sort_by: args?.sort_by ?? s.sort_by ?? "created_at",
      sort: args?.sort ?? s.sort ?? "desc",
      search: args?.search ?? s.search ?? "", // include only if BE supports
    });

    const res = await fetch(url, { headers: authHeaders(state) });
    const json = (await res.json()) as BanksListApiResponse;

    if (!("success" in json) || !json.success) {
      return rejectWithValue((json as any)?.message || "Failed to fetch banks");
    }

    const items = json.data?.items ?? [];
    const pagination = normalizePagination(json.data?.pagination);
    return { items, pagination };
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Network error");
  }
});
