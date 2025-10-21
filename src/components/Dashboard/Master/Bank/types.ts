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
}
