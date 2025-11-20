// src/modules/UserManagement/Categories/state/thunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  RootStateWithCategories,
  CategoriesPagination,
  CategoriesListApiResponse,
  FetchCategoriesParams,
  Category,
  FetchMccMppParams,
  MccItem,
  MppItem,
  MccListApiResponse,
  MppListApiResponse,
} from "./types";

/** ---------- Config ---------- */
const BASE_URL =
  import.meta.env.VITE_API_BASE ?? "https://69.62.73.62/api/v1/";

/** ---------- Helpers ---------- */
function authHeaders(state: RootStateWithCategories) {
  const token = state.auth?.token ?? "";
  return {
    accept: "application/json",
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

function buildUrl(
  path: string,
  query?: Record<string, string | number | undefined>
) {
  const qs = new URLSearchParams();
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v).trim() !== "") {
        qs.set(k, String(v));
      }
    });
  }
  return `${BASE_URL}${path.replace(/^\//, "")}${
    qs.toString() ? `?${qs}` : ""
  }`;
}

function normalizePagination(p: any): CategoriesPagination {
  return {
    total: Number(p?.total ?? 0),
    page: Number(p?.page ?? 1),
    limit: Number(p?.limit ?? 10),
    totalPages: Number(p?.totalPages ?? 0),
  };
}

/** ---------- LIST: GET /categories?page&limit&search ---------- */
export const fetchCategoriesThunk = createAsyncThunk<
  { items: Category[]; pagination: CategoriesPagination },
  FetchCategoriesParams,
  { state: RootStateWithCategories; rejectValue: string }
>("categories/fetchList", async (args, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const path = args.path || "categories";
    const url = buildUrl(path, {
      page: args.page ?? 1,
      limit: args.limit ?? 10,
      search: args.search ?? "",
    });

    const res = await fetch(url, { headers: authHeaders(state) });
    const json = (await res.json()) as CategoriesListApiResponse;

    if (!("success" in json) || !json.success) {
      return rejectWithValue((json as any)?.message || "Failed to fetch categories");
    }

    const items = json.data?.categories ?? [];
    const pagination = normalizePagination(json.data?.pagination);
    return { items, pagination };
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Network error");
  }
});

/** ---------- LIST: GET /master-data/mcc-list?page&limit ---------- */
export const fetchMccListThunk = createAsyncThunk<
  { items: MccItem[]; pagination: CategoriesPagination },
  FetchMccMppParams | void,
  { state: RootStateWithCategories; rejectValue: string }
>("categories/fetchMccList", async (args, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const page = args?.page ?? 1;
    const limit = args?.limit ?? 10;

    const url = buildUrl("master-data/mcc-list", { page, limit });

    const res = await fetch(url, { headers: authHeaders(state) });
    const json = (await res.json()) as MccListApiResponse;

    if (!("success" in json) || !json.success) {
      return rejectWithValue((json as any)?.message || "Failed to fetch MCC list");
    }

    const items = json.data?.mccs ?? [];
    const pagination = normalizePagination(json.data?.pagination);
    return { items, pagination };
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Network error");
  }
});

/** ---------- LIST: GET /master-data/mpp-list?page&limit ---------- */
// thunks.ts
export const fetchMppListThunk = createAsyncThunk<
  { items: MppItem[]; pagination: CategoriesPagination },
  FetchMccMppParams | void,
  { state: RootStateWithCategories; rejectValue: string }
>("categories/fetchMppList", async (args, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const page = args?.page ?? 1;
    const limit = args?.limit ?? 10;
    const mcc_code = args?.mcc_code;             // 👈 dynamic

    // ✅ DO NOT put query in the path; pass it via the `query` object
    const url = buildUrl("master-data/mpp-list", {
      page,
      limit,
      mcc_code,                                   // 👈 this becomes &mcc_code=XXX
    });

    const res = await fetch(url, { headers: authHeaders(state) });
    const json = (await res.json()) as MppListApiResponse;

    if (!("success" in json) || !json.success) {
      return rejectWithValue(
        (json as any)?.message || "Failed to fetch MPP list"
      );
    }

    const items = json.data?.mpps ?? [];
    const pagination = normalizePagination(json.data?.pagination);
    return { items, pagination };
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Network error");
  }
});
