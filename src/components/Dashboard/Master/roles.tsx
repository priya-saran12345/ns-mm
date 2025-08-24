import React, { useMemo, useState } from "react";
import { Table, Input, Button, Modal, Form, Select, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import BradCrumb from "../BreadCrumb";
import { MdDeleteForever } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import { Plus } from "lucide-react";

type RoleRow = {
  key: number;
  name: string;
  category: "Web Users" | "App Users" | "Approval Users";
  status: "Active" | "Pending" | "Rejected";
};

const CATEGORIES = ["Web Users", "App Users", "Approval Users"] as const;

const STATUS_PILL = (status: RoleRow["status"]) => {
  let bg = "bg-gray-100";
  let fg = "text-gray-700";
  let dot = "bg-gray-500";
  if (status === "Active") {
    bg = "bg-[#DCFCE7]"; fg = "text-[#14532D]"; dot = "bg-[#22C55E]";
  } else if (status === "Pending") {
    bg = "bg-[#FEF9C3]"; fg = "text-[#713F12]"; dot = "bg-[#FACC15]";
  } else if (status === "Rejected") {
    bg = "bg-[#FEE2E2]"; fg = "text-[#7F1D1D]"; dot = "bg-[#EF4444]";
  }
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${bg} ${fg}`}>
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {status}
    </span>
  );
};

const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<RoleRow[]>([
    { key: 1, name: "Super Admin",     category: "Web Users",      status: "Active" },
    { key: 2, name: "Field User",      category: "App Users",      status: "Active" },
    { key: 3, name: "Program Manager", category: "Approval Users", status: "Active" },
    { key: 4, name: "Finance Manager", category: "Approval Users", status: "Active" },
    { key: 5, name: "PVK manager",     category: "Web Users",      status: "Active" },
  ]);

  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editing, setEditing] = useState<RoleRow | null>(null);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter(
      r =>
        r.name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
    );
  }, [roles, search]);

  const columns = [
    {
      title: <span className="text-lighttext font-semibold">S.N.</span>,
      dataIndex: "key",
      key: "key",
      width: 80,
      render: (n: number) => <span className="text-blue-600 font-medium">{n}</span>,
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
      render: (s: RoleRow["status"]) => STATUS_PILL(s),
    },
    {
      title: <span className="text-lighttext font-semibold">Action</span>,
      key: "action",
      width: 220,
      render: (_: any, record: RoleRow) => (
        <div className="flex gap-3">
          <button
            className="bg-blue  border-none text-white px-4 py-2 flex items-center gap-1 rounded-full"
            onClick={() => {
              setEditing(record);
              editForm.setFieldsValue({
                name: record.name,
                category: record.category,
                status: record.status,
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
                onOk: () => {
                  setRoles(prev => prev.filter(r => r.key !== record.key));
                  message.success("Role deleted");
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

  const openAdd = () => {
    form.resetFields();
    form.setFieldsValue({ category: "Web Users", status: "Active" });
    setIsAddOpen(true);
  };

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      setRoles(prev => [
        ...prev,
        {
          key: prev.length ? Math.max(...prev.map(p => p.key)) + 1 : 1,
          name: values.name,
          category: values.category,
          status: "Active", // as in screenshot add form (no status field shown)
        },
      ]);
      setIsAddOpen(false);
      message.success("Role added");
    } catch {
      /* validation message is shown by antd */
    }
  };

  const handleUpdate = async () => {
    try {
      const values = await editForm.validateFields();
      if (!editing) return;
      setRoles(prev =>
        prev.map(r =>
          r.key === editing.key
            ? { ...r, name: values.name, category: values.category, status: values.status }
            : r
        )
      );
      setIsEditOpen(false);
      message.success("Role updated");
    } catch {
      /* validation */
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
              Lorem ipsum dolor sit amet, consectetur adipis.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Type to search"
              prefix={<SearchOutlined />}
              style={{ width: 260 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
          dataSource={filtered}
          columns={columns as any}
          pagination={{ pageSize: 5 }}
        />

        {/* Add Modal */}
        <Modal
          title={<span className="text-lg font-semibold">Add New Roles</span>}
          open={isAddOpen}
          onCancel={() => setIsAddOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>,
            <Button key="add" type="primary" className="bg-blue" onClick={handleAdd}>
              Add Role
            </Button>,
          ]}
        >
          <Form layout="vertical" form={form} className="mt-2">
            <Form.Item
              label={<span className="font-medium">Category :</span>}
              name="category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select
                options={CATEGORIES.map((c) => ({ label: c, value: c }))}
                placeholder="Select category"
              />
            </Form.Item>
            <Form.Item
              label={<span className="font-medium">Role Name :</span>}
              name="name"
              rules={[
                { required: true, message: "Please enter a role name" },
                { min: 2, message: "Role name must be at least 2 characters" },
              ]}
            >
              <Input placeholder="Enter your Role" />
            </Form.Item>
          </Form>
        </Modal>

        {/* Edit Modal */}
        <Modal
          title={<span className="text-lg font-semibold">Edit Role</span>}
          open={isEditOpen}
          onCancel={() => setIsEditOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>,
            <Button key="save" type="primary" className="bg-blue" onClick={handleUpdate}>
              Update
            </Button>,
          ]}
        >
          <Form layout="vertical" form={editForm} className="mt-2">
            <Form.Item
              label={<span className="font-medium">Category :</span>}
              name="category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select
                options={CATEGORIES.map((c) => ({ label: c, value: c }))}
                placeholder="Select category"
              />
            </Form.Item>
            <Form.Item
              label={<span className="font-medium">Role Name :</span>}
              name="name"
              rules={[{ required: true, message: "Please enter a role name" }]}
            >
              <Input placeholder="Enter your Role" />
            </Form.Item>
            {/* Status is visible in grid, so keep it editable here */}
            <Form.Item
              label={<span className="font-medium">Status :</span>}
              name="status"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { label: "Active", value: "Active" },
                  { label: "Pending", value: "Pending" },
                  { label: "Rejected", value: "Rejected" },
                ]}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default RolesPage;
