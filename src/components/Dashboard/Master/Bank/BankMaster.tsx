import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch } from "../../../../store/store";

import type { RootStateWithBanks, Bank } from "./types";
import { fetchBanksThunk } from "./thunk";
import {
  setBanksLimit,
  setBanksPage,
  setBanksSearch,
  setBanksSort,
} from "./slice";

import { Table, Input, Button, Modal, Upload, Pagination, Space, Typography, Form, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { MdOutlineCloudUpload, MdOutlineFileDownload } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import * as XLSX from "xlsx";
import BradCrumb from "../../BreadCrumb";

const { Title, Text } = Typography;

const statusPill = (status: boolean) => {
  const bg = status ? "bg-[#DCFCE7]" : "bg-[#FEE2E2]";
  const text = status ? "text-[#14532D]" : "text-[#7F1D1D]";
  const dot = status ? "bg-[#22C55E]" : "bg-[#EF4444]";
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${bg} ${text}`}>
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {status ? "Active" : "Inactive"}
    </span>
  );
};

const BankListPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, page, limit, total, sort_by, sort, search } =
    useSelector((s: RootStateWithBanks) => s.banks);

  // local UI states
  const [localSearch, setLocalSearch] = useState(search ?? "");
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<Bank | null>(null);

  // Fetch on mount & on paging/sort/search change
  useEffect(() => {
    dispatch(fetchBanksThunk());
  }, [dispatch, page, limit, sort_by, sort, search]);

  // Columns
  const columns = useMemo(
    () => [
      {
        title: <span className="text-lighttext font-semibold">S.N.</span>,
        key: "sn",
        width: 80,
        render: (_: any, __: Bank, idx: number) => (page - 1) * limit + idx + 1,
      },
      {
        title: <span className="text-lighttext font-semibold">Bank Name</span>,
        dataIndex: "bank_name",
        key: "bank_name",
        render: (text: string) => <span className="text-textheading font-medium">{text}</span>,
      },
      {
        title: <span className="text-lighttext font-semibold">IFSC Code</span>,
        dataIndex: "ifsc_code",
        key: "ifsc_code",
        render: (text: string) => <span className="text-textheading font-medium">{text}</span>,
      },
      {
        title: <span className="text-lighttext font-semibold">Branch</span>,
        dataIndex: "branch",
        key: "branch",
        render: (text: string) => <span className="text-textheading font-medium">{text}</span>,
      },
      {
        title: <span className="text-lighttext font-semibold">Status</span>,
        dataIndex: "status",
        key: "status",
        render: (s: boolean) => statusPill(s),
      },
      {
        title: <span className="text-lighttext font-semibold">Created</span>,
        dataIndex: "created_at",
        key: "created_at",
        render: (v: string) => (
          <Text type="secondary">{v ? new Date(v).toLocaleString() : "-"}</Text>
        ),
      },
      {
        title: <span className="text-lighttext font-semibold">Action</span>,
        key: "action",
        width: 120,
        render: (_: any, record: Bank) => (
          <Button
            type="primary"
            icon={<BiEdit />}
            className="bg-blue rounded-full"
            onClick={() => {
              setEditRecord(record);
              setIsEditOpen(true);
            }}
          >
            Edit
          </Button>
        ),
      },
    ],
    [page, limit]
  );

  // Search
  const onSearchApply = () => dispatch(setBanksSearch(localSearch.trim()));

  // Pagination
  const onPageChange = (newPage: number, newPageSize?: number) => {
    if (newPageSize && newPageSize !== limit) dispatch(setBanksLimit(newPageSize));
    if (newPage !== page) dispatch(setBanksPage(newPage));
  };

  // Export current table view
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(items);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Banks");
    XLSX.writeFile(wb, `Banks_p${page}_l${limit}.xlsx`);
  };

  // Download empty import template
  const handleDownloadTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet([], {
      header: ["bank_name", "ifsc_code", "branch", "status"],
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BankMaster");
    XLSX.writeFile(workbook, "BankMaster_Template.xlsx");
  };

  // (Optional) Sort toggler for created_at
  const toggleCreatedSort = () => {
    const next = sort === "desc" ? "asc" : "desc";
    dispatch(setBanksSort({ sort_by: "created_at", sort: next }));
  };

  return (
    <>
      <BradCrumb />
      <div className="p-4 bg-white rounded-lg shadow">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <Title level={4} className="!mb-0">Bank Master</Title>
            <p className="text-sm text-gray-500">Manage bank records (IFSC, Branch, status).</p>
          </div>
          <Space wrap>
            <Input
              allowClear
              placeholder="Search bank / IFSC / branch"
              prefix={<SearchOutlined />}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onPressEnter={onSearchApply}
              style={{ width: 260 }}
            />
            <Button onClick={onSearchApply}>Search</Button>
            <Button onClick={toggleCreatedSort}>
              Sort by Created ({sort.toUpperCase()})
            </Button>
            <Button onClick={handleDownloadTemplate}>
              <MdOutlineFileDownload style={{ fontSize: 18, marginRight: 6 }} />
              Download Format
            </Button>
            <Button onClick={() => setIsImportOpen(true)}>Import</Button>
            <Button onClick={handleExport}>Export</Button>
          </Space>
        </div>

        {/* Table */}
        <Table<Bank>
          bordered
          rowKey={(r) => r.id}
          dataSource={items}
          columns={columns as any}
          loading={loading}
          pagination={false}
        />

        {/* Footer: Pagination */}
        <div className="flex justify-end mt-4">
          <Pagination
            current={page}
            pageSize={limit}
            total={total}
            showSizeChanger
            pageSizeOptions={["10", "20", "50", "100"]}
            onChange={onPageChange}
          />
        </div>

        {/* Edit Modal (scaffold; wire to your update API when ready) */}
        <Modal
          title={<span className="text-lg font-semibold">Edit Bank</span>}
          open={isEditOpen}
          onCancel={() => setIsEditOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>,
            <Button key="update" type="primary" className="bg-blue">
              Update
            </Button>,
          ]}
        >
          {editRecord && (
            <Form layout="vertical" className="mt-2">
              <Form.Item label="Bank Name">
                <Input
                  value={editRecord.bank_name}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, bank_name: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item label="IFSC Code">
                <Input
                  value={editRecord.ifsc_code}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, ifsc_code: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item label="Branch">
                <Input
                  value={editRecord.branch}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, branch: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item label="Status">
                <Tag color={editRecord.status ? "green" : "red"}>
                  {editRecord.status ? "Active" : "Inactive"}
                </Tag>
              </Form.Item>
            </Form>
          )}
        </Modal>

        {/* Import Modal (UI only; connect to your import API) */}
        <Modal
          title="Import Bank Master"
          open={isImportOpen}
          onCancel={() => setIsImportOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsImportOpen(false)}>
              Cancel
            </Button>,
            <Button key="import" type="primary" className="bg-blue">
              Import
            </Button>,
          ]}
        >
          <Upload.Dragger
            className="!border-dashed !border-gray-300 rounded-lg p-6 hover:!border-blue"
            multiple={false}
            beforeUpload={() => false}
            showUploadList={false}
            accept=".xlsx,.xls,.csv"
          >
            <p className="ant-upload-drag-icon">
              <MdOutlineCloudUpload style={{ fontSize: 32, color: "#1890ff" }} />
            </p>
            <p className="text-textheading mb-0 font-medium text-lg">
              Choose a file or drag & drop it here
            </p>
            <p className="text-lighttext text-sm">Excel or CSV formats, up to 5MB</p>
            <Button className="mt-3 font-medium text-textheading">Browse File</Button>
          </Upload.Dragger>
        </Modal>
      </div>
    </>
  );
};

export default BankListPage;
