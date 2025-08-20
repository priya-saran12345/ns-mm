import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState, BreadcrumbItem } from '../types/ui.types';

const initialState: UIState = {
  sidebarCollapsed: false,
  currentPath: '/',
  breadcrumbs: [{ title: 'Dashboard' }],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    setCurrentPath: (state, action: PayloadAction<string>) => {
      state.currentPath = action.payload;
    },
    setBreadcrumbs: (state, action: PayloadAction<BreadcrumbItem[]>) => {
      state.breadcrumbs = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarCollapsed, setCurrentPath, setBreadcrumbs } = uiSlice.actions;
export default uiSlice.reducer;