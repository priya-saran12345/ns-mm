import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  RootStateWithBanks,
  FetchBanksParams,
  BanksListApiResponse,
  Bank,
  BanksPagination,
  BankByIdApiResponse,
  BankUpdateRequest,
  BankUpdateApiResponse,
  BankCreateRequest,
  BankCreateApiResponse,
} from "./types";
import type { BankExportType } from "./types";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "https://69.62.73.62/api/v1/";
import type {
  BankImportApiResponse,
  BankImportSummary,
  BankImportType,
} from "./types";

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

/** List */
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
      search: args?.search ?? s.search ?? "",
    });

    const res = await fetch(url, { headers: authHeaders(state) });
    const json = (await res.json()) as BanksListApiResponse;

    if (!("success" in json) || !json.success) {
      return rejectWithValue((json as any)?.message || "Failed to fetch banks");
    }

    return {
      items: json.data?.items ?? [],
      pagination: normalizePagination(json.data?.pagination),
    };
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Network error");
  }
});

/** GET /banks/{id} */
export const retrieveBankThunk = createAsyncThunk<
  Bank,
  number,
  { state: RootStateWithBanks; rejectValue: string }
>("banks/retrieveById", async (id, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const res = await fetch(buildUrl(`banks/${id}`), { headers: authHeaders(state) });
    const json = (await res.json()) as BankByIdApiResponse;
    if (!("success" in json) || !json.success) {
      return rejectWithValue((json as any)?.message || "Failed to retrieve bank");
    }
    return json.data;
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Network error");
  }
});

/** PUT /banks/{id} */
export const updateBankThunk = createAsyncThunk<
  Bank,
  { id: number; data: BankUpdateRequest },
  { state: RootStateWithBanks; rejectValue: string }
>("banks/update", async ({ id, data }, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const res = await fetch(buildUrl(`banks/${id}`), {
      method: "PUT",
      headers: authHeaders(state),
      body: JSON.stringify(data),
    });
    const json = (await res.json()) as BankUpdateApiResponse;
    if (!("success" in json) || !json.success) {
      return rejectWithValue((json as any)?.message || "Failed to update bank");
    }
    return json.data;
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Network error");
  }
});
export const createBankThunk = createAsyncThunk<
  Bank,
  BankCreateRequest,
  { state: RootStateWithBanks; rejectValue: string }
>("banks/create", async (payload, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const res = await fetch(buildUrl("banks"), {
      method: "POST",
      headers: authHeaders(state),
      body: JSON.stringify(payload),
    });
    const json = (await res.json()) as BankCreateApiResponse;
    if (!("success" in json) || !json.success) {
      return rejectWithValue((json as any)?.message || "Failed to create bank");
    }
    return json.data;
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Network error");
  }
});

export const importBanksThunk = createAsyncThunk<
  BankImportSummary,
  { type: BankImportType; file: File },
  { state: RootStateWithBanks; rejectValue: string }
>("banks/import", async ({ type, file }, { getState, rejectWithValue }) => {
  try {
    const state = getState();

    // Important: DO NOT set Content-Type here (browser sets the boundary)
    const headers = {
      ...authHeaders(state),
    } as Record<string, string>;
    delete headers["Content-Type"];

    const form = new FormData();
    form.append("file", file, file.name);

    const res = await fetch(buildUrl(`banks/import/${type}`), {
      method: "POST",
      headers,
      body: form,
    });

    const json = (await res.json()) as BankImportApiResponse;
    if (!("success" in json) || !json.success) {
      return rejectWithValue((json as any)?.message || "Import failed");
    }
    return json.data;
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Network error");
  }
});
export const exportBanksThunk = createAsyncThunk<
  { blob: Blob; filename: string },
  { type: BankExportType },
  { state: RootStateWithBanks; rejectValue: string }
>("banks/export", async ({ type }, { getState, rejectWithValue }) => {
  try {
    const state = getState();

    // build Accept header per type
    const acceptMap: Record<BankExportType, string> = {
      csv: "text/csv",
      xls: "application/vnd.ms-excel",
      json: "application/json",
    };

    const headers = {
      ...authHeaders(state),
      accept: acceptMap[type] ?? "application/octet-stream",
    };

    const res = await fetch(buildUrl(`banks/export/${type}`), {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      return rejectWithValue(msg || `Export failed (${res.status})`);
    }

    // filename from Content-Disposition, fallback by type
    const cd = res.headers.get("content-disposition") || "";
    let filename = `banks.${type}`;
    const m = /filename\*?=(?:UTF-8'')?("?)([^";]+)\1/i.exec(cd);
    if (m?.[2]) filename = decodeURIComponent(m[2]);

    const blob = await res.blob();
    return { blob, filename };
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Network error");
  }
});
