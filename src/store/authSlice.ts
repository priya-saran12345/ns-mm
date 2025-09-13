// src/store/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../types/auth.types';
import { loginUser } from './authThunks';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: null, // no localStorage preload
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    // Optional: keep a manual loginSuccess if you use it elsewhere
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    // Optional: keep a sync logout if you prefer dispatch(logout())
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },

    // REMOVE initializeAuth: no storage to hydrate from
    // initializeAuth: (state) => {},
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? action.error.message ?? 'Login failed';
      })
      // Signup
      // Logout thunk clears state
      // .addCase(logoutUser.fulfilled, (state) => {
      //   state.user = null;
      //   state.token = null;
      //   state.isAuthenticated = false;
      //   state.isLoading = false;
      //   state.error = null;
      // });
  },
});

export const { setLoading, setError, logout, loginSuccess } = authSlice.actions;
export default authSlice.reducer;
