import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { PermissionsState } from "./types";
import { fetchPermissionsByRoleThunk, savePermissionsForRoleThunk } from "./thunk";

const initialState: PermissionsState = {
  loading: false,
  saving: false,
  error: null,
  roleId: null,
  selectedIds: [],
};

const permissionsSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    // allow local UI toggling
    togglePermission(state, action: PayloadAction<number>) {
      const id = action.payload;
      if (state.selectedIds.includes(id)) {
        state.selectedIds = state.selectedIds.filter((x) => x !== id);
      } else {
        state.selectedIds = [...state.selectedIds, id];
      }
    },
    setPermissionChecked(state, action: PayloadAction<{ id: number; checked: boolean }>) {
      const { id, checked } = action.payload;
      const has = state.selectedIds.includes(id);
      if (checked && !has) state.selectedIds = [...state.selectedIds, id];
      if (!checked && has) state.selectedIds = state.selectedIds.filter((x) => x !== id);
    },
    clearPermissionsState(state) {
      state.loading = false;
      state.saving = false;
      state.error = null;
      state.roleId = null;
      state.selectedIds = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissionsByRoleThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedIds = [];
      })
      .addCase(fetchPermissionsByRoleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.roleId = action.payload.roleId;
        state.selectedIds = action.payload.selectedIds;
      })
      .addCase(fetchPermissionsByRoleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch permissions";
      })

      .addCase(savePermissionsForRoleThunk.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(savePermissionsForRoleThunk.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(savePermissionsForRoleThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = (action.payload as string) || "Failed to save permissions";
      });
  },
});

export const { togglePermission, setPermissionChecked, clearPermissionsState } =
  permissionsSlice.actions;

export default permissionsSlice.reducer;
