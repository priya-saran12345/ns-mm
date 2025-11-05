  // src/modules/UserManagement/Roles/pages/index.tsx
  import React, { useEffect, useMemo, useState } from "react";
  import { Table, Input, Button, message } from "antd";
  import { SearchOutlined } from "@ant-design/icons";
  import { useAppDispatch, useAppSelector } from "../../../../store/store";
  import BradCrumb from "../../BreadCrumb";
  import { MdDeleteForever } from "react-icons/md";
  import { BiEdit } from "react-icons/bi";
  import { Plus } from "lucide-react";
  import { ShieldCheck } from "lucide-react";         // icon for permission
  import RolePermissionsModal from "./RolePermissionsModal";

  import {
    fetchRolesThunk,
    createRoleThunk,
    updateRoleThunk, // (still exported, though not used here directly)
    deleteRoleThunk,
  } from "./thunk";
  import { setPage, setLimit, setSearch } from "./slice";
  import type { RootState } from "./types";

  import AddRoleModal, {
    AddRoleFormValues,
    OptionBool,
  } from "./AddRoleModal";

  import EditRoleModal from "./EditRoleModal"; // 👈 separate edit modal

  const STATUS_OPTIONS: OptionBool[] = [
    { label: "Active", value: true },
    { label: "Inactive", value: false },
  ];

  const RolesPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { items, loading, page, limit, total, search } = useAppSelector(
      (s: RootState) => s.roles
    );

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
  const [permOpen, setPermOpen] = useState(false);
  const [permRoleId, setPermRoleId] = useState<number | null>(null);
  const [permRoleName, setPermRoleName] = useState<string | undefined>(undefined);

    const path = "roles";

    // fetch on mount + when page/limit/search changes
    useEffect(() => {
      dispatch(fetchRolesThunk({ path, page, limit, search })).unwrap().catch(() => {});
    }, [dispatch, page, limit, search]);

    const rows = useMemo(() => {
      return items.map((r) => ({
        key: r.id,
        id: r.id,
        name: r.name,
        category: r.category?.name ?? "",
        status: r.status ? "Active" : "Inactive",
      }));
    }, [items]);

    const columns = [
      {
        title: <span className="text-lighttext font-semibold">S.N.</span>,
        dataIndex: "key",
        key: "key",
        width: 80,
        render: (_: number, __: any, idx: number) => (page - 1) * limit + idx + 1,
      },
      {
        title: <span className="text-lighttext font-semibold">Name</span>,
        dataIndex: "name",
        key: "name",
        render: (t: string) => <span className="text-textheading font-medium">{t}</span>,
      },
      {
        title: <span className="text-lighttext font-semibold">Category</span>,
        dataIndex: "category",
        key: "category",
        render: (t: string) => <span className="text-textheading font-medium">{t}</span>,
      },
      {
        title: <span className="text-lighttext font-semibold">Status</span>,
        dataIndex: "status",
        key: "status",
        width: 140,
        render: (s: string) => {
          const map = {
            Active: { bg: "bg-[#DCFCE7]", fg: "text-[#14532D]", dot: "bg-[#22C55E]" },
            Inactive: { bg: "bg-gray-100", fg: "text-gray-700", dot: "bg-gray-500" },
          } as const;
          const sty = (map as any)[s] ?? map.Inactive;
          return (
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${sty.bg} ${sty.fg}`}
            >
              <span className={`w-2 h-2 rounded-full ${sty.dot}`} />
              {s}
            </span>
          );
        },
      },
      {
        title: <span className="text-lighttext font-semibold">Action</span>,
        key: "action",
        width: 220,
        render: (_: any, record: any) => (
          <div className="flex gap-3">
            <button
    title="Permissions"
    className="bg-[#991B1B] border-none text-white px-3 py-2 flex items-center gap-1 rounded-full"
    onClick={() => {
      setPermRoleId(record.id);
      setPermRoleName(record.name);
      setPermOpen(true);
    }}
  >
    <ShieldCheck size={18} />
  </button>

            <button
              className="bg-blue border-none text-white px-4 py-2 flex items-center gap-1 rounded-full"
              onClick={() => {
                setEditingId(record.id);   // just pass the id
                setIsEditOpen(true);       // EditRoleModal handles fetching & form
              }}
            >
              <BiEdit className="text-[18px]" /> Edit
            </button>
            <button
              className="bg-[#EC221F] border-none text-white px-4 py-2 flex items-center gap-1 rounded-full"
              onClick={() => {
                // Confirm delete using antd Modal.confirm is fine too;
                // here we keep it simple.
                const doDelete = async () => {
                  try {
                    await dispatch(deleteRoleThunk({ path, id: record.id })).unwrap();
                    message.success("Role deleted");
                    dispatch(fetchRolesThunk({ path, page, limit, search }));
                  } catch (e: any) {
                    message.error(e?.message || "Failed to delete");
                  }
                };
                // Basic confirm:
                if (window.confirm(`Delete "${record.name}"?`)) doDelete();
              }}
            >
              <MdDeleteForever className="text-[18px]" /> Delete
            </button>
          </div>
        ),
      },
    ];

    const onSearch = (val: string) => dispatch(setSearch(val));
    const onPageChange = (p: number, l?: number) => {
      if (l && l !== limit) dispatch(setLimit(l));
      dispatch(setPage(p));
    };

    /** open Add */
    const openAdd = () => setIsAddOpen(true);

    /** submit from AddRoleModal */
    const handleAddSubmit = async (values: AddRoleFormValues) => {
      await dispatch(
        createRoleThunk({
          path,
          body: {
            name: values.name,
            category_id: values.category_id,
            status: values.status ?? true,
          },
        })
      ).unwrap();
      message.success("Role added");
      dispatch(fetchRolesThunk({ path, page, limit, search }));
    };

    return (
      <>
        <BradCrumb />
        <div className="p-4 bg-white rounded-lg shadow">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold">Roles</h2>
              <p className="text-sm text-gray-500">
                Create, edit and manage role access for your users.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type to search"
                prefix={<SearchOutlined />}
                style={{ width: 260 }}
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                allowClear
              />
              <button
                className="bg-blue border-none text-white px-4 py-2 flex gap-2 items-center rounded-lg"
                onClick={openAdd}
              >
                <Plus className="text-[20px]" /> Add New Role
              </button>
            </div>
          </div>

          {/* Table */}
          <Table
            bordered
            dataSource={rows}
            columns={columns as any}
            loading={loading}
            pagination={{
              current: page,
              pageSize: limit,
              total,
              onChange: onPageChange,
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 20, 50],
            }}
            rowKey="id"
          />

          {/* Add Modal */}
          <AddRoleModal
            open={isAddOpen}
            onClose={() => setIsAddOpen(false)}
            onSubmit={handleAddSubmit}
            statusOptions={STATUS_OPTIONS}
          />
  <RolePermissionsModal
    open={permOpen}
    roleId={permRoleId}
    roleName={permRoleName}
    onClose={() => { setPermOpen(false); setPermRoleId(null); }}
  />

          {/* Edit Modal (separate component) */}
          <EditRoleModal
            open={isEditOpen}
            roleId={editingId}
            onClose={() => {
              setIsEditOpen(false);
              setEditingId(null);
            }}
            onSaved={async () => {
              await dispatch(fetchRolesThunk({ path, page, limit, search })).unwrap().catch(() => {});
            }}
          />
        </div>
      </>
    );
  };

  export default RolesPage;
