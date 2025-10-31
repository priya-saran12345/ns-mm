import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { BanksState, Bank } from "./types";
import {
  fetchBanksThunk,
  retrieveBankThunk,
  updateBankThunk,
  createBankThunk,   // ← NEW
} from "./thunk";
import type { BankImportSummary } from "./types";
import { importBanksThunk, exportBanksThunk } from "./thunk";

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

  retrieving: false,
  updating: false,
  creating: false,   // ← NEW
  selected: null,
  importing: false,
  importResult: null as BankImportSummary | null,
  exporting: false,        // ← NEW


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
      action: PayloadAction<{ sort_by?: string; sort?: "asc" | "desc" }>
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
    clearSelectedBank(state) {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // list
        .addCase(importBanksThunk.pending, (state) => {
    state.importing = true;
    state.error = null;
    state.importResult = null;
  })
  .addCase(importBanksThunk.fulfilled, (state, action) => {
    state.importing = false;
    state.importResult = action.payload;
  })
  .addCase(importBanksThunk.rejected, (state, action) => {
    state.importing = false;
    state.error = (action.payload as string) || "Import failed";
  })

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
      })

      // retrieve
      .addCase(retrieveBankThunk.pending, (state) => {
        state.retrieving = true;
        state.error = null;
        state.selected = null;
      })
      .addCase(retrieveBankThunk.fulfilled, (state, action) => {
        state.retrieving = false;
        state.selected = action.payload;
      })
      .addCase(retrieveBankThunk.rejected, (state, action) => {
        state.retrieving = false;
        state.error = (action.payload as string) || "Failed to load bank";
      })

      // update
      .addCase(updateBankThunk.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateBankThunk.fulfilled, (state, action) => {
        state.updating = false;
        const idx = state.items.findIndex((b) => b.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        state.selected = action.payload;
      })
      .addCase(updateBankThunk.rejected, (state, action) => {
        state.updating = false;
        state.error = (action.payload as string) || "Failed to update bank";
      })

      // create
      .addCase(createBankThunk.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createBankThunk.fulfilled, (state, action) => {
        state.creating = false;
        // put new row at top of current page view
        state.items = [action.payload, ...state.items];
        state.total += 1;
      })
      .addCase(createBankThunk.rejected, (state, action) => {
        state.creating = false;
        state.error = (action.payload as string) || "Failed to create bank";
      }) 
       .addCase(exportBanksThunk.pending, (state) => {
    state.exporting = true;
    state.error = null;
  })
  .addCase(exportBanksThunk.fulfilled, (state) => {
    state.exporting = false;
  })
  .addCase(exportBanksThunk.rejected, (state, action) => {
    state.exporting = false;
    state.error = (action.payload as string) || "Export failed";
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
  clearSelectedBank,
} = banksSlice.actions;

export default banksSlice.reducer;
