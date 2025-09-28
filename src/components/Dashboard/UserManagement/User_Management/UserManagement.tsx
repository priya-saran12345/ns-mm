import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Table, Input, Button, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined, StopOutlined } from "@ant-design/icons";
import { Edit2 } from "lucide-react";
import { IoDocumentText } from "react-icons/io5";
import { HiMiniArrowRightEndOnRectangle } from "react-icons/hi2";
import { BsPaperclip } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

import BradCrumb from "../../BreadCrumb";
import RegisterUserModal from "../RegisterUserModal";
import EditUserModal from "./EditUserModal";

// ✅ thunks
import { fetchUsersThunk, UsersTablePayload, deactivateUserThunk } from "./thunks";
// store
import { useAppDispatch } from "../../../../store/store";

// ⚠️ Reusable modal with your message formats (warning/success/info/delete)
import MessageModal from "../../../../components/Dashboard/Message"; 

type Row = {
  id: number;
  name: string;
  username: string;
  password: string;
  role: string;
  email: string;
  appVersion?: string;
};

const API_PATH = "/api/v1/user";
const PAGE_SIZE = 10;

const UserManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // server state (local to this screen)
  const [serverRows, setServerRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editRow, setEditRow] = useState<Row | null>(null);

  // deactivate modals state
  const [confirmDeactivate, setConfirmDeactivate] = useState<{ open: boolean; user: Row | null }>({
    open: false,
    user: null,
  });
  const [resultModal, setResultModal] = useState<{ open: boolean; ok: boolean; msg: string }>({
    open: false,
    ok: true,
    msg: "",
  });

  const fetchPage = useCallback(async () => {
    setLoading(true);
    try {
      const payload = await dispatch(
        fetchUsersThunk({ path: API_PATH, page, limit: PAGE_SIZE /*, search*/ })
      ).unwrap();

      const { rows, pagination } = payload as UsersTablePayload;
      setServerRows(rows as Row[]);
      setTotal(pagination?.total ?? rows.length);
    } catch (_e) {
      setServerRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [dispatch, page]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  // Optional client-side search over current page
  const data = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return serverRows;
    return serverRows.filter((r) => {
      const idStr = String(r.id);
      return (
        idStr.includes(q) ||
        (r.name ?? "").toLowerCase().includes(q) ||
        (r.username ?? "").toLowerCase().includes(q) ||
        (r.role ?? "").toLowerCase().includes(q) ||
        (r.email ?? "").toLowerCase().includes(q) ||
        (r.appVersion ?? "").toLowerCase().includes(q)
      );
    });
  }, [serverRows, search]);

  const columns: ColumnsType<Row> = [
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
      title: <span className="text-lighttext font-semibold">Role</span>,
      dataIndex: "role",
      key: "role",
      render: (text: string) => <span className="text-textheading font-medium">{text}</span>,
    },
    {
      title: <span className="text-lighttext font-semibold">Email</span>,
      dataIndex: "email",
      key: "email",
      render: (text: string) => <span className="text-textheading font-medium">{text}</span>,
    },
    {
      title: <span className="text-lighttext font-semibold">Action</span>,
      key: "action",
      width: 300,
      render: (_: unknown, record: Row) => (
        <div className="flex items-center gap-2">
          {/* small square action buttons */}
          <Tooltip title="Permissions">
            <Button
              size="small"
              className="bg-blue rounded-lg text-[18px] text-white border-0"
              onClick={() => navigate("/users/assign-mpp")}
            >
              <IoDocumentText />
            </Button>
          </Tooltip>

          {/* Deactivate */}
          <Tooltip title="Deactivate User">
            <Button
              size="small"
              className="bg-[#05825F] text-[18px] text-white border-0"
              onClick={() => setConfirmDeactivate({ open: true, user: record })}
            >
              <StopOutlined />
            </Button>
          </Tooltip>

          <Tooltip title="Logout from all devices">
            <Button size="small" className="bg-lightorange text-[18px] text-white border-0">
              <HiMiniArrowRightEndOnRectangle />
            </Button>
          </Tooltip>
          <Tooltip title="Copy">
            <Button size="small" className="bg-[#3596F7] text-[18px] text-white border-0">
              <BsPaperclip />
            </Button>
          </Tooltip>

          {/* blue rounded Edit */}
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
        </div>

        {/* Top bar: right search + Connect button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-3 mb-4">
          <Input
            placeholder="Type to search"
            prefix={<SearchOutlined />}
            style={{ width: 280 }}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // reset to page 1 on new search
            }}
            allowClear
          />
          <Button type="primary" className="bg-blue" onClick={() => setOpenCreate(true)}>
            + Connect New Account
          </Button>
        </div>

        {/* Table */}
        <Table<Row>
          rowKey="id"
          bordered
          loading={loading}
          dataSource={data}
          columns={columns}
          pagination={{
            current: page,
            pageSize: PAGE_SIZE,
            total,
            showSizeChanger: false,
            onChange: (p) => setPage(p),
            position: ["bottomRight"],
          }}
        />

        {/* footer showing */}
        <div className="text-sm text-gray-500 mt-2">
          {total
            ? `Showing ${(page - 1) * PAGE_SIZE + 1} to ${Math.min(page * PAGE_SIZE, total)} of ${total} entries`
            : "Showing 0 entries"}
        </div>
      </div>

      {/* Create New User popup */}
      <RegisterUserModal open={openCreate} onClose={() => setOpenCreate(false)} />

      {/* Edit popup */}
      <EditUserModal open={openEdit} onClose={() => setOpenEdit(false)} userId={editRow?.id ?? null} />

      {/* Deactivate: Warning confirm */}
      <MessageModal
        open={confirmDeactivate.open}
        variant="warning"
        title="Warning!"
        message={`Are you sure you want to deactivate "${confirmDeactivate.user?.username}"? Some changes may not be reversible.`}
        onCancel={() => setConfirmDeactivate({ open: false, user: null })}
        onConfirm={async () => {
          if (!confirmDeactivate.user) return;
          try {
            await dispatch(
              deactivateUserThunk({ path: API_PATH, id: confirmDeactivate.user.id })
            ).unwrap();

            setConfirmDeactivate({ open: false, user: null });
            setResultModal({ open: true, ok: true, msg: "User was deactivated successfully." });

            // refresh list
            fetchPage();
          } catch (e: any) {
            setConfirmDeactivate({ open: false, user: null });
            setResultModal({ open: true, ok: false, msg: e || "Failed to deactivate user." });
          }
        }}
        confirmText="Proceed"
        cancelText="Cancel"
      />

      {/* Deactivate: result message */}
      <MessageModal
        open={resultModal.open}
        variant={resultModal.ok ? "success" : "info"}
        title={resultModal.ok ? "Success!" : "Info!"}
        message={resultModal.msg}
        onConfirm={() => setResultModal({ open: false, ok: true, msg: "" })}
      />
    </>
  );
};

export default UserManagement;
