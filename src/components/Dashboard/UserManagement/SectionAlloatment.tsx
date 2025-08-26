import { useMemo, useState } from "react";
import { Table, Input, Button } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import BradCrumb from "../BreadCrumb";
import AssignSectionModal from "./AssignSectionModal";
import RoleFilterDropdown from "./RoleFilterDropdown";

type Row = {
  key: number;
  id: number;
  name: string;
  email: string;
  assignedSection: string; // e.g., "4,5"
  assignedMcc: string;     // e.g., "1,2,3,4,5,6,7,8"
};

const sampleRows: Row[] = Array.from({ length: 10 }).map((_, i) => ({
  key: i + 1,
  id: i + 1,
  name:
    [
      "Admin",
      "Kaushikee(CS)",
      "kaushikeemilk",
      "test",
      "Binod Kumar",
      "Rajeev Kumar",
      "Umesh Kumar",
      "Pramod Kumar",
      "Shivam Kumar",
      "Sanjay Kumar",
    ][i] || "User",
  email: "admin@gmail.com",
  assignedSection: "4,5",
  assignedMcc: "1,2,3,4,5,6,7,8",
}));

export default function SectionAllocation() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [openAssign, setOpenAssign] = useState(false);
  const [roles, setRoles] = useState<string[]>(["LegalOfficer"]); // default like screenshot

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sampleRows;
    return sampleRows.filter(
      (r) =>
        String(r.id).includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.assignedSection.includes(q) ||
        r.assignedMcc.includes(q)
    );
  }, [search]);

  const pageSize = 5;
  const total = rows.length;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const columns = [
    {
      title: <span className="text-lighttext font-semibold">ID</span>,
      dataIndex: "id",
      key: "id",
      width: 70,
      render: (v: number) => <span className="text-textheading font-medium">{v}</span>,
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
      title: <span className="text-lighttext font-semibold">Assigned Section</span>,
      dataIndex: "assignedSection",
      key: "assignedSection",
      width: 150,
      render: (text: string) => <span className="text-textheading font-medium">{text}</span>,
    },
    {
      title: <span className="text-lighttext font-semibold">Assigned MCC</span>,
      dataIndex: "assignedMcc",
      key: "assignedMcc",
      width: 220,
      render: (text: string) => <span className="text-textheading font-medium">{text}</span>,
    },
  ];

  // rounded pagination like the screenshot
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
        {/* Header */}
        <div className="mb-4">
          <div className="text-sm text-gray-500">
            Dashboard — User Management — Section Allocation
          </div>
          <h2 className="text-lg font-semibold mt-1">Section Allocation</h2>
          <p className="text-sm text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipis.
          </p>
        </div>

        {/* Action bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-3 mb-4">
          <Input
            placeholder="Type to search"
            prefix={<SearchOutlined />}
            style={{ width: 280 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Button type="primary" className="bg-blue" onClick={() => setOpenAssign(true)}>
            Assign
          </Button>

          {/* role dropdown that opens the small checkbox popup */}
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

        {/* Table */}
        <Table
          rowKey="key"
          bordered
          dataSource={rows}
          columns={columns as any}
          pagination={{
            current: page,
            pageSize,
            total,
            onChange: (p) => setPage(p),
            showSizeChanger: false,
            position: ["bottomRight"],
            itemRender,
          }}
        />

        {/* Footer “showing … entries” */}
        <div className="text-sm text-gray-500 mt-2">
          {total ? `Showing ${from} to ${to} of ${total} entries` : "Showing 0 entries"}
        </div>
      </div>

      {/* Assign modal (separate component) */}
      <AssignSectionModal
        open={openAssign}
        onClose={() => setOpenAssign(false)}
        defaultRoleValues={roles}
      />
    </>
  );
}
