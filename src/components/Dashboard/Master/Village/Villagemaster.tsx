import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../../store/store";
import type { RootStateWithVillages, VillageRow } from "./types";
import { fetchVillagesThunk } from "./thunk";
import {
  setVillagesPage,
  setVillagesLimit,
  setVillagesSearch,
  setVillageFilters,
} from "./slice";

import { Table, Input, Button, Modal, Upload, Pagination, Select, Space, Typography } from "antd";
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
  const { items, loading, page, limit, total, search, district_code, tehsil_code } =
    useSelector((s: RootStateWithVillages) => s.villages);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(search ?? "");

  useEffect(() => {
    dispatch(fetchVillagesThunk());
  }, [dispatch, page, limit, search, district_code, tehsil_code]);

  const columns = useMemo(
    () => [
      {
        title: <span className="text-lighttext font-semibold">S.N.</span>,
        key: "sn",
        width: 80,
        render: (_: any, __: VillageRow, idx: number) => (page - 1) * limit + idx + 1,
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
            {r.tehsil_name} <Text type="secondary">({(r.tehsil_code as any)?.trim?.() ?? r.tehsil_code})</Text>
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
        render: (v: string) => <Text type="secondary">{v ? new Date(v).toLocaleString() : "-"}</Text>,
      },
    ],
    [page, limit]
  );

  // Template
  const handleDownloadTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet([], {
      header: [
        "state_name","state_code",
        "district_name","district_code",
        "tehsil_name","tehsil_code",
        "village_name","village_code",
        "hamlet_name","hamlet_code",
        "mcc_name","mcc_code",
        "mpp_name","mpp_code",
        "status"
      ],
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "VillageMaster");
    XLSX.writeFile(workbook, "VillageMaster_Template.xlsx");
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(items);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MasterData");
    XLSX.writeFile(wb, `MasterData_p${page}_l${limit}.xlsx`);
  };

  const onSearchApply = () => dispatch(setVillagesSearch(localSearch.trim()));
  const onPageChange = (newPage: number, newPageSize?: number) => {
    if (newPageSize && newPageSize !== limit) dispatch(setVillagesLimit(newPageSize));
    if (newPage !== page) dispatch(setVillagesPage(newPage));
  };
  const onFilterChange = (next: { district_code?: string; tehsil_code?: string }) =>
    dispatch(setVillageFilters(next));

  return (
    <>
      <BradCrumb />

      <div className="p-4 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <div>
            <Title level={4} className="!mb-0">Village Master</Title>
            <p className="text-sm text-gray-500">Browse and manage village/hamlet master data.</p>
          </div>

          <Space wrap>
            <Input
              allowClear
              placeholder="Search village / hamlet / MCC / MPP"
              prefix={<SearchOutlined />}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onPressEnter={onSearchApply}
              style={{ width: 300 }}
            />
            <Button onClick={onSearchApply}>Search</Button>

            <Select
              allowClear
              placeholder="District Code"
              value={district_code}
              onChange={(v) => onFilterChange({ district_code: v, tehsil_code })}
              style={{ width: 170 }}
              options={[
                { value: "213", label: "213 (Madhepura)" },
                { value: "223", label: "223 (Khagaria)" },
                { value: "226", label: "226 (Munger)" },
                { value: "214", label: "214 (Saharsa)" },
                { value: "208", label: "208 (Supaul)" },
              ]}
            />
            <Select
              allowClear
              placeholder="Tehsil Code"
              value={tehsil_code}
              onChange={(v) => onFilterChange({ district_code, tehsil_code: v })}
              style={{ width: 170 }}
              options={[
                { value: "01158", label: "01158 (Gamharia)" },
                { value: "01325", label: "01325 (Chautham)" },
                { value: "01360", label: "01360 (Kharagpur)" },
                { value: "01175", label: "01175 (Saur Bazar)" },
                { value: "01169", label: "01169 (Alamnagar)" },
                { value: "01322", label: "01322 (Alauli)" },
                { value: "01109", label: "01109 (Supaul)" },
                { value: "01174", label: "01174 (Kahara)" },
              ]}
            />

            <Button onClick={handleDownloadTemplate}>
              <MdOutlineFileDownload style={{ fontSize: 18, marginRight: 6 }} />
              Download Format
            </Button>
            <Button onClick={() => setIsModalOpen(true)}>Import</Button>
            <Button onClick={handleExport}>Export</Button>
          </Space>
        </div>

        <Table<VillageRow>
          bordered
          rowKey={(r) => r.id}
          dataSource={items}
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

        <Modal
          title="Import Village Master"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsModalOpen(false)}>Cancel</Button>,
            <Button key="import" type="primary" onClick={() => setIsModalOpen(false)}>Import</Button>,
          ]}
        >
          <div className="rounded-lg">
            <Upload.Dragger
              multiple={false}
              beforeUpload={() => false}
              showUploadList={false}
              accept=".xlsx,.xls,.csv"
            >
              <p className="ant-upload-drag-icon">
                <MdOutlineCloudUpload style={{ fontSize: 32 }} />
              </p>
              <p className="text-textheading mb-0 font-medium text-lg">Choose a file or drag & drop it here</p>
              <p className="text-lighttext text-md">XLSX, XLS, or CSV, up to 10MB</p>
              <Button className="mt-2 font-medium text-textheading">Browse File</Button>
            </Upload.Dragger>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default VillageIndexPage;
