import React, { useEffect, useMemo, useState } from "react";
import { Layout, Menu, MenuProps } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks/redux.hooks";
import { toggleSidebar } from "../../store/uiSlice";
import { logout } from "../../store/authSlice";
 import {
  FiHome,
  FiDatabase,
  FiBarChart2,
  FiDollarSign,
  FiUsers,
  FiChevronDown,
} from "react-icons/fi";
import { FaRegUser } from "react-icons/fa6";
import { BsUiChecksGrid } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";

const { Sider } = Layout;

/* ----------------------------- CONFIG ----------------------------- */
type Leaf = { key: string; label: string; path?: string; icon?: React.ReactNode; action?: "logout"; bottom?: boolean };
type Node = Leaf & { children?: Leaf[] };

export const sidebarItems: Node[] = [
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
      // { key: "animalBreadmasterdata", label: "Animal Bread Master", path: "/master/animal-breed-master" },
      // { key: "animalTypemaster", label: "Animal Type Master", path: "/master/animal-type-master" },
      { key: "Roles", label: "Roles Master", path: "/master/roles" },
      { key: "Approvalhierarchy", label: "Approval Hierarchy", path: "/master/approval-hierarchy" },
      // { key: "FormData", label: "Form Data", path: "/master/form-data" },
    ],
  },
  {
    key: "userManagement",
    label: "User Management",
    icon: <FiUsers size={18} />,
    children: [
      { key: "users", label: "All Users", path: "/users" },
      { key: "roles", label: "Section Alloatment", path: "/users/section-alloatment" },
    ],
  },
  {
    key: "membersForm",
    label: "Members Form",
    icon: <FaRegUser 
 size={18} />,
    children: [
      { key: "approvedmem", label: "Approved Members", path: "/users/approved" },
      { key: "pendingmem", label: "Pending Members", path: "/users/pending" },
      { key: "rejectedmem", label: "Rejected Members", path: "/users/rejected" },
      { key: "re-submem", label: "Re-submitted Alloatment", path: "/users/re-submitted" },
    ],
  },
  {
    key: "utilities",
    label: "Utilities",
    icon: <BsUiChecksGrid  size={18} />,
    children: [
      { key: "formlist", label: "Form List", path: "/utility/form-list" },
      { key: "membercode", label: "Member Code", path: "/utility/member-code" },
      { key: "Foliocode", label: "Folio Code", path: "/utility/folio-number" },
      { key: "facilitator", label: "Facilitator Form Transfer", path: "/utility/facilitator" },
      { key: "approvaluser", label: "Approval User Form Transfer", path: "/utility/approvaluser" },
      { key: "mccmpp", label: "MCC/MPP Transfer", path: "/utility/mcc_mpp-transfer" },
      { key: "oldmember", label: "Old Members", path: "/utility/old-member" },
    ],
  },
  {
    key: "finalapproval",
    label: "Final Approval",
    icon: <FiDollarSign size={18} />,
    children: [{ key: "allformsFA", label: "All Forms", path: "/dashboard/final-approval" }],
  },
  {
    key: "reports",
    label: "Reports",
    icon: <FiBarChart2 size={18} />,
    children: [
      { key: "memberrepo", label: "Member Form Report", path: "/reports/member" },
      { key: "animalrepo", label: "Animal Report", path: "/reports/animal-report" },
      { key: "generatedrepo", label: "Generated Report", path: "/reports/generated-report" },
    ],
  },
  {
    key: "fedi",
    label: "Form Edit/Delete/Inactive",
    icon: <FaEdit  size={18} />,
    children: [{ key: "allformEDI", label: "All Forms", path: "/dashboard/edit-inactive" }],
  },
  // Optional bottom items (uncomment if you want them)
  // { key: "settings", label: "Settings", icon: <FiSettings size={18} />, path: "/settings", bottom: true },
  // { key: "logout", label: "Logout", icon: <FiLogOut size={18} />, action: "logout", bottom: true },
];

/* --------------------------- COMPONENT --------------------------- */
const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed } = useAppSelector((s) => s.ui);

  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // map every clickable key to its original node for onClick handling
  const keyMap = useMemo(() => {
    const map = new Map<string, Leaf>();
    const walk = (items: Node[]) => {
      items.forEach((it) => {
        if (it.children?.length) walk(it.children as Node[]);
        if (it.path || it.action) map.set(it.path || it.key, it);
      });
    };
    walk(sidebarItems);
    return map;
  }, []);

  // find parent submenu for a path
  const findParentKey = (items: Node[], path: string): string | null => {
    for (const item of items) {
      if (item.children?.some((c) => c.path === path)) return item.key;
      if (item.children) {
        const nested = findParentKey(item.children as Node[], path);
        if (nested) return nested;
      }
    }
    return null;
  };

  // auto-open current parent group
  useEffect(() => {
    const parentKey = findParentKey(sidebarItems, location.pathname);
    setOpenKeys(parentKey ? [parentKey] : []);
  }, [location.pathname]);

  // Only one root submenu open at a time (accordion)
  const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
    const latest = keys.find((k) => !openKeys.includes(k));
    setOpenKeys(latest ? [latest] : []);
  };

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    const item = keyMap.get(String(key));
    if (!item) return;

    if (item.action === "logout") {
      dispatch(logout());
      navigate("/auth/login");
      return;
    }
    if (item.path) navigate(item.path);
  };

  const topItems = sidebarItems.filter((i) => !i.bottom);
  const bottomItems = sidebarItems.filter((i) => i.bottom);

  // Build AntD items with submenu + leaves
  const buildMenuItems = (items: Node[]): MenuProps["items"] =>
    items.map((item) => {
      if (item.children?.length) {
        return {
          key: item.key,
          icon: item.icon,
          label: <span className="app-sb-label">{item.label}</span>,
          children: item.children.map((c) => ({
            key: c.path || c.key,
            label: <span className="app-sb-child">{c.label}</span>,
          })),
        };
      }
      // leaf
      return {
        key: item.path || item.key,
        icon: item.icon,
        label: <span className="app-sb-label">{item.label}</span>,
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
      className="bg-white border-r border-neutral-200 
      shadow-sm animate-slide-in app-sidebar"
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-center">
          <div className="min-w-28 min-h-12 bg-blue rounded-md flex items-center justify-center text-white font-semibold">
            Logo
          </div>
        </div>

        {/* Scrollable menu */}
        <div className="flex-1 overflow-auto custom-sidebar">
          <Menu
            mode="inline"
            onClick={handleMenuClick}
            selectedKeys={[location.pathname]}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            items={buildMenuItems(topItems)}
            // className="border-r-0 bg-transparent app-sidebar-menu"
            inlineIndent={20}
            // custom expand icon (down chevron)
            expandIcon={(props) => {
              const { isOpen } = props;
              return (
                <span
                  className={`sb-chevron ${isOpen ? "open" : ""}`}
                  style={{ display: "inline-flex", alignItems: "center", marginInlineStart: 6 }}
                >
                  <FiChevronDown size={16} />
                </span>
              );
            }}
          />
        </div>

        {/* Bottom area */}
        <div className="border-t border-slate-200">
          <Menu
            mode="inline"
            onClick={handleMenuClick}
            selectable={false}
            items={buildMenuItems(bottomItems)}
            className="border-r-0 bg-transparent app-sidebar-menu"
          />
          {/* Footer/copyright */}
<div className="px-4 !border border-2 border-blue py-3 text-sm text-textlight">
            <div>Copyright© 2025 <span className='text-black font-bold'>Kodaima</span>.</div>
            <div>All Rights Reserved.</div>
          </div>
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;
