import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { BanksState, Bank } from "./types";
import { fetchBanksThunk } from "./thunk";

const initialState: BanksState = {
  items: [],
  loading: false,
  error: null,

  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,

  sort_by: "created_at",
  sort: "desc",
  search: "",
};

const banksSlice = createSlice({
  name: "banks",
  initialState,
  reducers: {
    setBanksPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setBanksLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload;
    },
    setBanksSort(
      state,
      action: PayloadAction<{ sort_by?: string; sort?: "asc" | "desc" }>,
    ) {
      if (action.payload.sort_by) state.sort_by = action.payload.sort_by;
      if (action.payload.sort) state.sort = action.payload.sort;
      state.page = 1;
    },
    setBanksSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1;
    },
    setBanks(state, action: PayloadAction<Bank[]>) {
      state.items = action.payload;
    },
    clearBanksError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanksThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanksThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        const p = action.payload.pagination;
        state.total = p.total;
        state.totalPages = p.totalPages;
        state.page = p.page;
        state.limit = p.limit;
      })
      .addCase(fetchBanksThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch banks";
      });
  },
});

export const {
  setBanksPage,
  setBanksLimit,
  setBanksSort,
  setBanksSearch,
  setBanks,
  clearBanksError,
} = banksSlice.actions;

export default banksSlice.reducer;
