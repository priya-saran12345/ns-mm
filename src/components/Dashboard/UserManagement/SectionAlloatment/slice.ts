import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import type {
  AssignedPermissionsState,
  APTableRow,
  RootStateWithAP,
  AssignedPermission,
} from "./types";
import { fetchAssignedPermissionsThunk } from "./thunk";

const initialState: AssignedPermissionsState = {
  items: [],
  loading: false,
  error: null,

  search: "",
  page: 1,
  limit: 10,
};

const slice = createSlice({
  name: "assignedPermissions",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload;
      state.page = 1;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchAssignedPermissionsThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    b.addCase(fetchAssignedPermissionsThunk.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.items = payload;
    });
    b.addCase(fetchAssignedPermissionsThunk.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = (payload as string) || "Failed to fetch permissions";
    });
  },
});

export const { setSearch, setPage, setLimit } = slice.actions;
export default slice.reducer;

// ------------------ Selectors ------------------
const selectSelf = (s: RootStateWithAP) => s.assignedPermissions;

function fullName(u: AssignedPermission["user"]) {
  const fn = (u.first_name || "").trim();
  const ln = (u.last_name || "").trim();
  const both = [fn, ln].filter(Boolean).join(" ");
  if (both) return both;
  // fallback to email local-part
  return u.email?.split("@")[0] || "User";
}

export const selectFilteredRows = createSelector(
  [selectSelf],
  (state): APTableRow[] => {
    const q = state.search.trim().toLowerCase();
    const rows: APTableRow[] = state.items.map((it) => ({
      key: it.id,
      id: it.user_id ?? it.id,
      name: fullName(it.user),
      email: it.user?.email ?? "",
      assignedSection: it.formsteps_ids?.length ? it.formsteps_ids.join(",") : "-",
      assignedMcc: it.mcc_codes?.length ? it.mcc_codes.join(",") : "-",
      assignedMpp: it.mpp_codes?.length ? it.mpp_codes.join(",") : "-",
    }));

    if (!q) return rows;

    return rows.filter((r) =>
      String(r.id).includes(q) ||
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.assignedSection.toLowerCase().includes(q) ||
      r.assignedMcc.toLowerCase().includes(q) ||
      r.assignedMpp.toLowerCase().includes(q)
    );
  }
);

export const selectPagedRows = createSelector(
  [selectSelf, selectFilteredRows],
  (state, filtered): { rows: APTableRow[]; total: number; from: number; to: number } => {
    const { page, limit } = state;
    const total = filtered.length;
    const start = (page - 1) * limit;
    const end = Math.min(page * limit, total);
    return { rows: filtered.slice(start, end), total, from: total ? start + 1 : 0, to: end };
  }
);
