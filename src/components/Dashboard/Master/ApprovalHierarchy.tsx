import React, { useMemo, useState } from "react";
import { Table, Input, Button, Modal, Form, Select, InputNumber, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { BiEdit } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";
import { Plus } from "lucide-react";
import BradCrumb from "../BreadCrumb";
import { LuFilter } from "react-icons/lu";

type Status = "Active" | "Inactive";
type Row = {
  id: number;
  levelCount: number;
  level1: string;         // Displayed in grid as “Level1”
  levels: string[];       // Full list for edit
  status: Status;
};

const statusPill = (status: Status) => {
  const map = {
    Active:  { bg: "bg-[#DCFCE7]", fg: "text-[#14532D]", dot: "bg-[#22C55E]" },
    Inactive:{ bg: "bg-[#FEE2E2]", fg: "text-[#7F1D1D]", dot: "bg-[#EF4444]" },
  } as const;
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${s.bg} ${s.fg}`}>
      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
};

const ApprovalHierarchyPage: React.FC = () => {
  // Mock data
  const [rows, setRows] = useState<Row[]>([
    { id: 1, levelCount: 2, level1: "Program Manager", levels: ["Program Manager","Finance Manager"], status: "Active" },
    { id: 2, levelCount: 2, level1: "PVK",             levels: ["PVK","Approver"],                  status: "Inactive" },
  ]);

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<number | undefined>(undefined);

  // Add / Edit modal state
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // --- Helpers to render dynamic level inputs ---
  const LevelInputs: React.FC<{ form: any; name: string }> = ({ form, name }) => {
    const levels: string[] = Form.useWatch(name, form) || [];
    const count: number = Form.useWatch("levelCount", form) || 0;

    // Ensure array size follows levelCount
    React.useEffect(() => {
      const current = form.getFieldValue(name) || [];
      if (count !== current.length) {
        const next = Array.from({ length: count }, (_, i) => current[i] ?? `Level ${i + 1}`);
        form.setFieldsValue({ [name]: next });
      }
    }, [count]); // eslint-disable-line

    const removeAt = (idx: number) => {
      const next = (form.getFieldValue(name) || []).slice();
      next.splice(idx, 1);
      form.setFieldsValue({ [name]: next, levelCount: next.length });
    };

    return (
      <div className="space-y-2">
        {levels.map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              placeholder={`Level ${i + 1}`}
              value={levels[i]}
              onChange={(e) => {
                const next = levels.slice();
                next[i] = e.target.value;
                form.setFieldsValue({ [name]: next });
              }}
            />
            <button
              type="button"
              className="px-3 py-1 rounded-md border hover:bg-gray-50"
              onClick={() => removeAt(i)}
              aria-label="remove level"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    );
  };

  // --- Filters & data ---
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(r => {
      const matchesSearch =
        !q ||
        r.level1.toLowerCase().includes(q) ||
        r.levels.join(" ").toLowerCase().includes(q);
      const matchesLevel = !levelFilter || r.levelCount === levelFilter;
      return matchesSearch && matchesLevel;
    });
  }, [rows, search, levelFilter]);

  // --- Table columns (ID, Level, Level1, Status, Action) ---
  const columns = [
    { title: <span className="text-lighttext font-semibold">ID</span>, dataIndex: "id", key: "id", width: 80 },
    { title: <span className="text-lighttext font-semibold">Level</span>, dataIndex: "levelCount", key: "levelCount", width: 100 },
    {
      title: <span className="text-lighttext font-semibold">Level1</span>,
      dataIndex: "level1",
      key: "level1",
      render: (t: string) => <span className="text-textheading font-medium">{t}</span>,
    },
    {
      title: <span className="text-lighttext font-semibold">Status</span>,
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (s: Status) => statusPill(s),
    },
    {
      title: <span className="text-lighttext font-semibold">Action</span>,
      key: "action",
      width: 220,
      render: (_: any, record: Row) => (
        <div className="flex gap-3">
          <button
            className="bg-blue border-none text-white px-4 py-2 flex items-center gap-1 rounded-full"
            onClick={() => {
              setEditing(record);
              editForm.setFieldsValue({
                levelCount: record.levelCount,
                levels: record.levels,
                status: record.status,
              });
              setEditOpen(true);
            }}
          >
            <BiEdit className="text-[18px]" /> Edit
          </button>
          <button
            className="bg-[#EC221F] border-none text-white px-4 py-2 flex items-center gap-1 rounded-full"
            onClick={() => {
              Modal.confirm({
                title: "Delete Hierarchy",
                content: `Delete ID ${record.id}?`,
                okText: "Delete",
                okButtonProps: { danger: true },
                onOk: () => {
                  setRows(prev => prev.filter(x => x.id !== record.id));
                  message.success("Hierarchy deleted");
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

  // --- Add Handlers ---
  const openAdd = () => {
    addForm.resetFields();
    addForm.setFieldsValue({ levelCount: 4, levels: ["Level 1","Level 2","Level 3","Level 4"] });
    setAddOpen(true);
  };
  const submitAdd = async () => {
    try {
      const v = await addForm.validateFields();
      const nextId = rows.length ? Math.max(...rows.map(r => r.id)) + 1 : 1;
      const newRow: Row = {
        id: nextId,
        levelCount: v.levelCount,
        levels: v.levels,
        level1: v.levels?.[0] || "",
        status: "Active",
      };
      setRows(prev => [...prev, newRow]);
      setAddOpen(false);
      message.success("Hierarchy added");
    } catch {}
  };

  // --- Edit Handlers ---
  const submitEdit = async () => {
    try {
      const v = await editForm.validateFields();
      if (!editing) return;
      setRows(prev =>
        prev.map(r =>
          r.id === editing.id
            ? { ...r, levelCount: v.levelCount, levels: v.levels, level1: v.levels?.[0] || r.level1, status: v.status }
            : r
        )
      );
      setEditOpen(false);
      message.success("Hierarchy updated");
    } catch {}
  };

  return (
    <>
      <BradCrumb />
      <div className="p-4 bg-white rounded-lg shadow">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold">Approval Hierarchy</h2>
            <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet, consectetur adipis.</p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Type to search"
              prefix={<SearchOutlined className="text-lighttext text-[16px]" />}
              style={{ width: 260 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="bg-blue border-none text-white px-4 py-2 flex gap-2 items-center rounded-lg" onClick={openAdd}>
              <Plus className="text-[18px]" /> Create New Hierarchy
            </button>
          </div>
        </div>
<div className="flex justify-end mb-6 gap-5">
                <Select
              allowClear
              placeholder="Select no. of levels for hierarchy"
              style={{ width: 260 }}
              value={levelFilter}
              onChange={(v) => setLevelFilter(v)}
              options={[1,2,3,4,5,6,7,8].map(n => ({ label: n, value: n }))}
            />
            <button className="px-4 py-2 bg-blue rounded-lg flex items-center  gap-1 text-white border-none"> 
                <LuFilter className="text-[16px]"/>
Filter</button>

</div>
        {/* Table */}
        <Table<Row>
          rowKey="id"
          bordered
          dataSource={filtered}
          columns={columns as any}
          pagination={{ pageSize: 5 }}
        />

        {/* Add Modal (right image) */}
        <Modal
          title={<span className="text-lg font-semibold">Add Approval Hierarchy</span>}
          open={addOpen}
          onCancel={() => setAddOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setAddOpen(false)}>Cancel</Button>,
            <Button key="add" type="primary" className="bg-blue" onClick={submitAdd}>Add Hierarchy</Button>,
          ]}
        >
          <Form layout="vertical" form={addForm} className="mt-2">
            <Form.Item
              label="Select Number of Level Hierarchy"
              name="levelCount"
              rules={[{ required: true, message: "Please select number of levels" }]}
            >
              <InputNumber min={1} max={20} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item shouldUpdate>
              {() => <LevelInputs form={addForm} name="levels" />}
            </Form.Item>
          </Form>
        </Modal>

        {/* Edit Modal (same as Add + Status) */}
        <Modal
          title={<span className="text-lg font-semibold">Edit Approval Hierarchy</span>}
          open={editOpen}
          onCancel={() => setEditOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setEditOpen(false)}>Cancel</Button>,
            <Button key="save" type="primary" className="bg-blue" onClick={submitEdit}>Update</Button>,
          ]}
        >
          <Form layout="vertical" form={editForm} className="mt-2">
            <Form.Item
              label="Select Number of Level Hierarchy"
              name="levelCount"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} max={20} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item shouldUpdate>
              {() => <LevelInputs form={editForm} name="levels" />}
            </Form.Item>

            <Form.Item label="Status" name="status" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
                ]}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default ApprovalHierarchyPage;
