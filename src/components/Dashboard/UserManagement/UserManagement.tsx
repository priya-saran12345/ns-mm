import { useMemo, useState } from "react";
import { Table, Input, Button, Avatar, Tooltip } from "antd";
import {
  SearchOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  SettingOutlined,
  CopyOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Edit2 } from "lucide-react";
import BradCrumb from "../BreadCrumb";
import RegisterUserModal from "./RegisterUserModal";
import EditUserModal from "./EditUserModal";
import { IoDocumentText } from "react-icons/io5";
import { HiMiniArrowRightEndOnRectangle } from "react-icons/hi2";
import { BsPaperclip } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

type Row = {
  key: number;
  id: number;
  name: string;
  username: string;
  password: string;
  role: string;
  appVersion: string;
};

const mask = (s: string) => "•".repeat(Math.max(8, s.length));

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editRow, setEditRow] = useState<Row | null>(null);
  const navigate = useNavigate();

  // sample rows to match your screenshot
  const rows: Row[] = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
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
        username: "admin@gmail.com",
        password: "Admin@123",
        role: "Admin",
        appVersion: "1.2.2",
      })),
    []
  );

  const data = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        String(r.id).includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.username.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q) ||
        r.appVersion.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const pageSize = 10; // shows like your image (10 rows)
  const total = data.length;
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
      title: <span className="text-lighttext font-semibold">User Name</span>,
      dataIndex: "username",
      key: "username",
      render: (text: string) => <span className="text-textheading font-medium">{text}</span>,
    },
    {
      title: <span className="text-lighttext font-semibold">Password</span>,
      dataIndex: "password",
      key: "password",
      render: (text: string) => (
        <span className="inline-flex items-center gap-2">
          <span className="tracking-widest">{mask(text)}</span>
          <EyeInvisibleOutlined className="text-red text-[20px]" />
        </span>
      ),
    },
    {
      title: <span className="text-lighttext font-semibold">Role</span>,
      dataIndex: "role",
      key: "role",
      render: (text: string) => <span className="text-textheading font-medium">{text}</span>,
    },
    {
      title: <span className="text-lighttext font-semibold">App Version</span>,
      dataIndex: "appVersion",
      key: "appVersion",
      width: 110,
      render: (text: string) => <span className="text-textheading font-medium">{text}</span>,
    },
    {
      title: <span className="text-lighttext font-semibold">Action</span>,
      key: "action",
      width: 260,
      render: (_: any, record: Row) => (
        <div className="flex items-center gap-2">
          {/* small square action buttons to match screenshot */}
          <Tooltip title="Permissions">
    <Button
      size="small"
      className="bg-blue rounded-lg text-[18px] text-white border-0"
      onClick={() => navigate("/users/assign-mpp")}
    >
      <IoDocumentText />
    </Button>
          </Tooltip>
          <Tooltip title="Block / Unblock">
            <Button size="small"  className="bg-[#05825F] text-[18px] text-white border-0">
              <StopOutlined />
            </Button>
          </Tooltip>
          <Tooltip title="Block / Unblock">
            <Button size="small"  className="bg-lightorange text-[18px] text-white border-0">
              <HiMiniArrowRightEndOnRectangle />
            </Button>
          </Tooltip>
          <Tooltip title="Copy">
            <Button size="small"  className="bg-[#3596F7] text-[18px] text-white border-0">
              <BsPaperclip />

            </Button>
          </Tooltip>

          {/* blue rounded Edit like in image */}
          <Button
            size="middle"
            type="default"
            className="text-white rounded-full bg-blue !py-1 border-0 px-4"
            onClick={() => {
              setEditRow(record);
              setOpenEdit(true);
            }}
            icon={<Edit2 size={16} />}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <BradCrumb />
      <div className="p-4 bg-white rounded-lg shadow">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mt-1">User Management</h2>
          <p className="text-sm text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipis.
          </p>
        </div>

        {/* Top bar: right search + Connect button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-3 mb-4">
          <Input
            placeholder="Type to search"
            prefix={<SearchOutlined />}
            style={{ width: 280 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            type="primary"
            className="bg-blue"
            onClick={() => setOpenCreate(true)}
          >
            + Connect New Account
          </Button>
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
          }}
        />

        {/* footer showing */}
        <div className="text-sm text-gray-500 mt-2">
          {total ? `Showing ${from} to ${to} of ${total} entries` : "Showing 0 entries"}
        </div>
      </div>

      {/* Create New User popup (separate component) */}
      <RegisterUserModal open={openCreate} onClose={() => setOpenCreate(false)} />

      {/* Edit popup (separate component) */}
      <EditUserModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        user={editRow}
      />
    </>
  );
}
