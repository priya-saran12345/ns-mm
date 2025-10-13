// src/types/auth.types.ts
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

/* ===== Request types ===== */
export interface LoginCredentials {
  email: string;
  password: string;
}

/* ===== Backend response shapes (raw) ===== */
export interface RawModule {
  id: number;
  name: string;
  status: boolean;
  parent_id: number | null;
}

export interface RawPermission {
  id: number;
  module_id: number;
  status: boolean;
  module: RawModule;
}

export interface RawUser {
  id: number | string;
  email: string;
  role?: string | null;      // backend may return null
  role_id?: number | null;   // backend may return number
  first_name?: string | null;
  last_name?: string | null;
  last_login?: string | null;
  name?: string | null;      // (if backend ever sends)
  username?: string | null;  // (fallback)
  avatar?: string | null;
  createdAt?: string | null; // optional from some backends
}

/* ===== Normalized app user ===== */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  createdAt: string;
  lastLogin: string;
}

/* ===== Auth response ===== */
export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    token?: string;
    refreshToken?: string;
    user?: RawUser;
    permissions?: RawPermission[];
  };
  requestId?: string;
}
