import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchApprovalHierarchyThunk,
  addApprovalHierarchy,
  updateApprovalHierarchy,
} from "./thunk";
import type { ApprovalHierarchyRow } from "./types";

type State = {
  rows: ApprovalHierarchyRow[];
  loading: boolean;
  error: string | null;
  search: string;
  page: number;
  limit: number;
  total: number;
};

const initialState: State = {
  rows: [],
  loading: false,
  error: null,
  search: "",
  page: 1,
  limit: 10,
  total: 0,
};

const approvalHierarchySlice = createSlice({
  name: "approvalHierarchy",
  initialState,
  reducers: {
    setApprovalHierarchyFilters(
      state,
      action: PayloadAction<{ search?: string }>
    ) {
      state.search = action.payload.search ?? state.search;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchApprovalHierarchyThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApprovalHierarchyThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.rows = action.payload.rows ?? [];
        state.total = action.payload.total ?? 0;
      })
      .addCase(fetchApprovalHierarchyThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Failed to fetch";
      })

      // ADD
      .addCase(addApprovalHierarchy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addApprovalHierarchy.fulfilled, (state, action) => {
        state.loading = false;
        const newRow = action.payload?.data ?? action.payload;
        // push only if API returns the created row; otherwise re-fetch list
        if (newRow) state.rows.push(newRow);
      })
      .addCase(addApprovalHierarchy.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Failed to add";
      })

      // UPDATE
      .addCase(updateApprovalHierarchy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApprovalHierarchy.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload?.data ?? action.payload;
        if (!updated?.id) return;
        const idx = state.rows.findIndex((r) => r.id === updated.id);
        if (idx >= 0) state.rows[idx] = updated;
      })
      .addCase(updateApprovalHierarchy.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Failed to update";
      });
  },
});

export const { setApprovalHierarchyFilters } = approvalHierarchySlice.actions;
export default approvalHierarchySlice.reducer;
