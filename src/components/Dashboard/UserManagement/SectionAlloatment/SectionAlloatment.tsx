import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../../store/store"; // adjust to your app
import { Table, Input, Button } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import React from "react";

import AssignSectionModal from "./AssignSectionModal";
import RoleFilterDropdown from "./RoleFilterDropdown";

import {
  fetchAssignedPermissionsThunk,
} from "./thunk";
import {
  selectPagedRows,
  setPage,
  setSearch,
} from "./slice";
import type { RootStateWithAP } from "./types";
import Breadcrumbs from "../../BreadCrumb";

export default function SectionAllocation() {
  const dispatch = useDispatch<AppDispatch>();

  const { rows, total, from, to } = useSelector(selectPagedRows as any);
  const { search, page, limit, loading } = useSelector(
    (s: RootStateWithAP) => s.assignedPermissions
  );
  
  const [selectedUserId, setSelectedUserId] = useState<number | string | null>(
  null
);
  const [openAssign, setOpenAssign] = React.useState(false);
  const [roles, setRoles] = React.useState<string[]>(["LegalOfficer"]);

  useEffect(() => {
    dispatch(fetchAssignedPermissionsThunk());
  }, [dispatch]);

  const columns = [
    {
      title: <span className="text-lighttext font-semibold">ID</span>,
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (v: number) => <span className="text-textheading font-medium">{v}</span>,
    },
{
  title: <span className="text-lighttext font-semibold">Assign</span>,
  key: "assign",
  width: 110,
  render: (_: any, record: any) => (
    <button
      className="px-4 py-1 rounded-full bg-[#246BFD] text-white text-sm font-medium"
      onClick={() => {
        const uid =
          record.user?.id ||      // preferred (from nested user object)
          record.user_id ||       // fallback
          record.id;              // extreme fallback

        setSelectedUserId(uid);
        setOpenAssign(true);
      }}
    >
      Assign
    </button>
  ),
},

    {
      title: <span className="text-lighttext font-semibold">Name</span>,
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span className="text-textheading font-medium">{text}</span>,
    },
    {
      title: <span className="text-lighttext font-semibold">Email</span>,
      dataIndex: "email",
      key: "email",
      render: (text: string) => <span className="text-textheading font-medium">{text}</span>,
    },
    {
      title: <span className="text-lighttext font-semibold">Role Category</span>,
      dataIndex: "role_category",
      key: "role_category",
      render: (text: string) => <span className="text-textheading font-medium">{text}</span>,
    },
    {
      title: <span className="text-lighttext font-semibold">Role</span>,
      dataIndex: "role",
      key: "role",
      render: (text: string) => <span className="text-textheading font-medium">{text}</span>,
    },
    {
      title: <span className="text-lighttext font-semibold">Assigned Section</span>,
      dataIndex: "assignedSection",
      key: "assignedSection",
      width: 160,
      render: (text: string) => <span className="text-textheading font-medium">{text}</span>,
    },
    {
      title: <span className="text-lighttext font-semibold">Assigned MCC</span>,
      dataIndex: "assignedMcc",
      key: "assignedMcc",
      width: 220,
      render: (text: string) => <span className="text-textheading font-medium">{text}</span>,
    },
    // {
    //   title: <span className="text-lighttext font-semibold">Assigned MPP</span>,
    //   dataIndex: "assignedMpp",
    //   key: "assignedMpp",
    //   width: 220,
    // },
  ];

  // Pretty prev/next buttons
  const itemRender = (_: number, type: any, original: any) => {
    if (type === "prev") {
      return (
        <button className="w-8 h-8 rounded-full border flex items-center justify-center">‹</button>
      );
    }
    if (type === "next") {
      return (
        <button className="w-8 h-8 rounded-full border flex items-center justify-center">›</button>
      );
    }
    return original;
  };
  return (
    <>
      <Breadcrumbs />
      <div className="p-4 bg-white rounded-lg shadow">
        {/* Header */}
        <div className="flex justify-between">

        <div className="mb-4">
          <h2 className="text-lg font-semibold mt-1">Section Allocation</h2>
          <p className="text-sm text-gray-500">Assigned MCC/Sections per user</p>
        </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-3 mb-4">
          <Input
            placeholder="Type to search"
            prefix={<SearchOutlined />}
            style={{ width: 280 }}
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            allowClear
          />

          {/* <Button type="primary" className="bg-blue" onClick={() => setOpenAssign(true)}>
            Assign
          </Button> */}

          <RoleFilterDropdown
            options={[
              { value: "AreaOfficer", label: "Area Officer" },
              { value: "LegalOfficer", label: "Legal Officer" },
              { value: "FinanceOfficer", label: "Finance Officer" },
            ]}
            value={roles}
            onChange={setRoles}
          />

          <Button icon={<FilterOutlined />} className="bg-[#EAF2FF] text-[#246BFD] border-0">
            Filter
          </Button>
        </div>

        </div>

        {/* Action bar */}

        {/* Table */}
        <Table
          rowKey="key"
          bordered
          loading={loading}
          dataSource={rows as any}
          columns={columns as any}
          pagination={{
            current: page,
            pageSize: limit,
            total,
            onChange: (p) => dispatch(setPage(p)),
            showSizeChanger: false,
            position: ["bottomRight"],
            itemRender,
          }}
        />

        {/* Footer */}
        <div className="text-sm text-gray-500 mt-2">
          {total ? `Showing ${from} to ${to} of ${total} entries` : "Showing 0 entries"}
        </div>
      </div>

      <AssignSectionModal
        open={openAssign}
        onClose={() => setOpenAssign(false)}
        defaultRoleValues={roles}
        selectedUserId={selectedUserId}

      />
    </>
  );
}
