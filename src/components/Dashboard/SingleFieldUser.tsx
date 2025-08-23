import React, { useState } from "react";
import { Table, Input,  Button } from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";

const { Search } = Input;

interface DataType {
  key: string;
  id: string;
  application: string;
  form: string;
  status: "Approved" | "Pending" | "Rejected" | "Submitted";
}

const AppTable: React.FC = () => {
  const [searchText, setSearchText] = useState("");

  const data: DataType[] = [
    { key: "1", id: "7628", application: "Test", form: "G7405", status: "Approved" },
    { key: "2", id: "7628", application: "Test", form: "G7405", status: "Pending" },
    { key: "3", id: "7628", application: "Test", form: "G7405", status: "Pending" },
    { key: "4", id: "7628", application: "Test", form: "G7405", status: "Rejected" },
    { key: "5", id: "7628", application: "Test", form: "G7405", status: "Submitted" },
    { key: "6", id: "7628", application: "Test", form: "G7405", status: "Submitted" },
  ];

  const filteredData = data.filter(
    (item) =>
      item.id.toLowerCase().includes(searchText.toLowerCase()) ||
      item.application.toLowerCase().includes(searchText.toLowerCase()) ||
      item.form.toLowerCase().includes(searchText.toLowerCase()) ||
      item.status.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: <span className="text-lighttext font-semibold">ID</span>,
      dataIndex: "id",
      key: "id",
      render: (text: string) => <span className="font-medium text-textheading">{text}</span>,
    },
    {
      title: <span className="text-lighttext font-semibold">Application Name</span>,
      dataIndex: "application",
      key: "application",
      render: (text: string) => <span className="font-medium text-textheading">{text}</span>,
    },
    {
      title: <span className="text-lighttext font-semibold">Form Number</span>,
      dataIndex: "form",
      key: "form",
      render: (text: string) => <span className="font-medium text-textheading">{text}</span>,
    },
{
  title: <span className="text-lighttext font-semibold">Status</span>,
  dataIndex: "status",
  key: "status",
  render: (status: string) => {
    let bgColor = "";
    let textColor = "";
    let dotColor = "";

    switch (status) {
      case "Approved":
        bgColor = "bg-[#DCFCE7]";
        textColor = "text-[#14532D]";
        dotColor = "bg-[#22C55E]";
        break;
      case "Pending":
        bgColor = "bg-[#FEF9C3]";
        textColor = "text-[#713F12]";
        dotColor = "bg-[#FACC15]";
        break;
      case "Rejected":
        bgColor = "bg-[#FEE2E2]";
        textColor = "text-[#7F1D1D]";
        dotColor = "bg-[#EF4444]";
        break;
      case "Submitted":
        bgColor = "bg-[#C5D7FF]";
        textColor = "text-[#0B2B73]";
        dotColor = "bg-blue";
        break;
      default:
        bgColor = "bg-gray-100";
        textColor = "text-gray-700";
        dotColor = "bg-gray-500";
    }

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium ${bgColor} ${textColor}`}
      >
        <span className={`h-2 w-2 rounded-full ${dotColor}`}></span>
        <span className={`${textColor}`}>

        {status}
        </span>
      </div>
    );
  },
},
    {
      title: <span className="text-lighttext font-semibold " >Action</span>,
      key: "action",
      render: () => (
        <div   className=" bg-blue text-white flex gap-2 justify-center py-1 rounded-full">
        <EyeOutlined />  View
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded-xl shadow-md border-[1px] border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h2>Aman Sharma</h2>
    <Input
      placeholder="Type to search"
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      prefix={<SearchOutlined style={{ color: "#b0b0b0" }} />}
      style={{
        width: '30%',
        borderRadius: 8,
        border: "1px solid #e5e5e5",
        padding: "6px 10px",
      }}
    />
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default AppTable;
