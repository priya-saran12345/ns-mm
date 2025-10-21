import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { VillagesState, Village } from "./types";
import { fetchVillagesThunk } from "./thunk";

const initialState: VillagesState = {
  items: [],
  loading: false,
  error: null,

  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,

  search: "",
  district_code: undefined,
  tehsil_code: undefined,
};

const villagesSlice = createSlice({
  name: "villages",
  initialState,
  reducers: {
    setVillagesPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setVillagesLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload;
    },
    setVillagesSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1;
    },
    setVillageFilters(
      state,
      action: PayloadAction<{ district_code?: string; tehsil_code?: string }>
    ) {
      state.district_code = action.payload.district_code;
      state.tehsil_code = action.payload.tehsil_code;
      state.page = 1;
    },
    setVillages(state, action: PayloadAction<Village[]>) {
      state.items = action.payload;
    },
    clearVillagesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVillagesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVillagesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        const p = action.payload.pagination;
        state.total = p.total;
        state.totalPages = p.totalPages;
        state.page = p.page;
        state.limit = p.limit;
      })
      .addCase(fetchVillagesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch villages";
      });
  },
});

export const {
  setVillagesPage,
  setVillagesLimit,
  setVillagesSearch,
  setVillageFilters,
  setVillages,
  clearVillagesError,
} = villagesSlice.actions;

export default villagesSlice.reducer;
