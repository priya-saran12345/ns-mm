// src/modules/UserManagement/Categories/state/types.ts

/** ====== Category API entities ====== */
export interface Category {
  id: number;
  name: string;
  status: boolean;
  created_at?: string;
  updated_at?: string;
}

/** ====== MCC & MPP API entities ====== */
export interface MccItem {
  mcc_code: string;
  mcc_name: string;
}

export interface MppItem {
  mpp_code: string;
  mpp_name: string;
  mcc_code: string;
  mcc_name: string;
}

/** ====== Normalized pagination for our store ====== */
export interface CategoriesPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** ====== API response shapes – Categories ====== */
export interface CategoriesListApiSuccess {
  success: true;
  message: string;
  data: {
    categories: Category[];
    pagination: CategoriesPagination;
  };
  requestId?: string;
}
export interface CategoriesListApiError {
  success: false;
  message: string;
}
export type CategoriesListApiResponse =
  | CategoriesListApiSuccess
  | CategoriesListApiError;

/** ====== API response shapes – MCC ====== */
export interface MccListApiSuccess {
  success: true;
  message: string;
  data: {
    mccs: MccItem[];
    pagination: CategoriesPagination;
  };
  requestId?: string;
}
export interface MccListApiError {
  success: false;
  message: string;
}
export type MccListApiResponse = MccListApiSuccess | MccListApiError;

/** ====== API response shapes – MPP ====== */
export interface MppListApiSuccess {
  success: true;
  message: string;
  data: {
    mpps: MppItem[];
    pagination: CategoriesPagination;
  };
  requestId?: string;
}
export interface MppListApiError {
  success: false;
  message: string;
}
export type MppListApiResponse = MppListApiSuccess | MppListApiError;

/** ====== Thunk params ====== */
export interface FetchCategoriesParams {
  path: string; // "/api/v1/categories"
  page?: number;
  limit?: number;
  search?: string;
  method?: "GET";
}

// for MCC / MPP – simple page & limit
export interface FetchMccMppParams {
  page?: number;
  limit?: number;
  mcc_code?:string;
}

/** ====== Root/State contracts ====== */
export interface RootStateWithCategories {
  auth: { token: string | null };
  categories: CategoriesState;
}

export interface CategoriesState {
  /** Categories list */
  items: Category[];
  loading: boolean;
  error: string | null;

  page: number;
  limit: number;
  total: number;
  totalPages: number;
  search: string;

  /** MCC list */
  mccItems: MccItem[];
  loadingMcc: boolean;
  errorMcc: string | null;
  mccPagination: CategoriesPagination;

  /** MPP list */
  mppItems: MppItem[];
  loadingMpp: boolean;
  errorMpp: string | null;
  mppPagination: CategoriesPagination;
}
