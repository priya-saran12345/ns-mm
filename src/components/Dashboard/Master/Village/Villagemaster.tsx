import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../../store/store";
import type { RootStateWithVillages, VillageRow } from "./types";
import {
  fetchVillagesThunk,
  importMasterDataThunk,
  exportMasterDataThunk, // server export
} from "./thunk";
import {
  setVillagesPage,
  setVillagesLimit,
  setVillagesSearch,
} from "./slice";

import {
  Table,
  Input,
  Button,
  Modal,
  Upload,
  Pagination,
  Space,
  Typography,
  message,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { MdOutlineCloudUpload, MdOutlineFileDownload } from "react-icons/md";
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

const VillageIndexPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    items,
    loading,
    page,
    limit,
    total,
    search,
    district_code,
    tehsil_code,
    importing,
    importResult,
    exporting, // show spinner on export
  } = useSelector((s: RootStateWithVillages) => s.villages);

  // local UI state
  const [localSearch, setLocalSearch] = useState(search ?? "");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Import (XLS only)
  const [importFile, setImportFile] = useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchVillagesThunk());
  }, [dispatch, page, limit, search, district_code, tehsil_code]);

  // Debounced "search on type"
  useEffect(() => {
    const t = setTimeout(() => {
      dispatch(setVillagesSearch(localSearch.trim()));
    }, 400);
    return () => clearTimeout(t);
  }, [localSearch, dispatch]);

  // Client-side matcher for code + name (all key entities)
  const filteredItems = useMemo(() => {
    const q = localSearch.trim().toLowerCase();
    if (!q) return items;

    const hits = (r: VillageRow) => {
      const fields = [
        r.state_name,
        r.state_code,
        r.district_name,
        r.district_code,
        r.tehsil_name,
        (r.tehsil_code as any)?.toString?.(),
        r.village_name,
        r.village_code,
        r.hamlet_name,
        r.hamlet_code,
        r.mcc_name,
        r.mcc_code,
        r.mpp_name,
        r.mpp_code,
      ]
        .filter(Boolean)
        .map((x) => String(x).toLowerCase());

      return fields.some((f) => f.includes(q));
    };

    return items.filter(hits);
  }, [items, localSearch]);

  const columns = useMemo(
    () => [
      {
        title: <span className="text-lighttext font-semibold">S.N.</span>,
        key: "sn",
        width: 80,
        render: (_: any, __: VillageRow, idx: number) =>
          (page - 1) * limit + idx + 1,
      },
      {
        title: <span className="text-lighttext font-semibold">State</span>,
        key: "state",
        render: (_: any, r: VillageRow) => (
          <span className="text-textheading font-medium">
            {r.state_name} <Text type="secondary">({r.state_code})</Text>
          </span>
        ),
      },
      {
        title: <span className="text-lighttext font-semibold">District</span>,
        key: "district",
        render: (_: any, r: VillageRow) => (
          <span className="text-textheading font-medium">
            {r.district_name} <Text type="secondary">({r.district_code})</Text>
          </span>
        ),
      },
      {
        title: <span className="text-lighttext font-semibold">Tehsil</span>,
        key: "tehsil",
        render: (_: any, r: VillageRow) => (
          <span className="text-textheading font-medium">
            {r.tehsil_name}{" "}
            <Text type="secondary">
              {(r.tehsil_code as any)?.trim?.() ?? r.tehsil_code}
            </Text>
          </span>
        ),
      },
      {
        title: <span className="text-lighttext font-semibold">Village</span>,
        key: "village",
        render: (_: any, r: VillageRow) => (
          <span className="text-textheading font-medium">
            {r.village_name} <Text type="secondary">({r.village_code})</Text>
          </span>
        ),
      },
      {
        title: <span className="text-lighttext font-semibold">Hamlet</span>,
        key: "hamlet",
        render: (_: any, r: VillageRow) => (
          <span className="text-textheading font-medium">
            {r.hamlet_name} <Text type="secondary">({r.hamlet_code})</Text>
          </span>
        ),
      },
      {
        title: <span className="text-lighttext font-semibold">MCC</span>,
        key: "mcc",
        render: (_: any, r: VillageRow) => (
          <span className="text-textheading font-medium">
            {r.mcc_name} <Text type="secondary">({r.mcc_code})</Text>
          </span>
        ),
      },
      {
        title: <span className="text-lighttext font-semibold">MPP</span>,
        key: "mpp",
        render: (_: any, r: VillageRow) => (
          <span className="text-textheading font-medium">
            {r.mpp_name} <Text type="secondary">({r.mpp_code})</Text>
          </span>
        ),
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
    ],
    [page, limit]
  );

  // ===== Download Import Format (client) — XLS =====
  const handleDownloadTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      [],
      {
        header: [
          "state_name",
          "state_code",
          "district_name",
          "district_code",
          "tehsil_name",
          "tehsil_code",
          "village_name",
          "village_code",
          "hamlet_name",
          "hamlet_code",
          "mcc_name",
          "mcc_code",
          "mpp_name",
          "mpp_code",
          "status",
        ],
      }
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "VillageMaster");
    // 👇 write .xls
    XLSX.writeFile(workbook, "VillageMaster_Template.xls", { bookType: "xls" });
  };

  // ===== Export via API — XLS =====
  const handleServerExport = async () => {
    try {
      const { blob, filename } = await dispatch(
        exportMasterDataThunk({
          type: "xls",
          // If your API supports these, uncomment to pass filters/search:
          // search,
          // district_code,
          // tehsil_code,
        })
      ).unwrap();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || "VillageMaster_Export.xls";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      message.error(typeof e === "string" ? e : "Export failed");
    }
  };

  // ===== Import (XLS only) =====
  const handleImport = async () => {
    if (!importFile) {
      message.warning("Please choose an Excel (.xls) file to import.");
      return;
    }
    if (!importFile.name.toLowerCase().endsWith(".xls")) {
      message.error("Only .xls files are allowed.");
      return;
    }
    try {
      const res = await dispatch(
        importMasterDataThunk({ type: "xls", file: importFile })
      ).unwrap();
      message.success(
        `Imported: ${res.inserted} inserted, ${res.updated} updated, ${res.failed} failed`
      );
      setIsModalOpen(false);
      setImportFile(null);
      dispatch(fetchVillagesThunk()); // refresh
    } catch (e: any) {
      message.error(typeof e === "string" ? e : "Import failed");
    }
  };

  const onPageChange = (newPage: number, newPageSize?: number) => {
    if (newPageSize && newPageSize !== limit) dispatch(setVillagesLimit(newPageSize));
    if (newPage !== page) dispatch(setVillagesPage(newPage));
  };

  return (
    <>
      <BradCrumb />

      <div className="p-4 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center ">
          <div>
            <Title level={4} className="!mb-0">
              Village Master
            </Title>
            <p className="text-sm text-gray-500">
              Browse and manage village/hamlet master data.
            </p>
          </div>

          <Space wrap>
            {/* Download Import Format (XLS) */}
            <Button onClick={handleDownloadTemplate}>
              <MdOutlineFileDownload style={{ fontSize: 18, marginRight: 6 }} />
              Download Format
            </Button>

            {/* Import */}
            <Button onClick={() => setIsModalOpen(true)}>Import</Button>

            {/* Export via API (XLS) */}
            <Button type="primary" loading={exporting} onClick={handleServerExport}>
              Export
            </Button>
          </Space>
        </div>

        <div className="mb-4 flex justify-end">
          <Input
            allowClear
            placeholder="Type to search (code or name)…"
            prefix={<SearchOutlined />}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            style={{ width: 300 }}
          />
        </div>

        <Table<VillageRow>
          bordered
          rowKey={(r) => r.id}
          dataSource={filteredItems}
          columns={columns as any}
          loading={loading}
          pagination={false}
        />

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

        {/* Import Modal */}
        <Modal
          title="Import Village Master (Excel .xls)"
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            setImportFile(null);
          }}
          footer={[
            <Button key="cancel" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>,
            <Button
              key="import"
              type="primary"
              loading={importing}
              onClick={handleImport}
            >
              Import
            </Button>,
          ]}
        >
          {/* XLS only */}
          <div className="rounded-lg">
            <Upload.Dragger
              multiple={false}
              beforeUpload={(file) => {
                setImportFile(file);
                return false; // prevent auto upload
              }}
              fileList={
                importFile ? ([{ uid: "1", name: importFile.name }] as any) : []
              }
              onRemove={() => setImportFile(null)}
              showUploadList
              accept=".xls"
            >
              <p className="ant-upload-drag-icon">
                <MdOutlineCloudUpload style={{ fontSize: 32 }} />
              </p>
              <p className="text-textheading mb-0 font-medium text-lg">
                Choose an Excel (.xls) file or drag & drop it here
              </p>
              <p className="text-lighttext text-md">Only .xls, up to 10MB</p>
              <Button className="mt-2 font-medium text-textheading">
                Browse File
              </Button>
            </Upload.Dragger>
          </div>

          {importResult && (
            <div className="mt-4 text-sm text-gray-600">
              <strong>Last Result:</strong>{" "}
              Inserted {importResult.inserted}, Updated {importResult.updated},
              Failed {importResult.failed}
            </div>
          )}
        </Modal>
      </div>
    </>
  );
};

export default VillageIndexPage;
