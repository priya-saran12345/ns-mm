import { useState } from "react";
import { Table, Input, Button, Modal, Upload, Form } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import BradCrumb from "../BreadCrumb";
import { MdDeleteForever, MdOutlineCloudUpload } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import { Plus } from "lucide-react";

const MasterData = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<any | null>(null);

  // Sample Data for table
  const dataSource = [
    { key: 1, breedName: "Gir", animalType: "Cow", status: "Active" },
    { key: 2, breedName: "Murrah", animalType: "Buffalo", status: "Active" },
    { key: 3, breedName: "Sahiwal", animalType: "Cow", status: "Pending" },
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
      title: <span className="text-lighttext font-semibold">Breed Name</span>,
      dataIndex: "breedName",
      key: "breedName",
      render: (text: any) => (
        <span className="text-textheading font-medium">{text}</span>
      ),
    },
    {
      title: <span className="text-lighttext font-semibold">Animal Type</span>,
      dataIndex: "animalType",
      key: "animalType",
      render: (text: any) => (
        <span className="text-textheading font-medium">{text}</span>
      ),
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
    },
    {
      title: <span className="text-lighttext font-semibold">Action</span>,
      key: "action",
      render: (_: any, record: any) => (
        <div className="flex gap-5">
          <div
            className="bg-blue text-white w-fit px-4 py-2 flex items-center gap-1 rounded-full cursor-pointer"
            onClick={() => {
              setEditRecord(record);
              setIsEditOpen(true);
            }}
          >
            <BiEdit className="text-[20px]" />
            Edit
          </div>
          <div
            className="bg-[#EC221F] text-white w-fit px-4 py-2 flex items-center gap-1 rounded-full cursor-pointer"
            onClick={() => {
              // handle delete here
              console.log("Deleting record:", record);
            }}
          >
            <MdDeleteForever className="text-[20px]" />
            Delete
          </div>
        </div>
      ),
    },
  ];

  // Open Import modal instead of form when adding
  const handleAddAnimalBreed = () => {
    setIsImportOpen(true);
  };

  return (
    <>
      <BradCrumb />
      <div className="p-4 bg-white rounded-lg shadow">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold">Old Member</h2>
            <p className="text-sm text-gray-500">
              Manage animal breed master records here.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Type to search"
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
            />
          </div>
        </div>

        {/* Table */}
        <Table
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 5 }}
        />

        {/* Edit Modal */}
        <Modal
          title={<span className="text-lg font-semibold">Edit Animal Type</span>}
          open={isEditOpen}
          onCancel={() => setIsEditOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>,
            <Button key="save" type="primary" className="bg-blue">
              Update
            </Button>,
          ]}
        >
          {editRecord && (
            <Form layout="vertical" className="mt-2">
              <Form.Item label="Animal Type" className="font-medium">
                <Input
                  value={editRecord.animalType}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, animalType: e.target.value })
                  }
                />
              </Form.Item>

              {/* <Form.Item label="Breed Name" className="font-medium">
                <Input
                  value={editRecord.breedName}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, breedName: e.target.value })
                  }
                />
              </Form.Item> */}
            </Form>
          )}
        </Modal>

        {/* Import Modal */}
        <Modal
          title="Import Animal Breed Data"
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
              <MdOutlineCloudUpload
                style={{ fontSize: "32px", color: "#1890ff" }}
              />
            </p>
            <p className="text-textheading mb-0 font-medium text-lg">
              Choose a file or drag & drop it here
            </p>
            <p className="text-lighttext text-sm">
              Excel or CSV formats, up to 5MB
            </p>
            <Button className="mt-3 font-medium text-textheading">
              Browse File
            </Button>
          </Upload.Dragger>
        </Modal>
      </div>
    </>
  );
};

export default MasterData;
