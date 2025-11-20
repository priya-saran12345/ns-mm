// SectionAllocationDummy.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Table, Input, Button, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { AppDispatch } from "../../../../store/store";

import { fetchAssignedPermissionByIdThunk } from "./thunk";
import { AiFillDelete, AiOutlineEye } from "react-icons/ai";

import {
  fetchMccListThunk,
  fetchMppListThunk,
  fetchFormStepsThunk,
} from "../../Master/Category/thunk";

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
  const { id } = useParams<{ id: string }>();
  const userId = id ?? null;

  // table state
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Row[]>([]);
  const [loadingPermission, setLoadingPermission] = useState(false);

  // filters / dropdown selections
  const [selectedMccFilter, setSelectedMccFilter] = useState<string | undefined>();
  const [selectedMppFilter, setSelectedMppFilter] = useState<string[] | undefined>([]);
  const [selectedFormSteps, setSelectedFormSteps] = useState<number[] | undefined>([]);

  // remote search text
  const [mccSearch, setMccSearch] = useState("");
  const [mppSearch, setMppSearch] = useState("");

  // category slice
  const categoryState = useSelector((s: any) => s.category);
  const {
    mccItems = [],
    loadingMcc = false,
    mppItems = [],
    loadingMpp = false,
    formStepItems =[],
    loadingFormSteps = false,
  } = categoryState ?? {};

  /* ----- Load MCC + Form Steps on mount ----- */
  useEffect(() => {
    dispatch(fetchMccListThunk({ page: 1, limit: 100, search: "" }) as any);
    dispatch(fetchFormStepsThunk() as any);
  }, [dispatch]);

  /* ----- When MCC changes, load MPP for that MCC ----- */
  useEffect(() => {
    if (!selectedMccFilter) {
      return;
    }
    dispatch(
      fetchMppListThunk({
        page: 1,
        limit: 100,
        mcc_code: selectedMccFilter,
        search: mppSearch,
      }) as any
    );
  }, [selectedMccFilter, mppSearch, dispatch]);

  /* ----- Fetch single user's permissions ----- */
  useEffect(() => {
    if (!userId) {
      setRows([]);
      return;
    }

    setLoadingPermission(true);

    dispatch(fetchAssignedPermissionByIdThunk(userId as any))
      .unwrap()
      .then((res: any) => {
        const perm = Array.isArray(res?.data) ? res.data[0] : res?.data || res;
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
          ? mccCodes.map((mcc: string, idx: number) => ({
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
      .finally(() => setLoadingPermission(false));
  }, [userId, dispatch]);

  const total = rows.length;

  const dataSource = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return rows.slice(start, end).map((r) => ({ key: r.id, ...r }));
  }, [page, rows]);

  // MPP list already filtered by API using mcc_code + search;
  // no extra filtering needed, but keep guard for safety
  const filteredMppItems = useMemo(() => {
    if (!selectedMccFilter) return [];
    return (mppItems || []).filter(
      (m: any) => m.mcc_code === selectedMccFilter
    );
  }, [mppItems, selectedMccFilter]);

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
          <button
            type="button"
            className="w-8 h-8 rounded-full bg-red border-none flex items-center justify-center text-white hover:opacity-90 transition"
          >
            <AiFillDelete size={16} />
          </button>
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

      {/* Filter row */}
      <div className="flex flex-wrap gap-3 justify-end mb-3">
        {/* MCC (searchable) */}
        <Select
          placeholder="Select MCC"
          style={{ minWidth: 180 }}
          allowClear
          showSearch
          value={selectedMccFilter}
          loading={loadingMcc}
          filterOption={false} // remote search
          onSearch={(value) => {
            setMccSearch(value);
            dispatch(
              fetchMccListThunk({ page: 1, limit: 100, search: value }) as any
            );
          }}
          onChange={(val) => {
            setSelectedMccFilter(val);
            setSelectedMppFilter([]);
            setMppSearch("");
          }}
        >
          {(mccItems || []).map((m: any) => (
            <Option key={m.mcc_code} value={m.mcc_code}>
              {m.mcc_name} ({m.mcc_code})
            </Option>
          ))}
        </Select>

        {/* MPP (multi-select, searchable, depends on MCC) */}
        <Select
          mode="multiple"
          placeholder="Select MPP"
          style={{ minWidth: 220 }}
          allowClear
          value={selectedMppFilter}
          loading={loadingMpp}
          disabled={!selectedMccFilter}
          showSearch
          filterOption={false}
          onSearch={(value) => {
            setMppSearch(value);
            if (selectedMccFilter) {
              dispatch(
                fetchMppListThunk({
                  page: 1,
                  limit: 100,
                  mcc_code: selectedMccFilter,
                  search: value,
                }) as any
              );
            }
          }}
          onChange={(val) => setSelectedMppFilter(val)}
        >
          {filteredMppItems.map((m: any) => (
            <Option key={m.mpp_code} value={m.mpp_code}>
              {m.mpp_code} - {m.mpp_name}
            </Option>
          ))}
        </Select>

        {/* Assigned Sections (Form Steps, multi-select) */}
        <Select
          mode="multiple"
          placeholder="Assign Sections"
          style={{ minWidth: 240 }}
          allowClear
          value={selectedFormSteps}
          loading={loadingFormSteps}
          onChange={(val) => setSelectedFormSteps(val)}
        >
          {(formStepItems || []).map((fs: any) => (
            <Option key={fs.id} value={fs.id}>
              {fs.name}
            </Option>
          ))}
        </Select>

        <Button type="primary" className="bg-blue-500">
          Assign
        </Button>
      </div>

      {/* Table */}
      <Table
        bordered={false}
        loading={loadingPermission}
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
