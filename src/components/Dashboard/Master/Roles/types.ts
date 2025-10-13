// src/modules/UserManagement/Roles/state/types.ts

/** ====== API entities ====== */
export interface RoleCategory {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
  category_id: number;
  status: boolean;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
  category?: RoleCategory | null;
}

/** ====== API pagination from backend ======
 * {
 *   currentPage: 1,
 *   totalPages: 1,
 *   totalItems: 3,
 *   itemsPerPage: 10,
 *   hasNextPage: false,
 *   hasPrevPage: false
 * }
 */
export interface RolesApiPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/** ====== Normalized pagination for our store ====== */
export interface RolesPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** ====== API response shapes ====== */
export interface RolesListApiSuccess {
  success: true;
  message: string;
  data: {
    roles: Role[];
    pagination: RolesApiPagination;
  };
}
export interface RolesListApiError {
  success: false;
  message: string;
}
export type RolesListApiResponse = RolesListApiSuccess | RolesListApiError;

export type RoleSingleApiResponse =
  | { success: true; message: string; data: Role }
  | { success: false; message: string };

export type RoleMutationResponse =
  | { success: true; message: string; data: Role }
  | { success: false; message: string };

/** ====== Thunk params ====== */
export interface FetchRolesParams {
  path: string;            // "/api/v1/roles"
  page?: number;
  limit?: number;
  search?: string;
  method?: "GET";
}

export interface CreateRoleRequest {
  name: string;
  category_id: number;
  status?: boolean;        // default true if omitted
}

export interface UpdateRoleRequest {
  name: string;
  category_id: number;
  status: boolean;
}

/** ====== Root/State contracts ====== */
export interface RootState {
  auth: { token: string | null };
  roles: RolesState;
}

export interface RolesState {
  items: Role[];
  loading: boolean;
  error: string | null;

  page: number;
  limit: number;
  total: number;
  totalPages: number;
  search: string;

  // detail (if you show a drawer in future)
  selected: Role | null;
  detailLoading: boolean;
  detailError: string | null;

  // mutations
  createLoading: boolean;
  createError: string | null;

  updateLoading: boolean;
  updateError: string | null;

  deleteLoading: boolean;
  deleteError: string | null;
}

/** ====== Table Row for AntD ====== */
export type RoleRow = {
  key: number;
  id: number;
  name: string;
  category: string;  // derived from category.name
  status: "Active" | "Pending" | "Rejected" | "Inactive";
};
