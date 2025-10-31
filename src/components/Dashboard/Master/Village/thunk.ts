import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  RootStateWithVillages,
  FetchVillagesParams,
  VillagesListApiResponse,
  VillageRow,
  VillagesPagination,
} from "./types";
import type {
  RootStateWithVillages,
  MasterDataImportType,
  MasterDataExportType,
  MasterDataImportSummary,
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
 * GET /master-data/villages?page&limit[&search&district_code&tehsil_code]
 * (If your server exposes it at /master-data, switch the path below to "master-data")
 */
export const fetchVillagesThunk = createAsyncThunk<
  { items: VillageRow[]; pagination: VillagesPagination },
  FetchVillagesParams | void,
  { state: RootStateWithVillages; rejectValue: string }
>("villages/fetchList", async (args, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const page = args?.page ?? state.villages.page ?? 1;
    const limit = args?.limit ?? state.villages.limit ?? 10;

    const url = buildUrl("master-data", {
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

    // tolerate either "villages" or "items"
    const raw = (json.data?.villages ?? json.data?.items ?? []) as VillageRow[];
    const pagination = normalizePagination(json.data?.pagination);
    return { items: raw, pagination };
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Network error");
  }
});
export const importMasterDataThunk = createAsyncThunk<
  MasterDataImportSummary,
  { type: MasterDataImportType; file: File },
  { state: RootStateWithVillages; rejectValue: string }
>("villages/import", async ({ type, file }, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const headers = { ...authHeaders(state) } as Record<string, string>;
    // browser will set multipart boundary
    delete headers["Content-Type"];

    const form = new FormData();
    form.append("file", file, file.name);

    const res = await fetch(buildUrl(`master-data/import/${type}`), {
      method: "POST",
      headers,
      body: form,
    });

    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.success) {
      return rejectWithValue(json?.message || `Import failed (${res.status})`);
    }
    return json.data as MasterDataImportSummary;
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Network error");
  }
});

/** GET /master-data/export/{type} → blob */
export const exportMasterDataThunk = createAsyncThunk<
  { blob: Blob; filename: string },
  { type: MasterDataExportType },
  { state: RootStateWithVillages; rejectValue: string }
>("villages/export", async ({ type }, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const acceptMap: Record<MasterDataExportType, string> = {
      csv: "text/csv",
      xls: "application/vnd.ms-excel",
      json: "application/json",
    };

    const headers = {
      ...authHeaders(state),
      accept: acceptMap[type] ?? "application/octet-stream",
    };

    const res = await fetch(buildUrl(`master-data/export/${type}`), {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      return rejectWithValue(msg || `Export failed (${res.status})`);
    }

    const cd = res.headers.get("content-disposition") || "";
    let filename = `master-data.${type}`;
    const m = /filename\*?=(?:UTF-8'')?("?)([^";]+)\1/i.exec(cd);
    if (m?.[2]) filename = decodeURIComponent(m[2]);

    const blob = await res.blob();
    return { blob, filename };
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Network error");
  }
});
