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
import AnimalDetailsModal, { AnimalDetails } from "./AnimalDetailsModal";
import { HiEye } from "react-icons/hi";

type Row = {
  key: number;
  memberAadhar: string;
  totalAnimal: number;
  date: string; // ISO for filtering
  details?: AnimalDetails; // pass-through for modal
};

const { RangePicker } = DatePicker;

const AnimalReport: React.FC = () => {
  // ------- sample data (replace with API later) -------
  const rows: Row[] = useMemo(
    () => [
      {
        key: 1,
        memberAadhar: "201748863547",
        totalAnimal: 2,
        date: "2025-08-01",
        details: {
          aadharNumber: "68768768867",
          regDate: "23-09-2025",
          animalType: "Cow",
          breed: "GIR",
          age: "34",
          category: "In Milk",
          milkProduction: "8",
          lactationCount: "1",
          pregnantStatus: "No",
          tagNumber: "0",
          virtualTag: "7898-A8765-3",
          photos: [
            "https://images.unsplash.com/photo-1546443046-ed1ce6ffd1ab?w=640",
            "https://images.unsplash.com/photo-1496318447583-f524534e9ce1?w=640",
          ],
        },
      },
      { key: 2, memberAadhar: "201748863547", totalAnimal: 4, date: "2025-08-05" },
      { key: 3, memberAadhar: "201748863547", totalAnimal: 1, date: "2025-08-08" },
      { key: 4, memberAadhar: "201748863547", totalAnimal: 2, date: "2025-08-12" },
      { key: 5, memberAadhar: "201748863547", totalAnimal: 3, date: "2025-08-18" },
      { key: 6, memberAadhar: "201748863547", totalAnimal: 4, date: "2025-08-20" },
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

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<AnimalDetails | null>(null);

  // ------- columns -------
  const columns = [
    {
      title: <span className="text-black font-semibold">S.no</span>,
      dataIndex: "serial",
      key: "serial",
      render: (_: any, __: Row, index: number) => (
        <span className="text-gray-700 font-medium">
          {(currentPage - 1) * pageSize + index + 1}
        </span>
      ),
    },
    {
      title: <span className="text-black font-semibold">Member Aadhar</span>,
      dataIndex: "memberAadhar",
      key: "memberAadhar",
      render: (text: any) => <span className="text-gray-700 font-medium">{text}</span>,
    },
    {
      title: <span className="text-black font-semibold">Total Animal</span>,
      dataIndex: "totalAnimal",
      key: "totalAnimal",
      render: (text: any) => <span className="text-gray-700 font-medium">{text}</span>,
    },
    {
      title: <span className="text-black font-semibold">Action</span>,
      key: "action",
      align: "right" as const,
      render: (_: any, record: Row) => (
        <Button
          className="bg-blue text-white rounded-full"
          onClick={() => {
            setSelected(
              record.details || {
                aadharNumber: record.memberAadhar,
                regDate: "",
                animalType: "",
                breed: "",
                age: "",
                category: "",
                milkProduction: "",
                lactationCount: "",
                pregnantStatus: "",
                tagNumber: "",
                virtualTag: "",
                photos: [],
              }
            );
            setShowModal(true);
          }}
        >
            <HiEye className="text-[20px]"/>

          View
        </Button>
      ),
    },
  ];

  // ------- derive filtered data -------
  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchesSearch =
        !search || r.memberAadhar.toLowerCase().includes(search.toLowerCase());
      const matchesMcc = !mcc || mcc === "Test";
      const matchesMpp = !mpp || mpp === "Test";
      const matchesDate =
        !range ||
        (!range[0] && !range[1]) ||
        (dayjs(r.date).isSameOrAfter(range[0]!, "day") &&
          dayjs(r.date).isSameOrBefore(range[1]!, "day"));
      return matchesSearch && matchesMcc && matchesMpp && matchesDate;
    });
  }, [rows, search, mcc, mpp, range]);

  const dataForTable = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  // ------- actions -------
  const handleDownloadTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet([], {
      header: ["Member Aadhar", "Total Animal"],
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AnimalReport");
    XLSX.writeFile(workbook, "AnimalReport_Template.xlsx");
  };

  const handleExportData = () => {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "AnimalReport");
    XLSX.writeFile(wb, "AnimalReport.xlsx");
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

  return (
    <>
      <BradCrumb />

      <div className="p-4 bg-white rounded-xl shadow">
        {/* Header */}
        <div className="flex justify-between">
          <div>
            <h2 className="text-base font-semibold text-black">Animal Report</h2>
            <p className="text-sm text-gray-500">
              Lorem ipsum dolor sit amet, consectetur adipis.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 justify-end">
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
            <Button className="!border-blue !text-blue" icon={<DatabaseOutlined />}>
              Excel
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-end mb-3 items-center gap-2 mt-3">
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
            placeholder={["From Date(dd/mm/yy)", "To Date(dd/mm/yy)"]}
            value={range as any}
            onChange={(vals) => setRange(vals as any)}
            format="DD/MM/YY"
            style={{ width: 260 }}
            allowEmpty={[true, true]}
          />
          <Select
            placeholder="From Old Members"
            style={{ width: 180 }}
            allowClear
            options={[{ value: "yes", label: "Yes" }]}
          />
          <Button type="primary" icon={<FilterOutlined />} onClick={() => setCurrentPage(1)}>
            Filter
          </Button>
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
            showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
          }}
        />
      </div>

      {/* Modal */}
      <AnimalDetailsModal
        open={showModal}
        data={selected}
        onCancel={() => setShowModal(false)}
        onAssign={() => {
          // handle assign action here
          setShowModal(false);
        }}
      />
    </>
  );
};

export default AnimalReport;
