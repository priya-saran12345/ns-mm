// SectionAllocationDummy.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Table, Input, Button, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";          // 👈 NEW
import type { AppDispatch } from "../../../../store/store";
import { fetchAssignedPermissionByIdThunk } from "./thunk";
import { AiFillDelete, AiOutlineEye } from "react-icons/ai";

const { Option } = Select;

type Row = {
  id: number;
  userName: string;
  mcc: string;
  mpp: string;
};

const PAGE_SIZE = 5;

const SectionAllocationDummy: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // 👇 get id from URL: /users/section-alloatment/:id
  const { id } = useParams<{ id: string }>();
  const userId = id ?? null;

  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  /* ========== FETCH SINGLE USER'S PERMISSION BY ID ========== */
  useEffect(() => {
    if (!userId) {
      setRows([]);
      return;
    }

    setLoading(true);

    dispatch(fetchAssignedPermissionByIdThunk(userId))
      .unwrap()
      .then((perm) => {
        if (!perm) {
          setRows([]);
          return;
        }

        const user = perm.user || {};
        const fn = (user.first_name || "").trim();
        const ln = (user.last_name || "").trim();
        const fullName =
          [fn, ln].filter(Boolean).join(" ") ||
          user.email?.split("@")[0] ||
          `User ${perm.user_id}`;

        const mccCodes: string[] = Array.isArray(perm.mcc_codes)
          ? perm.mcc_codes
          : [];
        const mppCodes: string[] = Array.isArray(perm.mpp_codes)
          ? perm.mpp_codes
          : [];

        const mappedRows: Row[] = mccCodes.length
          ? mccCodes.map((mcc, idx) => ({
              id: idx + 1,
              userName: fullName,
              mcc,
              mpp: mppCodes.join(", "),
            }))
          : [
              {
                id: 1,
                userName: fullName,
                mcc: "-",
                mpp: mppCodes.join(", ") || "-",
              },
            ];

        setRows(mappedRows);
      })
      .catch(() => {
        setRows([]);
      })
      .finally(() => setLoading(false));
  }, [userId, dispatch]);

  const total = rows.length;

  const dataSource = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return rows.slice(start, end).map((r) => ({ key: r.id, ...r }));
  }, [page, rows]);

  const columns = [
    {
      title: <span className="text-xs text-gray-400">ID</span>,
      dataIndex: "id",
      key: "id",
      width: 60,
      render: (v: number) => (
        <span className="text-sm text-gray-800 font-medium">{v}</span>
      ),
    },
    {
      title: <span className="text-xs text-gray-400">Action</span>,
      key: "action",
      width: 120,
      render: () => (
        <div className="flex items-center gap-3">
          {/* DELETE — RED CIRCLE */}
          <button
            type="button"
            className="w-8 h-8 rounded-full bg-red border-none flex items-center justify-center text-white hover:opacity-90 transition"
          >
            <AiFillDelete size={16} />
          </button>

          {/* VIEW/EDIT — BLUE CIRCLE */}
          <button
            type="button"
            className="w-8 h-8 rounded-full bg-blue border-none flex items-center justify-center text-white hover:opacity-90 transition"
          >
            <AiOutlineEye size={16} />
          </button>
        </div>
      ),
    },
    {
      title: <span className="text-xs text-gray-400">User Name</span>,
      dataIndex: "userName",
      key: "userName",
      render: (text: string) => (
        <span className="text-sm text-gray-800 font-medium">{text}</span>
      ),
    },
    {
      title: <span className="text-xs text-gray-400">MCC</span>,
      dataIndex: "mcc",
      key: "mcc",
      render: (text: string) => (
        <span className="text-sm text-gray-800">{text}</span>
      ),
    },
    {
      title: <span className="text-xs text-gray-400">MPP</span>,
      dataIndex: "mpp",
      key: "mpp",
      render: (text: string) => (
        <span className="text-sm text-gray-800">{text}</span>
      ),
    },
  ];

  const itemRender = (_: any, type: any, originalElement: any) => {
    if (type === "prev") {
      return (
        <button className="w-8 h-8 rounded-full border flex items-center justify-center text-gray-500">
          ‹
        </button>
      );
    }
    if (type === "next") {
      return (
        <button className="w-8 h-8 rounded-full border flex items-center justify-center text-gray-500">
          ›
        </button>
      );
    }
    return originalElement;
  };

  const from = total ? (page - 1) * PAGE_SIZE + 1 : 0;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Assigned MCC List
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Lorem ipsum dolor sit amet, consectetur adipis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Type to search"
            prefix={<SearchOutlined />}
            style={{ width: 260 }}
          />
        </div>
      </div>

      {/* Filter row (dummy UI) */}
      <div className="flex flex-wrap gap-3 justify-end mb-3">
        <Select
          placeholder="Select MCC"
          style={{ minWidth: 180 }}
          allowClear
          disabled
        >
          <Option value="mcc1">Satar kataliya(005)a</Option>
        </Select>
        <Select
          placeholder="Select MPP"
          style={{ minWidth: 180 }}
          allowClear
          disabled
        >
          <Option value="001103">001103</Option>
        </Select>
        <Select
          placeholder="Assigned"
          style={{ minWidth: 140 }}
          allowClear
          disabled
        >
          <Option value="yes">Assigned</Option>
        </Select>
                  <Button type="primary" className="bg-blue">
            Assign
          </Button>

      </div>

      {/* Table */}
      <Table
        bordered={false}
        loading={loading}
        columns={columns as any}
        dataSource={dataSource}
        pagination={{
          current: page,
          pageSize: PAGE_SIZE,
          total,
          onChange: setPage,
          showSizeChanger: false,
          position: ["bottomRight"],
          itemRender,
        }}
      />

      {/* Footer text */}
      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
        <div>
          {total
            ? `Showing ${from} to ${to} of ${total} entries`
            : "Showing 0 entries"}
        </div>
      </div>
    </div>
  );
};

export default SectionAllocationDummy;
