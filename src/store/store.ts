import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import authReducer from './authSlice';
import uiReducer from './uiSlice';
import usersReducer from '../components/Dashboard/UserManagement/User_Management/slice';
import rolesSlice from '../components/Dashboard/Master/Roles/slice';
import categoriesSlice from '../components/Dashboard/Master/Category/slice';
import modulesSlice from '../components/Dashboard/Master/Modules/slice';
import villagesSlice from '../components/Dashboard/Master/Village/slice';

// Create store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    users: usersReducer,
    roles:rolesSlice,
    category:categoriesSlice,
    modules:modulesSlice,
    villages:villagesSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ✅ Typed hooks here in the same file
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
