import React, { useState } from "react";
import { Table, Input, Button, Modal, Upload, Tag, Form } from "antd";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import BradCrumb from "../BreadCrumb";
import { MdOutlineCloudUpload, MdOutlineFileDownload } from "react-icons/md";
import { BiEdit } from "react-icons/bi";

const MasterData = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<any>(null);

  // Sample Data for table
  const dataSource = [
    { key: 1, districtName: "Patna", districtCode: "101", villageName: "Village A", hamletCode: "H001", 
        status: "Active" },
    { key: 2, districtName: "Gaya", districtCode: "102", villageName: "Village B", hamletCode: "H002", status: "Active" },
    { key: 3, districtName: "Nalanda", districtCode: "103", villageName: "Village C", hamletCode: "H003", status: "Active" },
  ];

  // Table Columns
  const columns = [
    {
      title: <span className="text-lighttext font-semibold">S.N.</span>,
      dataIndex: "key",
      key: "key",
      render: (text: any) => <span className="text-blue-600 font-medium">{text}</span>,
    },
    {
      title: <span className="text-lighttext font-semibold">District Name</span>,
      dataIndex: "districtName",
      key: "districtName",
      render: (text: any) => <span className="text-textheading font-medium">{text}</span>,
    },
    {
      title: <span className="text-lighttext font-semibold">District Code</span>,
      dataIndex: "districtCode",
      key: "districtCode",
      render: (text: any) => <span className="text-textheading font-medium">{text}</span>,
    },
    {
      title: <span className="text-lighttext font-semibold">Village Name</span>,
      dataIndex: "villageName",
      key: "villageName",
      render: (text: any) => <span className="text-textheading font-medium">{text}</span>,
    },
    {
      title: <span className="text-lighttext font-semibold">Hamlet Code</span>,
      dataIndex: "hamletCode",
      key: "hamletCode",
      render: (text: any) => <span className="text-textheading font-medium">{text}</span>,
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
      case "Active":
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
      <span
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}
      >
        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
        {status}
      </span>
    );
  },
}
,
    {
      title: <span className="text-lighttext font-semibold">Action</span>,
      key: "action",
      render: (_: any, record: any) => (
        <Button
          type="primary"
            icon={<BiEdit  />} // ✅ adds the pen icon

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
  ];

  // Excel Download Function
  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet([], {
      header: ["District Name", "District Code", "Village Name", "Hamlet Code"],
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "MasterData");
    XLSX.writeFile(workbook, "VillageMaster_Template.xlsx");
  };

  return (
    <>
      <BradCrumb />
      <div className="p-4 bg-white rounded-lg shadow">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold">Bank Master Data</h2>
            <p className="text-sm text-gray-500">
              Manage district, village and hamlet master records here.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Type to search"
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
            />
            <div
              className="bg-blue text-white px-4 py-2 flex gap-2 items-center rounded-lg cursor-pointer"
              onClick={handleDownload}
            >
              <MdOutlineFileDownload className="text-[20px]" /> Download Format
            </div>
            <Button onClick={() => setIsImportOpen(true)}>Import</Button>
            <Button>Export</Button>
          </div>
        </div>

        {/* Table */}
        <Table bordered dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />

        {/* Edit Modal */}

<Modal
  title={<span className="text-lg font-semibold">Edit Bank Master Data</span>}
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
      <Form.Item label="Bank Name" className="font-medium">
        <Input
          value={editRecord.bankName}
          onChange={(e) =>
            setEditRecord({ ...editRecord, bankName: e.target.value })
          }
        />
      </Form.Item>

      <Form.Item label="IFSC Code" className="font-medium">
        <Input
          value={editRecord.bankCode}
          onChange={(e) =>
            setEditRecord({ ...editRecord, bankCode: e.target.value })
          }
        />
      </Form.Item>
      <Form.Item label="Branch" className="font-medium">
        <Input
          value={editRecord.bankCode}
          onChange={(e) =>
            setEditRecord({ ...editRecord, bankCode: e.target.value })
          }
        />
      </Form.Item>
    </Form>
  )}
</Modal>

        {/* Import Modal */}
        <Modal
          title="Import Village Master Data"
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
          >
            <p className="ant-upload-drag-icon">
              <MdOutlineCloudUpload style={{ fontSize: "32px", color: "#1890ff" }} />
            </p>
            <p className="text-textheading mb-0 font-medium text-lg">
              Choose a file or drag & drop it here
            </p>
            <p className="text-lighttext text-sm">
              Excel or CSV formats, up to 5MB
            </p>
            <Button className="mt-3 font-medium text-textheading">Browse File</Button>
          </Upload.Dragger>
        </Modal>
      </div>
    </>
  );
};

export default MasterData;
