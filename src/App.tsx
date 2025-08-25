// App.tsx
import React, { useEffect } from "react";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { store } from "./store/store";
import { useAppDispatch } from "./hooks/redux.hooks";
import { initializeAuth } from "./store/authSlice";

// Layout
import MainLayout from "./components/Layout/MainLayout";

// Pages (IMPORTANT: remove MainLayout wrapper from these pages)
import DashboardPage from "./pages/Dashboard/DashboardPage";
import FieldUsers from "./pages/Dashboard/FieldUsersForm";
import SingleUserFormPage from "./pages/Dashboard/SingleUserFormPage";
import VillageMasterData from "./pages/Master/VillageMasterData";
import BankMasterData from "./pages/Master/BankMaster";
import AnimalBreed from "./pages/Master/AnimalBreed";
import AnimalType from "./pages/Master/AnimalType";
import Roles from "./pages/Master/Roles";
import ApprovalHierarchyPage from "./pages/Master/ApprovalHierarchy";
import FormData from "./pages/Utility/FormList";
import FormList from "./pages/Utility/FormList";
import MemberCode from "./pages/Utility/MemberCode";
import FolioNumber from "./pages/Utility/FolioNumber";
import Facilitator from "./pages/Utility/Facilitator";
import Approvaluser from "./pages/Utility/Approvaluser";
import MCC_mpp from "./pages/Utility/Mcc-Mpp";
import Old_member from "./pages/Utility/Old-member";
import MemberReport from "./pages/Report/MemberReport";
import GeneratedReports from "./pages/Report/GeneratedReports";
import AnimalReport from "./pages/Report/AnimalReport";
// import EditInactive from "./pages/EditInactive"; // <- uncomment when available

// import ProtectedRoute from "./components/ProtectedRoute";
// import PublicRoute from "./components/PublicRoute";
// import LoginPage from "./pages/LoginPage";
// import SignupPage from "./pages/SignupPage";

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Layout route element: wraps children with MainLayout and renders <Outlet />
  const AppLayout: React.FC = () => (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );

  // Optional: if you want to guard everything under the layout:
  // const Guarded: React.FC = () => (
  //   <ProtectedRoute>
  //     <Outlet />
  //   </ProtectedRoute>
  // );

  // DRY route table for “in-app” pages
  const appRoutes: { path: string; element: React.ReactElement }[] = [
    { path: "/dashboard", element: <DashboardPage /> },
    { path: "/dashboard/fieldusers", element: <FieldUsers /> },
    { path: "/dashboard/fieldusers/:id", element: <SingleUserFormPage /> },

    { path: "/master/villagedata", element: <VillageMasterData /> },
    { path: "/master/bank-master", element: <BankMasterData /> },
    { path: "/master/animal-breed-master", element: <AnimalBreed /> },
    { path: "/master/animal-type-master", element: <AnimalType /> },
    { path: "/master/roles", element: <Roles /> },
    { path: "/master/approval-hierarchy", element: <ApprovalHierarchyPage /> },
    { path: "/master/form-data", element: <FormData /> },

    { path: "/utility/form-list", element: <FormList /> },
    { path: "/utility/member-code", element: <MemberCode /> },
    { path: "/utility/folio-number", element: <FolioNumber /> },
    { path: "/utility/facilitator", element: <Facilitator /> },
    { path: "/utility/approvaluser", element: <Approvaluser /> },
    { path: "/utility/mcc_mpp-transfer", element: <MCC_mpp /> },
    { path: "/utility/old-member", element: <Old_member /> },

    { path: "/reports/member", element: <MemberReport /> },
    { path: "/reports/generated-report", element: <GeneratedReports /> },
    { path: "/reports/animal-report", element: <AnimalReport /> },

    // { path: "/dashboard/edit-inactive", element: <EditInactive /> },
  ];

  return (
    <Router>
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Public (no layout) */}
        {/* 
        <Route path="/auth/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/auth/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        */}

        {/* App area with a universal MainLayout */}
        <Route element={<AppLayout />}>
          {/* If using auth guard for all app pages, nest a Guard: 
          <Route element={<Guarded />}>
            {appRoutes.map(r => <Route key={r.path} path={r.path} element={r.element} />)}
          </Route>
          */}
          {appRoutes.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Route>

        {/* Catch-all */}
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
            colorPrimary: "#2563EB",
            colorSuccess: "#52c41a",
            colorWarning: "#faad14",
            colorError: "#f5222d",
            colorInfo: "#D0DFFF",
            borderRadius: 8,
            fontFamily: "Inter, system-ui, sans-serif",
          },
          components: {
            Card: { borderRadiusLG: 12 },
            Button: { borderRadius: 8, controlHeight: 40 },
            Input: { borderRadius: 8, controlHeight: 40 },
            Menu: { borderRadius: 8 },
          },
        }}
      >
        <AppContent />
      </ConfigProvider>
    </Provider>
  );
};

export default App;
