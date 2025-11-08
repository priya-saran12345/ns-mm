// One row in Master Data (village + hamlet + admin units)




export type MasterDataImportType = "CSV" | "xls" | "XLSX" | "JSON";
export type MasterDataExportType = "csv" | "xls" | "json";

export interface MasterDataImportSummary {
  inserted: number;
  updated: number;
  failed: number;
  errors?: Array<{ row?: number; message: string }>;
}

export interface VillageRow {
  id: number;

  state_name: string;
  state_code: string;

  district_name: string;
  district_code: string;

  tehsil_name: string;
  tehsil_code: string;

  village_name: string;
  village_code: string;

  hamlet_name: string;
  hamlet_code: string;

  mcc_name: string;
  mcc_code: string;

  mpp_name: string;
  mpp_code: string;

  status: boolean;
  created_at?: string;
  updated_at?: string;
}

// API pagination
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

// API response union (supports both "villages" and "items" keys)
export type VillagesListApiResponse =
  | {
      success: true;
      message: string;
      data: {
        villages?: VillageRow[];
        items?: VillageRow[];
        pagination: VillagesApiPagination;
      };
    }
  | { success: false; message: string };

// Thunk params
export interface FetchVillagesParams {
  page?: number;
  limit?: number;
  search?: string;
  district_code?: string;
  tehsil_code?: string;
}

// Root state shape (token + this slice)
export interface RootStateWithVillages {
  auth: { token: string | null };
  villages: VillagesState;
}

// Slice state
export interface VillagesState {
  items: VillageRow[];
  loading: boolean;
  error: string | null;

  page: number;
  limit: number;
  total: number;
  totalPages: number;

  search: string;
  district_code?: string;
  tehsil_code?: string;
    importing?: boolean;
  importResult?: MasterDataImportSummary | null;
  exporting?: boolean;

}
