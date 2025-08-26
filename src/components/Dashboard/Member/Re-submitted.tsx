import { useMemo, useState } from "react";
import {
  Table,
  Input,
  Button,
  Modal,
  Select,
  DatePicker,
  Space,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { HiEye } from "react-icons/hi";
import BradCrumb from "../BreadCrumb";
import { useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;

type MemberRow = {
  key: number;
  id: string | number;
  formNumber: string;
  applicationName: string;
  status: "Pending" | "Approved" | "Rejected";
};

const statusChip = (status: MemberRow["status"]) => {
  let bg = "", fg = "", dot = "";
  switch (status) {
    case "Approved":
      bg = "bg-[#DCFCE7]"; fg = "text-[#14532D]"; dot = "bg-[#22C55E]"; break;
    case "Rejected":
      bg = "bg-[#FEE2E2]"; fg = "text-[#7F1D1D]"; dot = "bg-[#EF4444]"; break;
    default:
      bg = "bg-[#FEF9C3]"; fg = "text-[#713F12]"; dot = "bg-[#FACC15]";
  }
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${bg} ${fg}`}>
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {status}
    </span>
  );
};

const ApprovedMemberList = () => {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewRecord, setViewRecord] = useState<MemberRow | null>(null);
const navigate = useNavigate();

  // Filters (mock)
  const [search, setSearch] = useState("");
  const [mcc, setMcc] = useState<string | undefined>();
  const [mpp, setMpp] = useState<string | undefined>();
  const [dates, setDates] = useState<[any, any] | null>(null);

  // Sample data (shape & values to mirror screenshot)
  const baseData: MemberRow[] = useMemo(
    () => [
      { key: 1, id: 7628, formNumber: "G7405", applicationName: "Test", status: "Pending" },
      { key: 2, id: 7628, formNumber: "G7405", applicationName: "Test", status: "Pending" },
      { key: 3, id: 7628, formNumber: "G7405", applicationName: "Test", status: "Pending" },
      { key: 4, id: 7628, formNumber: "G7405", applicationName: "Test", status: "Pending" },
      { key: 5, id: 7628, formNumber: "G7405", applicationName: "Test", status: "Pending" },
      { key: 6, id: 7628, formNumber: "G7405", applicationName: "Test", status: "Pending" },
    ],
    []
  );

  // Simple client-side filtering mock
  const dataSource = useMemo(() => {
    let d = [...baseData];
    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter(
        r =>
          String(r.id).includes(q) ||
          r.formNumber.toLowerCase().includes(q) ||
          r.applicationName.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q)
      );
    }
    if (mcc) d = d.filter(() => true); // wire your real filter
    if (mpp) d = d.filter(() => true);
    if (dates) d = d.filter(() => true);
    return d;
  }, [baseData, search, mcc, mpp, dates]);

  const columns = [
    {
      title: <span className="text-lighttext font-semibold">ID</span>,
      dataIndex: "id",
      key: "id",
      render: (v: any) => <span className="text-textheading">{v}</span>,
    },
    {
      title: <span className="text-lighttext font-semibold">Form Number</span>,
      dataIndex: "formNumber",
      key: "formNumber",
      render: (v: any) => <span className="text-textheading">{v}</span>,
    },
    {
      title: <span className="text-lighttext font-semibold">Application Name</span>,
      dataIndex: "applicationName",
      key: "applicationName",
      render: (v: any) => <span className="text-textheading">{v}</span>,
    },
    {
      title: <span className="text-lighttext font-semibold">Status</span>,
      dataIndex: "status",
      key: "status",
      render: (s: MemberRow["status"]) => statusChip(s),
    },
    {
      title: <span className="text-lighttext font-semibold">Action</span>,
      key: "action",
      render: (_: any, record: MemberRow) => (
        <div className="flex">
          <button
            className="bg-blue text-white px-5 border-none py-1 rounded-full flex items-center gap-2"
            onClick={() => {
            //   setViewRecord(record);
            //   setIsViewOpen(true);
                        navigate('/users/detail/1')

            }}
          >
            <HiEye className="text-[18px]" />
            View
          </button>
        </div>
      ),
    },
  ];

  // Pagination helpers
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const total = dataSource.length;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <>
      <BradCrumb />
      <div className="p-4 bg-white rounded-lg shadow">
        {/* Header */}
        <div className="flex items-center justify-between h-fit">

        <div className="mb-4">
          <h2 className="text-lg font-semibold mt-1">Re Submitted Member</h2>
          <p className="text-sm text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipis.
          </p>
        </div>
                  <Input
                  className="h-fit"
            placeholder="Type to search"
            prefix={<SearchOutlined />}
            style={{ width: 260 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        {/* Top bar: Filters (left) + Search (right) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-3 mb-4">
          <Space size="middle" wrap>
            <Select
              placeholder="Select MCC"
              style={{ width: 140 }}
              value={mcc}
              onChange={setMcc}
              options={[
                { value: "mcc1", label: "MCC 1" },
                { value: "mcc2", label: "MCC 2" },
              ]}
              allowClear
            />
            <Select
              placeholder="Select MPP"
              style={{ width: 140 }}
              value={mpp}
              onChange={setMpp}
              options={[
                { value: "mpp1", label: "MPP 1" },
                { value: "mpp2", label: "MPP 2" },
              ]}
              allowClear
            />
            <RangePicker
              placeholder={["From Date(dd/mm/yy)", "To Date(dd/mm/yy)"]}
              onChange={(v) => setDates(v as any)}
              style={{ width: 280 }}
              allowEmpty={[true, true]}
            />
            <Button
              className="bg-blue text-white"
              type="primary"
              onClick={() => {
                // trigger real fetch with filters
                // noop for mock
              }}
            >
              Filter
            </Button>
          </Space>

        </div>

        {/* Table */}
        <Table
          bordered
          dataSource={dataSource}
          columns={columns as any}
          pagination={{
            pageSize,
            current: page,
            total,
            showSizeChanger: false,
            onChange: (p) => setPage(p),
            position: ["bottomRight"],
          }}
        />

        {/* Footer “showing … entries” */}
        <div className="text-sm text-gray-500 mt-2">
          {total > 0
            ? `Showing ${from} to ${to} of ${total} entries`
            : "Showing 0 entries"}
        </div>

        {/* View (details) Modal */}
        <Modal
          title={<span className="text-lg font-semibold">Member Application</span>}
          open={isViewOpen}
          onCancel={() => setIsViewOpen(false)}
          footer={[
            <Button key="close" onClick={() => setIsViewOpen(false)}>
              Close
            </Button>,
          ]}
        >
          {viewRecord ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">ID</span>
                <span className="font-medium">{viewRecord.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Form Number</span>
                <span className="font-medium">{viewRecord.formNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Application Name</span>
                <span className="font-medium">{viewRecord.applicationName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status</span>
                {statusChip(viewRecord.status)}
              </div>
            </div>
          ) : null}
        </Modal>
      </div>
    </>
  );
};

export default ApprovedMemberList;
