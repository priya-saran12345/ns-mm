import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ModulesState, UIModule } from "./types";
import { fetchModulesThunk } from "./thunk";

const initialState: ModulesState = {
  items: [],
  loading: false,
  error: null,

  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  search: "",
};

const modulesSlice = createSlice({
  name: "modules",
  initialState,
  reducers: {
    setModulesPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setModulesLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload;
    },
    setModulesSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1;
    },
    setModules(state, action: PayloadAction<UIModule[]>) {
      state.items = action.payload;
    },
    clearModulesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchModulesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModulesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        const p = action.payload.pagination;
        state.total = p.total;
        state.totalPages = p.totalPages;
        state.page = p.page;
        state.limit = p.limit;
      })
      .addCase(fetchModulesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch modules";
      });
  },
});

export const {
  setModulesPage,
  setModulesLimit,
  setModulesSearch,
  setModules,
  clearModulesError,
} = modulesSlice.actions;

export default modulesSlice.reducer;
