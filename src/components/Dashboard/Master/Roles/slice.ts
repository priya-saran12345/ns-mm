// src/modules/UserManagement/Roles/state/state.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RolesState, Role } from "./types";
import {
  fetchRolesThunk,
  fetchRoleByIdThunk,
  createRoleThunk,
  updateRoleThunk,
  deleteRoleThunk,
  toRow,
} from "./thunk";

const initialState: RolesState = {
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

  createLoading: false,
  createError: null,

  updateLoading: false,
  updateError: null,

  deleteLoading: false,
  deleteError: null,
};

const rolesSlice = createSlice({
  name: "roles",
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
    clearSelected(state) {
      state.selected = null;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /** LIST */
      .addCase(fetchRolesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRolesThunk.fulfilled, (state, action) => {
        state.loading = false;
        // We keep raw roles minimal: reconstruct from RoleRow is lossy. Prefer fetching again when opening edit.
        // If you need full Role here, change thunks to return Role[] too.
        const { rows, pagination } = action.payload;
        // store a minimal Role[] for grid (id/name/category_id/status/category)
        state.items = rows.map((r) => ({
          id: r.id,
          name: r.name,
          category_id: 0, // unknown in grid view; will be loaded on detail
          status: r.status === "Active",
          category: { id: 0, name: r.category },
        })) as Role[];

        state.total = pagination.total;
        state.totalPages = pagination.totalPages;
        state.page = pagination.page;
        state.limit = pagination.limit;
      })
      .addCase(fetchRolesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch roles";
      })

      /** SINGLE */
      .addCase(fetchRoleByIdThunk.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchRoleByIdThunk.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selected = action.payload;
      })
      .addCase(fetchRoleByIdThunk.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = (action.payload as string) || "Failed to fetch role";
      })

      /** CREATE */
      .addCase(createRoleThunk.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createRoleThunk.fulfilled, (state, action) => {
        state.createLoading = false;
        const created = action.payload;
        // insert at top
        state.items = [{ ...created }, ...state.items];
        state.total += 1;
      })
      .addCase(createRoleThunk.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = (action.payload as string) || "Failed to create role";
      })

      /** UPDATE */
      .addCase(updateRoleThunk.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateRoleThunk.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updated = action.payload;
        const idx = state.items.findIndex((r) => r.id === updated.id);
        if (idx >= 0) state.items[idx] = { ...state.items[idx], ...updated };
        if (state.selected?.id === updated.id) state.selected = updated;
      })
      .addCase(updateRoleThunk.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = (action.payload as string) || "Failed to update role";
      })

      /** DELETE */
      .addCase(deleteRoleThunk.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteRoleThunk.fulfilled, (state, action) => {
        state.deleteLoading = false;
        const { id } = action.payload;
        state.items = state.items.filter((r) => r.id !== id);
        if (state.selected?.id === id) state.selected = null;
        if (state.total > 0) state.total -= 1;
      })
      .addCase(deleteRoleThunk.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = (action.payload as string) || "Failed to delete role";
      });
  },
});

export const { setPage, setLimit, setSearch, clearSelected } = rolesSlice.actions;
export default rolesSlice.reducer;
