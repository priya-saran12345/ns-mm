// src/modules/UserManagement/Categories/state/state.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CategoriesState, Category } from "./types";
import { fetchCategoriesThunk } from "./thunk";

const initialState: CategoriesState = {
  items: [],
  loading: false,
  error: null,

  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  search: "",
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
