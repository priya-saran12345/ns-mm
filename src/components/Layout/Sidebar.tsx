// src/components/Sidebar.tsx
import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks/redux.hooks";
import { toggleSidebar } from "../../store/uiSlice";
import { logout } from "../../store/authSlice";
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiDatabase,
  FiTruck,
  FiDollarSign,
  FiBarChart2,
} from "react-icons/fi";

const { Sider } = Layout;

// Sidebar Config JSON
export const sidebarItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <FiHome size={18} />,
    path: "/dashboard",
  },
  {
    key: "masterData",
    label: "Master Data",
    icon: <FiDatabase size={18} />,
    children: [
      { key: "villagemasterdata", label: "Village Master Data", path: "/master/villagedata" },
      { key: "bankmasterdata", label: "Bank Master Data", path: "/master/bank-master" },
      { key: "animalBreadmasterdata", label: "Animal Bread Master ", path: "/master/animal-breed-master" },
      { key: "animalTypemaster", label: "Animal Type Master ", path: "/master/animal-type-master" },
      { key: "Roles", label: "Roles Master ", path: "/master/roles" },
      { key: "Approvalhierarchy", label: "Approval Hierarchy ", path: "/master/approval-hierarchy" },
      { key: "FormData", label: "Form Data ", path: "/master/form-data" },
    ],
  },
  // {
  //   key: "userManagement",
  //   label: "User Management",
  //   icon: <FiUsers size={18} />,
  //   children: [
  //     { key: "users", label: "All Users", path: "/users" },
  //     { key: "roles", label: "Section Alloatment", path: "/roles" },
  //   ],
  // },
  // {
  //   key: "membersForm",
  //   label: "Members Form",
  //   icon: <FiUsers size={18} />,
  //   children: [
  //     { key: "approvedmem", label: "Approved Members", path: "/users" },
  //     { key: "pendingmem", label: "Pending Members", path: "/users" },
  //     { key: "rejectedmem", label: "Rejected Members", path: "/users" },
  //     { key: "re-submem", label: "Re-submitted Alloatment", path: "/roles" },
  //   ],
  // },
  {
    key: "uilities",
    label: "Utilies",
    icon: <FiTruck size={18} />,
    children: [
      { key: "formlist", label: "Form List", path: "/utility/form-list" },
      { key: "membercode", label: "Member Code", path: "/utility/member-code" },
      { key: "Foliocode", label: "Folio Code ", path: "/utility/folio-number" },
      { key: "facilitator", label: "Facilitator Form Transfer", path: "/utility/facilitator" },
      { key: "approvaluser", label: "Approval User  Form Transfer", path: "/utility/approvaluser" },
      { key: "Mcc/Mpp ", label: "MCC/MPP Transfer", path: "/utility/mcc_mpp-transfer" },
      { key: "oldmember", label: "Old Members", path: "/utility/old-member" },
    ],
  },
  // {
  //   key: "finalapproval",
  //   label: "Final Approval",
  //   icon: <FiDollarSign size={18} />,
  //   children: [
  //     { key: "allforms", label: "All Forms", path: "/finance/payments" },
  //   ],
  // },
  {
    key: "reports",
    label: "Reports",
    icon: <FiBarChart2 size={18} />,
    children: [
      { key: "memberrepo", label: "Member Form Report", path: "/reports/collection" },
      { key: "animalrepo", label: "Animal Report", path: "/reports/transport" },
      { key: "generatedrepo", label: "Generated Report", path: "/reports/finance" },
    ],
  },
  // {
  //   key: "fedi",
  //   label: "Form Edit/Delete/Inactive",
  //   icon: <FiBarChart2 size={18} />,
  //   children: [
  //     { key: "allform", label: "All Forms", path: "/reports/collection" },
  //   ],
  // },
  {
    key: "settings",
    label: "Settings",
    icon: <FiSettings size={18} />,
    path: "/settings",
    bottom: true,
  },
  {
    key: "logout",
    label: "Logout",
    icon: <FiLogOut size={18} />,
    action: "logout",
    bottom: true,
  },
];

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed } = useAppSelector((state) => state.ui);

  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const findParentKey = (items: any[], path: string): string | null => {
    for (const item of items) {
      if (item.children) {
        if (item.children.some((child: any) => child.path === path)) {
          return item.key;
        }
        const nested = findParentKey(item.children, path);
        if (nested) return nested;
      }
    }
    return null;
  };

  useEffect(() => {
    const parentKey = findParentKey(sidebarItems, location.pathname);
    if (parentKey) setOpenKeys([parentKey]);
  }, [location.pathname]);

  const handleMenuClick = (item: any) => {
    if (item.action === "logout") {
      dispatch(logout());
      navigate("/auth/login");
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const onOpenChange = (keys: string[]) => {
    const latestOpenKey = keys.find((key) => !openKeys.includes(key));
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  const topItems = sidebarItems.filter((item) => !item.bottom);
  const bottomItems = sidebarItems.filter((item) => item.bottom);

  const buildMenuItems = (items: any[]) =>
    items.map((item) => {
      if (item.children) {
        return {
          key: item.key,
          icon: item.icon,
          label: item.label,
          children: buildMenuItems(item.children),
        };
      }
      return {
        key: item.path || item.key,
        icon: item.icon,
        label: item.label,
        onClick: () => handleMenuClick(item),
      };
    });

  return (
    <Sider
      collapsible
      collapsed={sidebarCollapsed}
      onCollapse={() => dispatch(toggleSidebar())}
      trigger={null}
      width={260}
      style={{
        height: "98vh",
        position: "sticky",
        top: "10px",
        overflow: "hidden",
      }}
      className="bg-white border-r border-neutral-200 shadow-sm animate-slide-in"
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-center">
          <div className="w-28 h-12 bg-blue-500 rounded-md flex items-center justify-center text-white font-semibold">
            Logo Placement
          </div>
        </div>

        {/* Scrollable Menu */}
        <div className="flex-1 overflow-auto custom-sidebar">
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={buildMenuItems(topItems)}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            className="border-r-0 bg-transparent"
            style={{ fontSize: "14px" }}
          />
        </div>

        {/* Bottom Menu */}
        <div className="border-t border-neutral-200 custom-sidebar">
          <Menu
            mode="inline"
            selectable={false}
            items={buildMenuItems(bottomItems)}
            className="border-r-0 bg-transparent"
            style={{ fontSize: "14px" }}
          />
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;
