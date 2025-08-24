import React, { useMemo, useState } from "react";
import { Table, Input, Button, Modal, Form, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { BiEdit } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";
import { Plus } from "lucide-react";
import BradCrumb from "../BreadCrumb";

type Status = "Active" | "Inactive";
type Row = { id: number; name: string; status: Status };

const CATEGORIES = [
  "Gender",
  "Husband/Father",
  "Education",
  "Relationship",
  "Dairy Animal",
  "Breed",
  "Season",
  "Crop",
  "Fertilizer Brand",
] as const;

const StatusPill = ({ status }: { status: Status }) => {
  const s =
    status === "Active"
      ? { bg: "bg-[#DCFCE7]", fg: "text-[#14532D]", dot: "bg-[#22C55E]" }
      : { bg: "bg-[#FEE2E2]", fg: "text-[#7F1D1D]", dot: "bg-[#EF4444]" };
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${s.bg} ${s.fg}`}>
      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
};

const FormDataMaster: React.FC = () => {
  // Seed per-category mock data
  const [store, setStore] = useState<Record<(typeof CATEGORIES)[number], Row[]>>({
    Gender: [
      { id: 1, name: "Super Admin", status: "Active" },
      { id: 2, name: "Field User", status: "Active" },
      { id: 3, name: "Program Manager", status: "Active" },
      { id: 4, name: "Finance Manager", status: "Active" },
      { id: 5, name: "PVK manager", status: "Active" },
    ],
    "Husband/Father": [],
    Education: [],
    Relationship: [],
    "Dairy Animal": [],
    Breed: [],
    Season: [],
    Crop: [],
    "Fertilizer Brand": [],
  });

  const [activeCat, setActiveCat] = useState<(typeof CATEGORIES)[number]>("Gender");
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const data = store[activeCat];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return !q ? data : data.filter((r) => r.name.toLowerCase().includes(q));
  }, [data, search]);

  const nextId = (rows: Row[]) => (rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1);

  const columns = [
    {
      title: <span className="text-lighttext font-semibold">S.N.</span>,
      key: "sn",
      width: 80,
      render: (_: any, __: Row, index: number) => (
        <span className="text-blue-600 font-medium">{index + 1}</span>
      ),
    },
    {
      title: <span className="text-lighttext font-semibold">Name</span>,
      dataIndex: "name",
      key: "name",
      render: (t: string) => <span className="text-textheading font-medium">{t}</span>,
    },
    {
      title: <span className="text-lighttext font-semibold">Status</span>,
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (s: Status, record: Row) => (
        <button
          className="border-0 bg-transparent cursor-pointer"
          onClick={() => {
            // quick toggle
            const updated = store[activeCat].map((r) =>
              r.id === record.id ? { ...r, status: r.status === "Active" ? "Inactive" : "Active" } : r
            );
            setStore({ ...store, [activeCat]: updated });
          }}
          title="Toggle status"
        >
          <StatusPill status={s} />
        </button>
      ),
    },
    {
      title: <span className="text-lighttext font-semibold">Action</span>,
      key: "action",
      width: 220,
      render: (_: any, record: Row) => (
        <div className="flex gap-3">
          <button
            className="bg-blue text-white border-none px-4 py-2 flex items-center gap-1 rounded-full"
            onClick={() => {
              setEditing(record);
              editForm.setFieldsValue({ name: record.name });
              setEditOpen(true);
            }}
          >
            <BiEdit className="text-[18px]" /> Edit
          </button>
          <button
            className="bg-[#EC221F] border-none text-white px-4 py-2 flex items-center gap-1 rounded-full"
            onClick={() => {
              Modal.confirm({
                title: "Delete",
                content: `Delete "${record.name}"?`,
                okText: "Delete",
                okButtonProps: { danger: true },
                onOk: () => {
                  const updated = store[activeCat].filter((r) => r.id !== record.id);
                  setStore({ ...store, [activeCat]: updated });
                  message.success("Deleted");
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

  // Add
  const openAdd = () => {
    addForm.resetFields();
    setAddOpen(true);
  };
  const submitAdd = async () => {
    try {
      const v = await addForm.validateFields();
      const rows = store[activeCat];
      const newRow: Row = { id: nextId(rows), name: v.name, status: "Active" };
      setStore({ ...store, [activeCat]: [...rows, newRow] });
      setAddOpen(false);
      message.success("Added");
    } catch {}
  };

  // Edit
  const submitEdit = async () => {
    try {
      const v = await editForm.validateFields();
      if (!editing) return;
      const updated = store[activeCat].map((r) => (r.id === editing.id ? { ...r, name: v.name } : r));
      setStore({ ...store, [activeCat]: updated });
      setEditOpen(false);
      message.success("Updated");
    } catch {}
  };

  return (
    <>
      <BradCrumb />
      <div className="p-4 bg-white rounded-lg shadow">
        {/* Top area: left category buttons, right header + toolbar */}
        <div className="grid grid-cols-12 gap-4">
          {/* Left category rail */}
 <div className="col-span-3 pr-4 !border-r-2 !borde-primary lg:col-span-2">
            <div className="flex border-blue border-2 flex-col gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  className={`w-full border-slate-200  text-left px-6 py-4 text-lighttext font-medium text-md
                     rounded-lg border ${
                    activeCat === c ? "bg-blue text-white border-blue" : "bg-white"
                  }`}
                  onClick={() => {
                    setActiveCat(c);
                    setSearch("");
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Right list */}
          <div className="col-span-9 lg:col-span-10">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h2 className="text-lg font-semibold">{activeCat}</h2>
                <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet, consectetur adipis.</p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Type to search"
                  prefix={<SearchOutlined />}
                  style={{ width: 260 }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="bg-blue border-none text-white px-4 py-2 flex gap-2 items-center rounded-lg" onClick={openAdd}>
                  <Plus className="text-[18px]" /> Add
                </button>
              </div>
            </div>

            <Table<Row>
              rowKey="id"
              bordered
              dataSource={filtered}
              columns={columns as any}
              pagination={{ pageSize: 5 }}
            />
          </div>
        </div>

        {/* Add Modal (exact template) */}
        <Modal
          title={<span className="text-lg font-semibold">Add Form Data</span>}
          open={addOpen}
          onCancel={() => setAddOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>,
            <Button key="add" type="primary" className="bg-blue" onClick={submitAdd}>
              Add Data
            </Button>,
          ]}
        >
          <Form layout="vertical" form={addForm} className="mt-2">
            <Form.Item
              label={<span className="font-medium">Add Data</span>}
              name="name"
              rules={[
                { required: true, message: "Please enter value" },
                { min: 2, message: "Must be at least 2 characters" },
              ]}
            >
              <Input placeholder="Enter Data Here" />
            </Form.Item>
          </Form>
        </Modal>

        {/* Edit Modal (same look & feel) */}
        <Modal
          title={<span className="text-lg font-semibold">Edit Form Data</span>}
          open={editOpen}
          onCancel={() => setEditOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>,
            <Button key="save" type="primary" className="bg-blue" onClick={submitEdit}>
              Update Data
            </Button>,
          ]}
        >
          <Form layout="vertical" form={editForm} className="mt-2">
            <Form.Item
              label={<span className="font-medium">Edit Data</span>}
              name="name"
              rules={[
                { required: true, message: "Please enter value" },
                { min: 2, message: "Must be at least 2 characters" },
              ]}
            >
              <Input placeholder="Enter Data Here" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default FormDataMaster;
