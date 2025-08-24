import React, { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './store/store';
import {  useAppDispatch } from './hooks/redux.hooks';
import { initializeAuth } from './store/authSlice';
// import LoginPage from './pages/LoginPage';
// import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import FieldUsers from './pages/FieldUsersForm';
import SingleUserFormPage from './pages/SingleUserFormPage';
import VillageMasterData from './pages/VillageMasterData';
import BankMasterData from './pages/BankMaster';
import AnimalBreed from './pages/AnimalBreed';
import AnimalType from './pages/AnimalType';
import Roles from './pages/Roles';
import ApprovalHierarchyPage from './pages/ApprovalHierarchy';
import FormData from './pages/FormData';
// import ProtectedRoute from './components/ProtectedRoute';
// import PublicRoute from './components/PublicRoute';
const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);
  return (
    <Router>
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Public routes */}
        {/* <Route 
          path="/auth/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="/auth/signup" 
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          } 
        /> */}
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            // <ProtectedRoute>
              <DashboardPage />
            // </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/fieldusers" 
          element={
            // <ProtectedRoute>
              <FieldUsers/>
            // </ProtectedRoute>
          } 
        />
<Route 
  path="/dashboard/fieldusers/:id" 
  element={
    // <ProtectedRoute>
      < SingleUserFormPage/>
    // </ProtectedRoute>
  } 
/>
<Route 
  path="/master/villagedata" 
  element={
    // <ProtectedRoute>
      < VillageMasterData/>
    // </ProtectedRoute>
  } 
/>
<Route 
  path="/master/bank-master" 
  element={
    // <ProtectedRoute>
      < BankMasterData/>
    // </ProtectedRoute>
  } 
/>
<Route 
  path="/master/animal-breed-master" 
  element={
    // <ProtectedRoute>
      < AnimalBreed/>
    // </ProtectedRoute>
  } 
/>
<Route 
  path="/master/animal-type-master" 
  element={
    // <ProtectedRoute>
      < AnimalType/>
    // </ProtectedRoute>
  } 
/>
<Route 
  path="/master/roles" 
  element={
    // <ProtectedRoute>
      < Roles/>
    // </ProtectedRoute>
  } 
/>
<Route 
  path="/master/approval-hierarchy" 
  element={
    // <ProtectedRoute>
      < ApprovalHierarchyPage/>
    // </ProtectedRoute>
  } 
/>
<Route 
  path="/master/form-data" 
  element={
    // <ProtectedRoute>
      < FormData/>
    // </ProtectedRoute>
  } 
/>
        
        {/* Catch all route - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#2563EB',
            colorSuccess: '#52c41a',
            colorWarning: '#faad14',
            colorError: '#f5222d',
            colorInfo: '#D0DFFF',
            borderRadius: 8,
            fontFamily: 'Inter, system-ui, sans-serif',
          },
          components: {
            Card: {
              borderRadiusLG: 12,
            },
            Button: {
              borderRadius: 8,
              controlHeight: 40,
            },
            Input: {
              borderRadius: 8,
              controlHeight: 40,
            },
            Menu: {
              borderRadius: 8,
            },
          },
        }}
      >
        <AppContent />
      </ConfigProvider>
    </Provider>
  );
};

export default App;