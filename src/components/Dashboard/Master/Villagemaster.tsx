import React, { useState } from "react";
import { Table, Input, Button, Modal, Upload } from "antd";
import { SearchOutlined, UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import BradCrumb from '../BreadCrumb'
import { MdOutlineCloudUpload, MdOutlineFileDownload } from "react-icons/md";
const MasterData = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample Data for table
  const dataSource = [
    { key: 1, districtName: "STATE BANK OF INDIA", districtCode: "SBIN0003527", villageName: "Asarganj", hamletCode: "Asarganj" },
    { key: 2, districtName: "STATE BANK OF INDIA", districtCode: "SBIN0003527", villageName: "Asarganj", hamletCode: "Asarganj" },
    { key: 3, districtName: "STATE BANK OF INDIA", districtCode: "SBIN0003527", villageName: "Asarganj", hamletCode: "Asarganj" },
    { key: 4, districtName: "STATE BANK OF INDIA", districtCode: "SBIN0003527", villageName: "Asarganj", hamletCode: "Asarganj" },
  ];

  // Table Columns
const columns = [
  {
    title: <span className="text-lighttext font-semibold">S.N.</span>,
    dataIndex: "key",
    key: "key",
    render: (text: any) => (
      <span className="text-blue-600 font-medium">{text}</span>
    ),
  },
  {
    title: <span className="text-lighttext font-semibold">District Name</span>,
    dataIndex: "districtName",
    key: "districtName",
    render: (text: any) => (
      <span className="text-textheading font-medium">{text}</span>
    ),
  },
  {
    title: <span className="text-lighttext font-semibold">District Code</span>,
    dataIndex: "districtCode",
    key: "districtCode",
    render: (text: any) => (
      <span className="text-textheading font-medium">{text}</span>
    ),
  },
  {
    title: <span className="text-lighttext font-semibold">Village Name</span>,
    dataIndex: "villageName",
    key: "villageName",
    render: (text: any) => (
      <span className="text-textheading font-medium">{text}</span>
    ),
  },
  {
    title: <span className="text-lighttext font-semibold">Hamlet Code</span>,
    dataIndex: "hamletCode",
    key: "hamletCode",
    render: (text: any) => (
      <span className="text-textheading font-medium">{text}</span>
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
    XLSX.writeFile(workbook, "MasterData_Template.xlsx");
  };

  return (
    <>
    <BradCrumb></BradCrumb>
    <div className="p-4 bg-white rounded-lg shadow">
      {/* Breadcrumb */}

      {/* Card Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">Master Data</h2>
          <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet, consectetur adipis.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input placeholder="Type to search" prefix={<SearchOutlined />} style={{ width: 250 }} />
          <div  className="bg-blue text-white p-4 flex gap-2 item-center py-3 rounded-lg" onClick={handleDownload}>
           <MdOutlineFileDownload className="text-[20px]"/> Download Format
          </div>
          <Button onClick={() => setIsModalOpen(true)}>Import</Button>
          <Button>Export</Button>
        </div>
      </div>

      {/* Table */}
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />

      {/* Import Modal */}
      <Modal
        title="Import"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="import" type="primary">
            Import
          </Button>,
        ]}
      >
        <div className="  rounded-lg">
          <Upload.Dragger className="border-blue" multiple={false} beforeUpload={() => false} showUploadList={false}>
            <p className="ant-upload-drag-icon">
              <MdOutlineCloudUpload  style={{ fontSize: "32px" }} />
            </p>
            <p className="text-textheading mb-0 font-medium text-lg">Choose a file or drag & drop it here</p>
            <p className="text-lighttext text-md">JPEG, PNG, PDF, and MP4 formats, up to 50MB</p>
            <Button className="mt-2 font-medium text-textheading">Browse File</Button>
          </Upload.Dragger>
        </div>
      </Modal>
    </div>
        </>

  );
};

export default MasterData;
