// src/modules/UserManagement/Categories/state/types.ts

/** ====== API entities ====== */
export interface Category {
  id: number;
  name: string;
  status: boolean;
  created_at?: string;
  updated_at?: string;
}

/** ====== Normalized pagination for our store ====== */
export interface CategoriesPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** ====== API response shapes ====== */
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

/** ====== Thunk params ====== */
export interface FetchCategoriesParams {
  path: string; // "/api/v1/categories"
  page?: number;
  limit?: number;
  search?: string;
  method?: "GET";
}

/** ====== Root/State contracts ====== */
export interface RootStateWithCategories {
  auth: { token: string | null };
  categories: CategoriesState;
}

export interface CategoriesState {
  items: Category[];
  loading: boolean;
  error: string | null;

  page: number;
  limit: number;
  total: number;
  totalPages: number;
  search: string;
}
