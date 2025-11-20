// src/modules/UserManagement/Categories/state/state.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  CategoriesState,
  Category,
  CategoriesPagination,
} from "./types";
import {
  fetchCategoriesThunk,
  fetchMccListThunk,
  fetchMppListThunk,
} from "./thunk";
const defaultPagination: CategoriesPagination = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
};

const initialState: CategoriesState = {
  /** Categories */
  items: [],
  loading: false,
  error: null,

  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  search: "",

  /** MCC */
  mccItems: [],
  loadingMcc: false,
  errorMcc: null,
  mccPagination: { ...defaultPagination },

  /** MPP */
  mppItems: [],
  loadingMpp: false,
  errorMpp: null,
  mppPagination: { ...defaultPagination },
};
const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategoriesPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setCategoriesLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload;
    },
    setCategoriesSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1;
    },
    setCategories(state, action: PayloadAction<Category[]>) {
      state.items = action.payload;
    },
    clearCategoriesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    /** ===== CATEGORIES ===== */
    builder
      .addCase(fetchCategoriesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        const p = action.payload.pagination;
        state.total = p.total;
        state.totalPages = p.totalPages;
        state.page = p.page;
        state.limit = p.limit;
      })
      .addCase(fetchCategoriesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch categories";
      });

    /** ===== MCC LIST ===== */
    builder
      .addCase(fetchMccListThunk.pending, (state) => {
        state.loadingMcc = true;
        state.errorMcc = null;
      })
      .addCase(fetchMccListThunk.fulfilled, (state, action) => {
        state.loadingMcc = false;
        state.mccItems = action.payload.items;
        state.mccPagination = action.payload.pagination;
      })
      .addCase(fetchMccListThunk.rejected, (state, action) => {
        state.loadingMcc = false;
        state.errorMcc =
          (action.payload as string) || "Failed to fetch MCC list";
      });

    /** ===== MPP LIST ===== */
    builder
      .addCase(fetchMppListThunk.pending, (state) => {
        state.loadingMpp = true;
        state.errorMpp = null;
      })
      .addCase(fetchMppListThunk.fulfilled, (state, action) => {
        state.loadingMpp = false;
        state.mppItems = action.payload.items;
        state.mppPagination = action.payload.pagination;
      })
      .addCase(fetchMppListThunk.rejected, (state, action) => {
        state.loadingMpp = false;
        state.errorMpp =
          (action.payload as string) || "Failed to fetch MPP list";
      });
  },
});

export const {
  setCategoriesPage,
  setCategoriesLimit,
  setCategoriesSearch,
  setCategories,
  clearCategoriesError,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
