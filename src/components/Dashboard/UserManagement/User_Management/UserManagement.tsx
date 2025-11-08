// src/modules/UserManagement/components/UserManagement.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Table, Input, Button, Tooltip, message } from "antd"; // 👈 import message
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined, StopOutlined } from "@ant-design/icons";
import { Edit2 } from "lucide-react";
import { IoDocumentText } from "react-icons/io5";
import { HiMiniArrowRightEndOnRectangle } from "react-icons/hi2";
import { BsPaperclip } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

import BradCrumb from "../../BreadCrumb";
import RegisterUserModal from "./RegisterUserModal";
import EditUserModal from "./EditUserModal";

// ✅ thunks
import {
  fetchUsersThunk,
  UsersTablePayload,
  deactivateUserThunk,
  createUserThunk,
} from "./thunks";
import { useAppDispatch } from "../../../../store/store";

import MessageModal from "../../../../components/Dashboard/Message";

type Row = {
  id: number;
  name: string;
  username: string;
  password: string;
  role: string;
  email: string;
  appVersion?: string;
  userRole?: { id: number; name: string; status?: boolean; category?: { id: number; name: string } };
};

const API_PATH = "user";
const PAGE_SIZE = 10;

const UserManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [serverRows, setServerRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editRow, setEditRow] = useState<Row | null>(null);

  const [confirmDeactivate, setConfirmDeactivate] = useState<{ open: boolean; user: Row | null }>({
    open: false,
    user: null,
  });
  const [resultModal, setResultModal] = useState<{ open: boolean; ok: boolean; msg: string }>({
    open: false,
    ok: true,
    msg: "",
  });

  const mapToRow = (u: any): Row => {
    const roleName: string = u?.userRole?.name ?? u?.role ?? "";
    return {
      id: u.id,
      name: (u.first_name || u.last_name) ? `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() :
       "---",
      username: u.username ?? u.email,
      password: "********",
      role: roleName,
      email: u.email,
      appVersion: u.appVersion ?? "",
      userRole: u.userRole ?? (roleName ? { id: 0, name: roleName } : undefined),
    };
  };

  const fetchPage = useCallback(async () => {
    setLoading(true);
    try {
      const payload = await dispatch(
        fetchUsersThunk({ path: API_PATH, page, limit: PAGE_SIZE /*, search*/ })
      ).unwrap();
      const { rows, pagination } = payload as UsersTablePayload;
      const mapped: Row[] = (rows as any[]).map(mapToRow);
      setServerRows(mapped);
      setTotal(pagination?.total ?? mapped.length);
    } catch {
      setServerRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [dispatch, page]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

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
    { title: <span className="text-lighttext font-semibold">ID</span>, dataIndex: "id", key: "id", width: 70,
      render: (v: number) => <span className="text-textheading font-medium">{v}</span> },
    { title: <span className="text-lighttext font-semibold">Name</span>, dataIndex: "name", key: "name",
      render: (t: string) => <span className="text-textheading font-medium">{t}</span> },
    { title: <span className="text-lighttext font-semibold">User Name</span>, dataIndex: "username", key: "username",
      render: (t: string) => <span className="text-textheading font-medium">{t}</span> },
    { title: <span className="text-lighttext font-semibold">Role</span>, dataIndex: "role", key: "role",
      render: (_: unknown, r: Row) => <span className="text-textheading font-medium">{r.userRole?.name || r.role || "-"}</span> },
    { title: <span className="text-lighttext font-semibold">Email</span>, dataIndex: "email", key: "email",
      render: (t: string) => <span className="text-textheading font-medium">{t}</span> },
    {
      title: <span className="text-lighttext font-semibold">Action</span>, key: "action", width: 300,
      render: (_: unknown, record: Row) => (
        <div className="flex items-center gap-2">
          {/* <Tooltip title="Permissions">
            <Button size="small" className="bg-blue rounded-lg text-[18px] text-white border-0" onClick={() => navigate("/users/assign-mpp")}>
              <IoDocumentText />
            </Button>
          </Tooltip> */}
          <Tooltip title="Deactivate User">
            <Button size="small" className="bg-[#05825F] text-[18px] text-white border-0"
              onClick={() => setConfirmDeactivate({ open: true, user: record })}>
              <StopOutlined />
            </Button>
          </Tooltip>
          <Tooltip title="Logout from all devices">
            <Button size="small" className="bg-lightorange text-[18px] text-white border-0">
              <HiMiniArrowRightEndOnRectangle />
            </Button>
          </Tooltip>
          <Tooltip title="Signature">
            <Button size="small" className="bg-[#3596F7] text-[18px] text-white border-0">
              <BsPaperclip />
            </Button>
          </Tooltip>
          <Button size="middle" type="default" className="text-white rounded-full bg-blue !py-1 border-0 px-4"
            onClick={() => { setEditRow(record); setOpenEdit(true); }} icon={<Edit2 size={16} />}>
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
        <div className="mb-4">
          <h2 className="text-lg font-semibold mt-1">User Management</h2>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-3 mb-4">
          <Input
            placeholder="Type to search"
            prefix={<SearchOutlined />}
            style={{ width: 280 }}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            allowClear
          />
          <Button type="primary" className="bg-blue" onClick={() => setOpenCreate(true)}>
            + Connect New Account
          </Button>
        </div>

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

        <div className="text-sm text-gray-500 mt-2">
          {total
            ? `Showing ${(page - 1) * PAGE_SIZE + 1} to ${Math.min(page * PAGE_SIZE, total)} of ${total} entries`
            : "Showing 0 entries"}
        </div>
      </div>

      {/* Create New User popup */}
      <RegisterUserModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreate={async (payload) => {
          try {
            await dispatch(createUserThunk({ path: "user", body: payload })).unwrap();
            message.success("User created successfully");
            // refresh first, then close (so list is up-to-date when modal disappears)
            await fetchPage();
            setOpenCreate(false);
          } catch (e: any) {
            message.error(e || "Failed to create user");
          }
        }}
      />

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
            await dispatch(deactivateUserThunk({ path: API_PATH, id: confirmDeactivate.user.id })).unwrap();
            setConfirmDeactivate({ open: false, user: null });
            setResultModal({ open: true, ok: true, msg: "User was deactivated successfully." });
            await fetchPage(); // refresh list
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
