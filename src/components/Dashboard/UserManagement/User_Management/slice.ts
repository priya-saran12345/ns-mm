// src/modules/UserManagement/state/state.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UsersState, User } from "./types";
import {
  fetchUsersThunk,
  fetchUserByIdThunk,
  updateUserThunk,
  deactivateUserThunk, // ← import together
} from "./thunks";

const initialState: UsersState = {
  items: [],
  loading: false,
  error: null,

  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  search: "",

  selected: null,
  detailLoading: false,
  detailError: null,

  updateLoading: false,
  updateError: null,

  deactivateLoading: false,
  deactivateError: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1;
    },
    toggleBlockedLocal(state, action: PayloadAction<{ id: number; is_block: boolean }>) {
      const idx = state.items.findIndex((u) => u.id === action.payload.id);
      if (idx >= 0) state.items[idx] = { ...state.items[idx], is_block: action.payload.is_block };
    },
    clearSelected(state) {
      state.selected = null;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LIST
      .addCase(fetchUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { rows, pagination } = action.payload;

        // Keep a minimal copy derived from rows so email shows in UI
        state.items = rows.map((r) => ({
          id: r.id,
          username: r.username,
          email: r.email,
          role: r.role as User["role"],
          first_name: r.name.split(" ")[0] ?? "",
          last_name: r.name.split(" ").slice(1).join(" "),
          address: "",
          is_block: false,
          status: true,
        })) as User[];

        state.total = pagination.total;
        state.totalPages = pagination.totalPages;
        state.page = pagination.page;
        state.limit = pagination.limit;
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch users";
      })

      // SINGLE
      .addCase(fetchUserByIdThunk.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchUserByIdThunk.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selected = action.payload;
      })
      .addCase(fetchUserByIdThunk.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = (action.payload as string) || "Failed to fetch user";
      })

      // UPDATE
      .addCase(updateUserThunk.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updated = action.payload;
        state.selected = updated;
        const idx = state.items.findIndex((u) => u.id === updated.id);
        if (idx >= 0) state.items[idx] = { ...state.items[idx], ...updated };
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = (action.payload as string) || "Failed to update user";
      })

      // DEACTIVATE  ← remove the stray semicolon before this block
      .addCase(deactivateUserThunk.pending, (state) => {
        state.deactivateLoading = true;
        state.deactivateError = null;
      })
      .addCase(deactivateUserThunk.fulfilled, (state, action) => {
        state.deactivateLoading = false;
        const updated = action.payload;
        const idx = state.items.findIndex((u) => u.id === updated.id);
        if (idx >= 0) state.items[idx] = { ...state.items[idx], ...updated };
        if (state.selected?.id === updated.id) state.selected = updated;
      })
      .addCase(deactivateUserThunk.rejected, (state, action) => {
        state.deactivateLoading = false;
        state.deactivateError = (action.payload as string) || "Failed to deactivate user";
      });
  },
});

export const { setPage, setLimit, setSearch, toggleBlockedLocal, clearSelected } =
  usersSlice.actions;

export default usersSlice.reducer;
