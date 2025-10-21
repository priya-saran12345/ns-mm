// API entities
export interface Village {
  village_code: string;
  village_name: string;
  district_code: string;
  district_name: string;
  tehsil_code: string;
  tehsil_name: string;
}

// API pagination (as returned by your villages endpoint)
export interface VillagesApiPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Normalized pagination for our store
export interface VillagesPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API response union
export type VillagesListApiResponse =
  | {
      success: true;
      message: string;
      data: { villages: Village[]; pagination: VillagesApiPagination };
    }
  | { success: false; message: string };

// Thunk params
export interface FetchVillagesParams {
  page?: number;
  limit?: number;
  search?: string;           // optional (if backend supports ?search=)
  district_code?: string;    // optional (if supported)
  tehsil_code?: string;      // optional (if supported)
}

// Root state shape (token + this slice)
export interface RootStateWithVillages {
  auth: { token: string | null };
  villages: VillagesState;
}

// Slice state
export interface VillagesState {
  items: Village[];
  loading: boolean;
  error: string | null;

  page: number;
  limit: number;
  total: number;
  totalPages: number;

  search: string;
  district_code?: string;
  tehsil_code?: string;
}
