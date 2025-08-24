import React, { useMemo, useState } from "react";
import {
  Table,
  Input,
  Button,
  DatePicker,
  Select,
  Space,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import { Printer } from "lucide-react";
import BradCrumb from "../BreadCrumb";
import dayjs, { Dayjs } from "dayjs";
import { LuFilter } from "react-icons/lu";

type Row = {
  id: number;
  formNumber: string;
  applicationName: string;
  memberCode?: string; // undefined => "Not Found"
  folioNumber?: string; // undefined => "Not Found"
};

const MCC_OPTIONS = [
  { label: "MCC", value: "" },
  { label: "MCC-001", value: "MCC-001" },
  { label: "MCC-002", value: "MCC-002" },
];
const MPP_OPTIONS = [
  { label: "MPP", value: "" },
  { label: "MPP-101", value: "MPP-101" },
  { label: "MPP-102", value: "MPP-102" },
];

const NotFoundPill = () => (
  <span className="inline-flex items-center rounded-full px-4 py-1 text-sm font-medium bg-red  text-white 
  ">
    Not Found
  </span>
);

const MemberCodePill = ({ code }: { code: string }) => (
  <button className="inline-flex items-center  rounded-full px-3 py-1 text-sm font-medium !border
   !border-blue text-blue bg-white">
    {code}
  </button>
);

const FormListPage: React.FC = () => {
  // ------- mock data -------
  const [rows] = useState<Row[]>([
    { id: 7628, formNumber: "G7405", applicationName: "Test", memberCode: undefined, folioNumber: undefined },
    { id: 7628, formNumber: "G7405", applicationName: "Test", memberCode: "1100100100101000", folioNumber: undefined },
    { id: 7628, formNumber: "G7405", applicationName: "Test", memberCode: "1100100100101000", folioNumber: undefined },
    { id: 7628, formNumber: "G7405", applicationName: "Test", memberCode: "1100100100101000", folioNumber: undefined },
    { id: 7628, formNumber: "G7405", applicationName: "Test", memberCode: "1100100100101000", folioNumber: undefined },
  ]);

  // ------- filters / search -------
  const [search, setSearch] = useState("");
  const [mcc, setMcc] = useState<string | undefined>("");
  const [mpp, setMpp] = useState<string | undefined>("");
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);
  const [memberOrFolio, setMemberOrFolio] = useState("");

  const filtered = useMemo(() => {
    // For demo: only the free-text search and member/folio input filter the mock list.
    const q = search.trim().toLowerCase();
    const mf = memberOrFolio.trim();
    return rows.filter((r) => {
      const matchesSearch =
        !q ||
        r.formNumber.toLowerCase().includes(q) ||
        r.applicationName.toLowerCase().includes(q) ||
        String(r.id).includes(q);
      const matchesMemberFolio =
        !mf ||
        r.memberCode?.includes(mf) ||
        r.folioNumber?.includes(mf);
      // in real app, also apply MCC/MPP/from/to filters
      return matchesSearch && matchesMemberFolio;
    });
  }, [rows, search, memberOrFolio]);

  // ------- columns -------
  const columns: ColumnsType<Row> = [
    { title: "ID", dataIndex: "id", key: "id", width: 90 },
    { title: "Form Number", dataIndex: "formNumber", key: "formNumber", width: 140,
      render: (t: string) => <span className="text-textheading font-medium">{t}</span> },
    { title: "Application Name", dataIndex: "applicationName", key: "applicationName",
      render: (t: string) => <span className="text-textheading font-medium">{t}</span> },
    {
      title: "Member Code",
      dataIndex: "memberCode",
      key: "memberCode",
      width: 220,
      render: (v?: string) => (v ? <MemberCodePill code={v} /> : <NotFoundPill />),
    },
    {
      title: "Folio Number",
      dataIndex: "folioNumber",
      key: "folioNumber",
      width: 180,
      render: (v?: string) =>
        v ? <span className="text-textheading">{v}</span> : <NotFoundPill />,
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_, record) => (
        <button
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium 
          bg-lightorange text-white border-none "
          onClick={() => {
            // hook your printer here
            message.success(`Printing form ${record.formNumber}`);
            window.print?.();
          }}
        >
          <Printer size={16} /> Print
        </button>
      ),
    },
  ];

  return (
    <>
      <BradCrumb />
      <div className="p-4 bg-white rounded-lg shadow">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <div>
            <h2 className="text-lg font-semibold">Form List</h2>
            <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet, consectetur adipis.</p>
          </div>
          <Space wrap>
            <Input
              placeholder="Type to search"
              prefix={<SearchOutlined />}
              style={{ width: 260 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Button
              className="bg-white border-blue text-blue hover:!text-blue"
              onClick={() => {
                message.info("Printing all forms");
                window.print?.();
              }}
            >
              Print All Forms
            </Button>

          </Space>
        </div>

        {/* Filters row (matches screenshot layout) */}
        <div className="flex flex-wrap justify-end items-center gap-2 mb-4">
          <Select
            value={mcc}
            onChange={setMcc}
            options={MCC_OPTIONS}
            style={{ width: 110 }}
          />
          <Select
            value={mpp}
            onChange={setMpp}
            options={MPP_OPTIONS}
            style={{ width: 110 }}
          />
          <DatePicker
            placeholder="From Date(dd/mm/yy)"
            value={fromDate}
            onChange={setFromDate}
            format={(v) => dayjs(v).format("DD/MM/YY")}
            style={{ width: 190 }}
          />
          <DatePicker
            placeholder="To Date(dd/mm/yy)"
            value={toDate}
            onChange={setToDate}
            format={(v) => dayjs(v).format("DD/MM/YY")}
            style={{ width: 190 }}
          />
          <Input
            placeholder="MemberCode & FolioNo"
            value={memberOrFolio}
            onChange={(e) => setMemberOrFolio(e.target.value)}
            style={{ width: 220 }}
          />
                      <Button
                      className="flex  bg-blue items-center justify-center"
              type="primary"
              onClick={() => message.success("Filters applied")}
            >
            <LuFilter className="text-[18px]"/>

              Filter
            </Button>

        </div>

        {/* Table */}
        <Table<Row>
          rowKey={(r) => `${r.id}-${Math.random()}`}
          bordered
          dataSource={filtered}
          columns={columns}
          pagination={{ pageSize: 5 }}
        />

        {/* Footer showing entries (static like the screenshot) */}
        <div className="text-sm text-gray-500 mt-2">Showing <b>1</b> to <b>5</b> of <b>5</b> entries</div>
      </div>
    </>
  );
};

export default FormListPage;
