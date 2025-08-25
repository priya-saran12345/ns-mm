import React, { useMemo, useState } from "react";
import {
  Table,
  Input,
  Button,
  Select,
  DatePicker,
  Dropdown,
  Space,
  type MenuProps,
} from "antd";
import {
  SearchOutlined,
  DownOutlined,
  CloudDownloadOutlined,
  FilterOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import dayjs, { Dayjs } from "dayjs";
import BradCrumb from "../BreadCrumb";

type Row = {
  key: number;
  formNumber: string;
  facilitator: string;
  mcc: string;
  mpp: string;
  prbStatus: string;
  finStatus: string;
  finalStatus: string;
  date: string; // ISO string for quick filtering
};

const { RangePicker } = DatePicker;

const MasterData: React.FC = () => {
  // ------- sample data (replace with API later) -------
  const rows: Row[] = useMemo(
    () => [
      { key: 1, formNumber: "G7405", facilitator: "G7405", mcc: "Test", mpp: "Test", prbStatus: "7628", finStatus: "7628", finalStatus: "7628", date: "2025-08-01" },
      { key: 2, formNumber: "G7405", facilitator: "G7405", mcc: "Test", mpp: "Test", prbStatus: "7628", finStatus: "7628", finalStatus: "7628", date: "2025-08-05" },
      { key: 3, formNumber: "G7405", facilitator: "G7405", mcc: "Test", mpp: "Test", prbStatus: "7628", finStatus: "7628", finalStatus: "7628", date: "2025-08-08" },
      { key: 4, formNumber: "G7405", facilitator: "G7405", mcc: "Test", mpp: "Test", prbStatus: "7628", finStatus: "7628", finalStatus: "7628", date: "2025-08-12" },
      { key: 5, formNumber: "G7405", facilitator: "G7405", mcc: "Test", mpp: "Test", prbStatus: "7628", finStatus: "7628", finalStatus: "7628", date: "2025-08-18" },
    ],
    []
  );

  // ------- filters / UI state -------
  const [search, setSearch] = useState<string>("");
  const [mcc, setMcc] = useState<string | undefined>(undefined);
  const [mpp, setMpp] = useState<string | undefined>(undefined);
  const [range, setRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const [pageSize, setPageSize] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // ------- columns -------
  const columns = [
    { title: <span className="text-lighttext font-semibold">Form Number</span>,
      dataIndex: "formNumber",
      key: "formNumber" , 
         render: (text: any) => (
      <span className="text-textheading font-medium">{text}</span>
    ),
},
    { title: <span className="text-lighttext font-semibold">Facilitator</span>, dataIndex: "facilitator", key: "facilitator",    render: (text: any) => (
      <span className="text-textheading font-medium">{text}</span>
    ),
 },
    { title: <span className="text-lighttext font-semibold">MCC</span>, dataIndex: "mcc", key: "mcc",    render: (text: any) => (
      <span className="text-textheading font-medium">{text}</span>
    ),
 },
    { title: <span className="text-lighttext font-semibold">MPP</span>, dataIndex: "mpp", key: "mpp",    render: (text: any) => (
      <span className="text-textheading font-medium">{text}</span>
    ),
 },
    { title: <span className="text-lighttext font-semibold">PRB Officer Status</span>, dataIndex: "prbStatus", key: "prbStatus" ,    render: (text: any) => (
      <span className="text-textheading font-medium">{text}</span>
    ),
},
    { title: <span className="text-lighttext font-semibold">Finance Officer Status</span>, dataIndex: "finStatus", key: "finStatus",    render: (text: any) => (
      <span className="text-textheading font-medium">{text}</span>
    ),
 },
    { title: <span className="text-lighttext font-semibold">Final Approval Status</span>, dataIndex: "finalStatus", key: "finalStatus",    render: (text: any) => (
      <span className="text-textheading font-medium">{text}</span>
    ),
 },
  ];

  // ------- derive filtered data -------
  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchesSearch =
        !search ||
        r.formNumber.toLowerCase().includes(search.toLowerCase()) ||
        r.facilitator.toLowerCase().includes(search.toLowerCase());

      const matchesMcc = !mcc || r.mcc === mcc;
      const matchesMpp = !mpp || r.mpp === mpp;

      const matchesDate =
        !range ||
        (!range[0] && !range[1]) ||
        (dayjs(r.date).isSameOrAfter(range[0]!, "day") &&
          dayjs(r.date).isSameOrBefore(range[1]!, "day"));
      return matchesSearch && matchesMcc && matchesMpp && matchesDate;
    });
  }, [rows, search, mcc, mpp, range]);

  // keep pagination sensible when filters change
  const dataForTable = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  // ------- actions -------
  const handleDownloadTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet([], {
      header: [
        "Form Number",
        "Facilitator",
        "MCC",
        "MPP",
        "PRB Officer Status",
        "Finance Officer Status",
        "Final Approval Status",
      ],
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, "Report_Download_Template.xlsx");
  };

  const handleExportData = () => {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, "Report_Export.xlsx");
  };

  const downloadMenu: MenuProps["items"] = [
    {
      key: "template",
      label: "Download Format",
      icon: <CloudDownloadOutlined />,
      onClick: handleDownloadTemplate,
    },
    {
      key: "export",
      label: "Export Data",
      icon: <CloudDownloadOutlined />,
      onClick: handleExportData,
    },
  ];

  const handleFilterClick = () => {
    // No server call needed; filters are client-side.
    // Kept for parity with the UI ("Filter" button).
    setCurrentPage(1);
  };

  return (
    <>
      <BradCrumb />

      <div className="p-4 bg-white rounded-xl shadow">
        {/* Header */}
        <div className="flex justify-between ">

        <div className="">
          <h2 className="text-lg font-semibold">Report</h2>
          <p className="text-sm text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipis.
          </p>
        </div>
                    <div className="flex flex-wrap items-center gap-2 justify-end ">

          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Type to search"
            style={{ width: 320 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />
            <Dropdown menu={{ items: downloadMenu }}>
              <Button type="primary">
                <Space>
                  Select Download Mode
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
             <Button className="!border-blue !text-blue" icon={<DatabaseOutlined />} >
              SAP Data
            </Button>

            </div>

        </div>


        {/* Controls row */}
        <div className="">

          <div className="flex flex-wrap justify-end mb-3 items-center gap-2">
            <Select
              placeholder="MCC"
              style={{ width: 120 }}
              value={mcc}
              onChange={setMcc}
              allowClear
              options={[{ value: "Test", label: "Test" }]}
            />
            <Select
              placeholder="MPP"
              style={{ width: 120 }}
              value={mpp}
              onChange={setMpp}
              allowClear
              options={[{ value: "Test", label: "Test" }]}
            />

            <RangePicker
              placeholder={["From (dd/mm/yy)", "To (dd/mm/yy)"]}
              value={range as any}
              onChange={(vals) => setRange(vals as any)}
              format="DD/MM/YY"
              style={{ width: 260 }}
              allowEmpty={[true, true]}
            />



            <Button type="primary" icon={<FilterOutlined />} onClick={handleFilterClick}>
              Filter
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table<Row>
          rowKey="key"
          bordered
          columns={columns}
          dataSource={dataForTable}
          pagination={{
            current: currentPage,
            pageSize,
            total: filtered.length,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size || 5);
            },
            showSizeChanger: false,
            showTotal: (total, range) =>
              `Showing ${range[0]} to ${range[1]} of ${total} entries`,
          }}
        />
      </div>
    </>
  );
};

export default MasterData;
