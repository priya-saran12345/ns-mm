// API entities
export interface UIModule {
  id: number;
  name: string;
  route: string | null;
  icon: string | null;
  parent_id: number | null;
  sort_order: number;
  status: boolean;
  created_at?: string;
  updated_at?: string;
  children?: UIModule[];
}

/** Swagger shows these pagination fields for modules */
export interface ModulesApiPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/** Normalized pagination for our store */
export interface ModulesPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type ModulesListApiResponse =
  | {
      success: true;
      message: string;
      data: { modules: UIModule[]; pagination: ModulesApiPagination };
    }
  | { success: false; message: string };

// Thunk params
export interface FetchModulesParams {
  path: string;             // "modules"
  page?: number;
  limit?: number;
  sort_by?: string;
  sort?: "asc" | "desc";
  search?: string;
}

export interface RootStateWithModules {
  auth: { token: string | null };
  modules: ModulesState;
}

export interface ModulesState {
  items: UIModule[];        // hierarchical (parents + children)
  loading: boolean;
  error: string | null;

  page: number;
  limit: number;
  total: number;
  totalPages: number;
  search: string;
}
