// src/modules/UserManagement/Roles/pages/index.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Table, Input, Button, Modal, Form, Select, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import BradCrumb from "../../BreadCrumb";
import { MdDeleteForever } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import { Plus } from "lucide-react";
import {
  fetchRolesThunk,
  createRoleThunk,
  updateRoleThunk,
  deleteRoleThunk,
} from "./thunk";
import { setPage, setLimit, setSearch } from "./slice";
import type { RootState } from "./types";
import AddRoleModal, {
  AddRoleFormValues,
  OptionBool,
  // OptionNum,
} from "./AddRoleModal";

/** category choices to match your API sample */
// const CATEGORY_OPTIONS: OptionNum[] = [
//   { label: "Web Users", value: 1 },
//   { label: "App Users", value: 2 },
//   { label: "Approval Users", value: 3 },
// ];
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

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
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
      render: (_: number, __: any, idx: number) =>
        (page - 1) * limit + idx + 1,
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
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${sty.bg} ${sty.fg}`}>
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
            className="bg-blue border-none text-white px-4 py-2 flex items-center gap-1 rounded-full"
            onClick={() => {
              setEditingId(record.id);
              editForm.setFieldsValue({
                name: record.name,
                category_id: CATEGORY_OPTIONS.find((c) => c.label === record.category)?.value,
                status: record.status === "Active",
              });
              setIsEditOpen(true);
            }}
          >
            <BiEdit className="text-[18px]" /> Edit
          </button>
          <button
            className="bg-[#EC221F] border-none text-white px-4 py-2 flex items-center gap-1 rounded-full"
            onClick={() => {
              Modal.confirm({
                title: "Delete Role",
                content: `Are you sure you want to delete "${record.name}"?`,
                okText: "Delete",
                okButtonProps: { danger: true },
                onOk: async () => {
                  try {
                    await dispatch(deleteRoleThunk({ path, id: record.id })).unwrap();
                    message.success("Role deleted");
                    dispatch(fetchRolesThunk({ path, page, limit, search }));
                  } catch (e: any) {
                    message.error(e?.message || "Failed to delete");
                  }
                },
              });
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

  /** Edit */
  const handleUpdate = async () => {
    try {
      const values = await editForm.validateFields();
      if (!editingId) return;
      await dispatch(
        updateRoleThunk({
          path,
          id: editingId,
          body: {
            name: values.name,
            category_id: values.category_id,
            status: values.status,
          },
        })
      ).unwrap();
      setIsEditOpen(false);
      setEditingId(null);
      message.success("Role updated");
      dispatch(fetchRolesThunk({ path, page, limit, search }));
    } catch (e: any) {
      message.error(e?.message || "Failed to update role");
    }
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

        {/* Add Modal (moved to separate file) */}
        <AddRoleModal
          open={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSubmit={handleAddSubmit}
          // categoryOptions={CATEGORY_OPTIONS}
          statusOptions={STATUS_OPTIONS}
        />

        {/* Edit Modal (kept inline) */}
        <Modal
          title={<span className="text-lg font-semibold">Edit Role</span>}
          open={isEditOpen}
          onCancel={() => { setIsEditOpen(false); setEditingId(null); }}
          destroyOnClose
          footer={[
            <Button key="cancel" onClick={() => { setIsEditOpen(false); setEditingId(null); }}>
              Cancel
            </Button>,
            <Button key="save" type="primary" className="bg-blue" onClick={handleUpdate}>
              Update
            </Button>,
          ]}
        >
          {/* <Form layout="vertical" form={editForm} className="mt-2">
            {/* <Form.Item
              label={<span className="font-medium">Category :</span>}
              name="category_id"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select options={CATEGORY_OPTIONS} placeholder="Select category" />
            </Form.Item> 
            <Form.Item
              label={<span className="font-medium">Role Name :</span>}
              name="name"
              rules={[{ required: true, message: "Please enter a role name" }]}
            >
              <Input placeholder="Enter role name" />
            </Form.Item>
            <Form.Item
              label={<span className="font-medium">Status :</span>}
              name="status"
              rules={[{ required: true }]}
            >
              <Select options={STATUS_OPTIONS} />
            </Form.Item>
          </Form> */}
        </Modal>
      </div>
    </>
  );
};

export default RolesPage;
