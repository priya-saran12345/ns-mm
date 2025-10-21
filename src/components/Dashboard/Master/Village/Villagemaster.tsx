import React, { useEffect, useMemo, useState } from "react";
import {  useSelector } from "react-redux";
import { useAppDispatch } from "../../../../store/store";
import type { RootStateWithVillages, Village } from "./types";
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

const VillageIndexPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading, page, limit, total, search, district_code, tehsil_code } =
    useSelector((s: RootStateWithVillages) => s.villages);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(search ?? "");

  // Fetch on mount & whenever paging/filtering changes
  useEffect(() => {
    dispatch(fetchVillagesThunk());
  }, [dispatch, page, limit, search, district_code, tehsil_code]);

  // Columns
  const columns = useMemo(
    () => [
      {
        title: <span className="text-lighttext font-semibold">S.N.</span>,
        dataIndex: "sn",
        key: "sn",
        width: 80,
        render: (_: any, __: Village, idx: number) => (page - 1) * limit + idx + 1,
      },
      {
        title: <span className="text-lighttext font-semibold">Village Code</span>,
        dataIndex: "village_code",
        key: "village_code",
        render: (text: string) => <span className="text-textheading font-medium">{text}</span>,
      },
      {
        title: <span className="text-lighttext font-semibold">Village Name</span>,
        dataIndex: "village_name",
        key: "village_name",
        render: (text: string) => <span className="text-textheading font-medium">{text}</span>,
      },
      {
        title: <span className="text-lighttext font-semibold">District</span>,
        key: "district",
        render: (_: any, row: Village) => (
          <span className="text-textheading font-medium">
            {row.district_name} <Text type="secondary">({row.district_code})</Text>
          </span>
        ),
      },
      {
        title: <span className="text-lighttext font-semibold">Tehsil</span>,
        key: "tehsil",
        render: (_: any, row: Village) => (
          <span className="text-textheading font-medium">
            {row.tehsil_name} <Text type="secondary">({row.tehsil_code.trim?.() ?? row.tehsil_code})</Text>
          </span>
        ),
      },
    ],
    [page, limit]
  );

  // Excel Template Download
  const handleDownloadTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet([], {
      header: ["village_code", "village_name", "district_code", "district_name", "tehsil_code", "tehsil_name"],
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "VillageMaster");
    XLSX.writeFile(workbook, "VillageMaster_Template.xlsx");
  };

  // Export current table view (simple)
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(items);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Villages");
    XLSX.writeFile(wb, `Villages_p${page}_l${limit}.xlsx`);
  };

  const onSearchApply = () => {
    dispatch(setVillagesSearch(localSearch.trim()));
  };

  const onPageChange = (newPage: number, newPageSize?: number) => {
    if (newPageSize && newPageSize !== limit) dispatch(setVillagesLimit(newPageSize));
    if (newPage !== page) dispatch(setVillagesPage(newPage));
  };

  const onFilterChange = (next: { district_code?: string; tehsil_code?: string }) => {
    dispatch(setVillageFilters(next));
  };

  return (
    <>
      <BradCrumb />

      <div className="p-4 bg-white rounded-lg shadow">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <Title level={4} className="!mb-0">Village Master</Title>
            <p className="text-sm text-gray-500">Browse and manage villages from master-data service.</p>
          </div>

          <Space wrap>
            <Input
              allowClear
              placeholder="Search village..."
              prefix={<SearchOutlined />}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onPressEnter={onSearchApply}
              style={{ width: 260 }}
            />
            <Button onClick={onSearchApply}>Search</Button>

            {/* Optional: Quick filters if backend supports them */}
            <Select
              allowClear
              placeholder="District Code"
              value={district_code}
              onChange={(v) => onFilterChange({ district_code: v, tehsil_code })}
              style={{ width: 160 }}
              options={[
                // Put real options if you load them; placeholder examples:
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
              style={{ width: 160 }}
              options={[
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

        {/* Table */}
        <Table<Village>
          bordered
          rowKey={(r) => `${r.village_code}-${r.tehsil_code}`}
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

        {/* Import Modal */}
        <Modal
          title="Import Village Master"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>,
            <Button key="import" type="primary" onClick={() => setIsModalOpen(false)}>
              Import
            </Button>,
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
              <p className="text-textheading mb-0 font-medium text-lg">
                Choose a file or drag & drop it here
              </p>
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
