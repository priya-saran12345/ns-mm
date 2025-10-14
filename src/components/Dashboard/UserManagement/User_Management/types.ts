// src/modules/UserManagement/state/types.ts

export type UserRole = "admin" | "super_admin" | "field_user" | string;

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  phone?: string | null;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  is_block: boolean;
  status: boolean;
  otp_time?: string | null;
  last_login?: string | null;
  last_logout?: string | null;
  password_reset_expires?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface UsersPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UsersApiSuccess {
  success: true;
  message: string;
  data: {
    users: User[];
    pagination: UsersPagination;
  };
}

export interface UsersApiError {
  success: false;
  message: string;
}

export type UsersApiResponse = UsersApiSuccess | UsersApiError;

export interface FetchUsersParams {
  path: string; // e.g. "/api/v1/user"
  page?: number;
  limit?: number;
  search?: string;
  method?: "GET";
}

export interface RootState {
  auth: { token: string | null };
  users: UsersState;
}

export interface UsersState {
  items: User[];
  loading: boolean;
  error: string | null;

  page: number;
  limit: number;
  total: number;
  totalPages: number;
  search: string;

  // detail modal
  selected: User | null;
  detailLoading: boolean;
  detailError: string | null;

  // update
  updateLoading: boolean;
  updateError: string | null;
    deactivateLoading: boolean; // 👈
    deactivateError: string | null; // 👈
    createLoading: string | null; // 👈
    createError: boolean; // 👈

}

/** -------- PUT payload (exactly what you said you’ll send) -------- */
export interface UpdateUserRequest {
  username: string;
  email: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  is_block: boolean;
  status: boolean;
}

export type UpdateUserResponse =
  | { success: true; message: string; data: User }
  | { success: false; message: string };
type DeactivateUserResponse =
  | { success: true; message: string; data: User }
  | { success: false; message: string };
