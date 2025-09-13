export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'manager';
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  // add role exactly as backend expects
  role: "field_user" | "admin" | "user" | "manager";
}
export interface AuthResponse{
    success: boolean,
  message: string,
  data: {
    user: string,
    accessToken: string,
    refreshToken: string
  },
  requestId: string

}