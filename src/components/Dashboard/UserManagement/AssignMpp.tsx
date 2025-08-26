// src/pages/UserManagement/AssignedMccList.tsx
import { useMemo, useState } from "react";
import { Table, Input, Button, Select, Popconfirm, message } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import BradCrumb from "../BreadCrumb";

type Row = {
  key: number;
  id: number;
  userName: string;
  mcc: string;
  mpp: string; // comma-separated codes for display
};

const MCC_OPTIONS = [
  { value: "Singheshwar(001)", label: "Singheshwar(001)" },
  { value: "Bhagwanpur(002)", label: "Bhagwanpur(002)" },
];

const MPP_OPTIONS = [
  { value: "0002206", label: "0002206" },
  { value: "0002208", label: "0002208" },
  { value: "0002260", label: "0002260" },
  { value: "0002265", label: "0002265" },
  { value: "0002206,0002208,0002260", label: "Multiple…" },
];

export default function AssignedMccList() {
  // seed rows to mirror screenshot
  const [rows, setRows] = useState<Row[]>(
    Array.from({ length: 10 }).map((_, i) => ({
      key: i + 1,
      id: i + 1,
      userName: "Test User",
      mcc: "Singheshwar(001)",
      mpp:
        "0002206, 0002206,0002260,0002206,0002260,0002206,0002206",
    }))
  );

  // page UI state
  const [search, setSearch] = useState("");
  const [mccFilter, setMccFilter] = useState<string | undefined>();
  const [mppFilter, setMppFilter] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // filter logic to behave like the mock
  const data = useMemo(() => {
    let d = [...rows];
    const q = search.trim().toLowerCase();
    if (q) {
      d = d.filter(
        (r) =>
          String(r.id).includes(q) ||
          r.userName.toLowerCase().includes(q) ||
          r.mcc.toLowerCase().includes(q) ||
          r.mpp.toLowerCase().includes(q)
      );
    }
    if (mccFilter) d = d.filter((r) => r.mcc === mccFilter);
    if (mppFilter) d = d.filter((r) => r.mpp.includes(mppFilter));
    return d;
  }, [rows, search, mccFilter, mppFilter]);

  const total = data.length;
  const from = total ? (page - 1) * pageSize + 1 : 0;
  const to = Math.min(page * pageSize, total);

  const handleDelete = (id: number) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    message.success("Mapping deleted");
  };

  const columns = [
    {
      title: <span className="text-lighttext font-semibold">ID</span>,
      dataIndex: "id",
      key: "id",
      width: 70,
      render: (v: number) => <span className="text-textheading font-medium">{v}</span>,
    },
    {
      title: <span className="text-lighttext font-semibold">User Name</span>,
      dataIndex: "userName",
      key: "userName",
      render: (t: string) => <span className="text-textheading font-medium">{t}</span>,
    },
    {
      title: <span className="text-lighttext font-semibold">MCC</span>,
      dataIndex: "mcc",
      key: "mcc",
      render: (t: string) => <span className="text-textheading font-medium">{t}</span>,
    },
    {
      title: <span className="text-lighttext font-semibold">MPP</span>,
      dataIndex: "mpp",
      key: "mpp",
      render: (t: string) => <span className="text-textheading font-medium">{t}</span>,
    },
    {
      title: <span className="text-lighttext font-semibold">Action</span>,
      key: "action",
      width: 120,
      render: (_: any, record: Row) => (
        <Popconfirm
          title="Delete mapping?"
          placement="left"
          okText="Yes"
          cancelText="No"
          onConfirm={() => handleDelete(record.id)}
        >
          <button className="bg-red border-none text-white px-4 py-2 rounded-full flex items-center gap-2">
            <DeleteOutlined />
            Delete
          </button>
        </Popconfirm>
      ),
    },
  ];

  const itemRender = (_: number, type: any, original: any) => {
    if (type === "prev") {
      return (
        <button className="w-8 h-8 rounded-full border flex items-center justify-center">
          ‹
        </button>
      );
    }
    if (type === "next") {
      return (
        <button className="w-8 h-8 rounded-full border flex items-center justify-center">
          ›
        </button>
      );
    }
    return original;
  };

  return (
    <>
      <BradCrumb />
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="flex  items-center">

        {/* Header */}
        <div className="w-full">
          <h2 className="text-lg font-semibold mt-1">Assigned MCC List</h2>
          <p className="text-sm text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipis.
          </p>
        </div>

        {/* Search (top-right) */}
        <div className="flex w-full h-fit justify-end mb-3">
          <Input
            placeholder="Type to search"
            prefix={<SearchOutlined />}
            style={{ width: 280 }}
            value={search}
            onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
            }}
            />
        </div>
            </div>

        {/* Filters row + Assign button */}
        <div className="mb-4">
          <div className="flex justify-end items-center gap-3">
            <Select
              allowClear
              placeholder="Select MCC"
              style={{ width: 260 }}
              options={MCC_OPTIONS}
              value={mccFilter}
              onChange={(v) => {
                setPage(1);
                setMccFilter(v);
              }}
            />
            <Select
              allowClear
              placeholder="Select MPP"
              style={{ width: 260 }}
              options={MPP_OPTIONS}
              value={mppFilter}
              onChange={(v) => {
                setPage(1);
                setMppFilter(v);
              }}
            />
          <Button
            type="primary"
            className="bg-blue"
            onClick={() => {
              // TODO: open your Assign modal / call API
            }}
          >
            Assign
          </Button>
          </div>

        </div>

        {/* Table */}
        <Table
          rowKey="key"
          bordered
          dataSource={data}
          columns={columns as any}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: false,
            onChange: (p) => setPage(p),
            position: ["bottomRight"],
            itemRender,
          }}
        />

        {/* Footer showing */}
        <div className="text-sm text-gray-500 mt-2">
          {total ? `Showing ${from} to ${to} of ${total} entries` : "Showing 0 entries"}
        </div>
      </div>
    </>
  );
}
