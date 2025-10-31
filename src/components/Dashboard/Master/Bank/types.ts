  // API entity
  export interface Bank {
    id: number;
    bank_name: string;
    ifsc_code: string;
    branch: string;
    status: boolean;
    created_at?: string;
    updated_at?: string;
  }

  // API pagination (as returned by your banks endpoint)
  export interface BanksApiPagination {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
  }

  // Normalized pagination for our store
  export interface BanksPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }

  // API response union
  export type BanksListApiResponse =
    | {
        success: true;
        message: string;
        data: { items: Bank[]; pagination: BanksApiPagination };
      }
    | { success: false; message: string };

  // Thunk params
  export interface FetchBanksParams {
    page?: number;
    limit?: number;
    sort_by?: string;
    sort?: "asc" | "desc";
    search?: string; // (optional) only if backend supports it
  }

  // Root state shape (token + this slice)
  export interface RootStateWithBanks {
    auth: { token: string | null };
    banks: BanksState;
  }

  // Slice state
  export interface BanksState {
    items: Bank[];
    loading: boolean;
    error: string | null;

    page: number;
    limit: number;
    total: number;
    totalPages: number;

    sort_by: string;
    sort: "asc" | "desc";
    search: string;
    
    retrieving?: boolean;
    updating?: boolean;
    creating?: boolean;   // ← NEW
    selected?: Bank | null;
    importing: boolean,
  importResult?: any | null;
  exporting?: boolean;     // ← NEW

    

  }
  // --- keep your existing types and add the following ---

  /** Single bank GET response */
  export type BankByIdApiResponse =
    | { success: true; message: string; data: Bank }
    | { success: false; message: string };

  /** PUT /banks/{id} request body */
  export interface BankUpdateRequest {
    bank_name: string;
    ifsc_code: string;
    branch: string;
    status: boolean;
  }

  /** PUT /banks/{id} response (usually returns updated entity) */
  export type BankUpdateApiResponse =
    | { success: true; message: string; data: Bank }
    | { success: false; message: string };

  // Extend slice state
  export interface BanksState {
    items: Bank[];
    loading: boolean;
    error: string | null;

    page: number;
    limit: number;
    total: number;
    totalPages: number;

    sort_by: string;
    sort: "asc" | "desc";
    search: string;

    // ↓ new flags for edit modal lifecycle
    retrieving?: boolean;
    updating?: boolean;
    selected?: Bank | null;
  }
  export interface BankCreateRequest {
    bank_name: string;
    ifsc_code: string;
    branch: string;
    status: boolean;
  }
  export type BankCreateApiResponse =
    | { success: true; message: string; data: Bank }
    | { success: false; message: string };

// ===== Import API types =====
export type BankImportType = "CSV" | "XLS" | "XLSX" | "JSON";

export interface BankImportSummary {
  inserted: number;
  updated: number;
  failed: number;
  // optional per-row errors if your API returns them
  errors?: Array<{ row?: number; message: string }>;
}

export type BankImportApiResponse =
  | { success: true; message: string; data: BankImportSummary }
  | { success: false; message: string };

export type BankExportType = "csv" | "xls" | "json";
