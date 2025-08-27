// App.tsx
import React from "react";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { store } from "./store/store";

// Layout
import MainLayout from "./components/Layout/MainLayout";

// Pages
import DashboardPage from "./pages/Dashboard/DashboardPage";
import FieldUsers from "./pages/Dashboard/FieldUsersForm";
import SingleUserFormPage from "./pages/Dashboard/SingleUserFormPage";
import VillageMasterData from "./pages/Master/VillageMasterData";
import BankMasterData from "./pages/Master/BankMaster";
import AnimalBreed from "./pages/Master/AnimalBreed";
import AnimalType from "./pages/Master/AnimalType";
import Roles from "./pages/Master/Roles";
import ApprovalHierarchyPage from "./pages/Master/ApprovalHierarchy";
import FormData from "./pages/Master/FormData";
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
import EditInactive from "./pages/EditInactive";
import FinalApproval from "./pages/FinalApproval";
import ApprovedMem from "./pages/Member/ApprovedMember";
import RejectedMem from "./pages/Member/RejectedMem";
import PendingMem from "./pages/Member/PendingMem";
import Re_submitted from "./pages/Member/Re-submitted";
import USers from "./pages/UserManagement/UserManagement";
import SectionAlloatment from "./pages/UserManagement/SectionAlloatment";
import Asignmpp from "./components/Dashboard/UserManagement/AssignMpp";
import USerDetail from "./pages/UserManagement/Userdetail";

import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";

// Route Guards (Outlet-style)
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

const AppLayout: React.FC = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

const AppContent: React.FC = () => {
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

    { path: "/dashboard/edit-inactive", element: <EditInactive /> },
    { path: "/dashboard/final-approval", element: <FinalApproval /> },

    { path: "/users/approved", element: <ApprovedMem /> },
    { path: "/users/pending", element: <PendingMem /> },
    { path: "/users/rejected", element: <RejectedMem /> },
    { path: "/users/re-submitted", element: <Re_submitted /> },
    { path: "/users", element: <USers /> },
    { path: "/users/section-alloatment", element: <SectionAlloatment /> },
    { path: "/users/assign-mpp", element: <Asignmpp /> },
    { path: "/users/detail/:id", element: <USerDetail /> },
  ];

  return (
    <Router>
      <Routes>
        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Public-only (guests) */}
        <Route element={<PublicRoute />}>
          <Route path="/auth/login" element={<LoginPage />} />
          {/* <Route path="/auth/signup" element={<SignupPage />} /> */}
        </Route>

        {/* Private app area with layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {appRoutes.map((r) => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}
            {/* 404 inside app layout */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
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
