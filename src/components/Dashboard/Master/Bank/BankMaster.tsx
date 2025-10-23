import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../../store/store";
import type { RootStateWithBanks, Bank } from "./types";
import {
  fetchBanksThunk,
  retrieveBankThunk,
  updateBankThunk,
  createBankThunk, // ← NEW
} from "./thunk";
import {
  setBanksLimit,
  setBanksPage,
  setBanksSearch,
  setBanksSort,
  clearSelectedBank,
} from "./slice";

import {
  Table,
  Input,
  Button,
  Modal,
  Upload,
  Pagination,
  Space,
  Typography,
  Form,
  Switch,
  message,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { MdOutlineCloudUpload, MdOutlineFileDownload } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
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

const BankListPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, page, limit, total, sort_by, sort, search, retrieving, updating, creating, selected } =
    useSelector((s: RootStateWithBanks) => s.banks);

  // local UI states
  const [localSearch, setLocalSearch] = useState(search ?? "");
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false); // ← NEW
  const [editForm] = Form.useForm<Pick<Bank, "bank_name" | "ifsc_code" | "branch" | "status">>();
  const [addForm] = Form.useForm<Pick<Bank, "bank_name" | "ifsc_code" | "branch" | "status">>(); // ← NEW

  // fetch list
  useEffect(() => {
    dispatch(fetchBanksThunk());
  }, [dispatch, page, limit, sort_by, sort, search]);

  // when selected (for edit)
  useEffect(() => {
    if (selected && isEditOpen) {
      editForm.setFieldsValue({
        bank_name: selected.bank_name,
        ifsc_code: selected.ifsc_code,
        branch: selected.branch,
        status: selected.status,
      });
    }
  }, [selected, isEditOpen, editForm]);

  // columns
  const columns = useMemo(
    () => [
      {
        title: <span className="text-lighttext font-semibold">S.N.</span>,
        key: "sn",
        width: 80,
        render: (_: any, __: Bank, idx: number) => (page - 1) * limit + idx + 1,
      },
      {
        title: <span className="text-lighttext font-semibold">Bank Name</span>,
        dataIndex: "bank_name",
        key: "bank_name",
        render: (text: string) => <span className="text-textheading font-medium">{text}</span>,
      },
      {
        title: <span className="text-lighttext font-semibold">IFSC Code</span>,
        dataIndex: "ifsc_code",
        key: "ifsc_code",
        render: (text: string) => <span className="text-textheading font-medium">{text}</span>,
      },
      {
        title: <span className="text-lighttext font-semibold">Branch</span>,
        dataIndex: "branch",
        key: "branch",
        render: (text: string) => <span className="text-textheading font-medium">{text}</span>,
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
      {
        title: <span className="text-lighttext font-semibold">Action</span>,
        key: "action",
        width: 120,
        render: (_: any, record: Bank) => (
          <Button
            type="primary"
            icon={<BiEdit />}
            className="bg-blue rounded-full"
            onClick={async () => {
              setIsEditOpen(true);
              try {
                await dispatch(retrieveBankThunk(record.id)).unwrap();
              } catch (e: any) {
                message.error(e || "Failed to load bank");
              }
            }}
          >
            Edit
          </Button>
        ),
      },
    ],
    [page, limit, dispatch]
  );

  // search
  const onSearchApply = () => dispatch(setBanksSearch(localSearch.trim()));

  // pagination
  const onPageChange = (newPage: number, newPageSize?: number) => {
    if (newPageSize && newPageSize !== limit) dispatch(setBanksLimit(newPageSize));
    if (newPage !== page) dispatch(setBanksPage(newPage));
  };

  // export/template
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(items);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Banks");
    XLSX.writeFile(wb, `Banks_p${page}_l${limit}.xlsx`);
  };
  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([], { header: ["bank_name", "ifsc_code", "branch", "status"] });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BankMaster");
    XLSX.writeFile(wb, "BankMaster_Template.xlsx");
  };

  // sort toggle
  const toggleCreatedSort = () => {
    dispatch(setBanksSort({ sort_by: "created_at", sort: sort === "desc" ? "asc" : "desc" }));
  };

  // update submit
  const handleUpdate = async () => {
    try {
      const values = await editForm.validateFields();
      if (!selected) return;
      await dispatch(
        updateBankThunk({
          id: selected.id,
          data: {
            bank_name: values.bank_name,
            ifsc_code: values.ifsc_code,
            branch: values.branch,
            status: values.status,
          },
        })
      ).unwrap();
      message.success("Bank updated");
      setIsEditOpen(false);
      dispatch(clearSelectedBank());
    } catch (e: any) {
      if (typeof e === "string") message.error(e);
    }
  };

  // create submit
  const handleCreate = async () => {
    try {
      const values = await addForm.validateFields();
      await dispatch(
        createBankThunk({
          bank_name: values.bank_name,
          ifsc_code: values.ifsc_code,
          branch: values.branch,
          status: values.status ?? true,
        })
      ).unwrap();
      message.success("Bank created");
      setIsAddOpen(false);
      addForm.resetFields();
      // optionally: dispatch(fetchBanksThunk());
    } catch (e: any) {
      if (typeof e === "string") message.error(e);
    }
  };

  return (
    <>
      <BradCrumb />
      <div className="p-4 bg-white rounded-lg shadow">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <Title level={4} className="!mb-0">Bank Master</Title>
            <p className="text-sm text-gray-500">Manage bank records (IFSC, Branch, status).</p>
          </div>
          <Space wrap>
            <Input
              allowClear
              placeholder="Search bank / IFSC / branch"
              prefix={<SearchOutlined />}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onPressEnter={onSearchApply}
              style={{ width: 260 }}
            />
            <Button onClick={onSearchApply}>Search</Button>
            <Button onClick={toggleCreatedSort}>Sort by Created ({sort.toUpperCase()})</Button>
            <Button onClick={handleDownloadTemplate}>
              <MdOutlineFileDownload style={{ fontSize: 18, marginRight: 6 }} />
              Download Format
            </Button>
            {/* ← NEW Add button */}
            <Button type="primary" className="bg-blue" onClick={() => setIsAddOpen(true)}>
              Add
            </Button>
            <Button onClick={() => setIsImportOpen(true)}>Import</Button>
            <Button onClick={handleExport}>Export</Button>
          </Space>
        </div>

        {/* Table */}
        <Table<Bank>
          bordered
          rowKey={(r) => r.id}
          dataSource={items}
          columns={columns as any}
          loading={loading}
          pagination={false}
        />

        {/* Pagination */}
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

        {/* Edit Modal */}
        <Modal
          title={<span className="text-lg font-semibold">Edit Bank</span>}
          open={isEditOpen}
          onCancel={() => {
            setIsEditOpen(false);
            dispatch(clearSelectedBank());
          }}
          confirmLoading={updating}
          onOk={handleUpdate}
          okText="Update"
        >
          <Form layout="vertical" form={editForm} initialValues={{ status: true }}>
            <Form.Item label="Bank Name" name="bank_name" rules={[{ required: true, message: "Bank name is required" }]}>
              <Input disabled={retrieving} />
            </Form.Item>
            <Form.Item label="IFSC Code" name="ifsc_code" rules={[{ required: true, message: "IFSC code is required" }]}>
              <Input disabled={retrieving} />
            </Form.Item>
            <Form.Item label="Branch" name="branch" rules={[{ required: true, message: "Branch is required" }]}>
              <Input disabled={retrieving} />
            </Form.Item>
            <Form.Item label="Status" name="status" valuePropName="checked">
              <Switch disabled={retrieving} />
            </Form.Item>
          </Form>
        </Modal>

        {/* Add Modal */}
        <Modal
          title={<span className="text-lg font-semibold">Add Bank</span>}
          open={isAddOpen}
          onCancel={() => setIsAddOpen(false)}
          confirmLoading={creating}
          onOk={handleCreate}
          okText="Create"
        >
          <Form layout="vertical" form={addForm} initialValues={{ status: true }}>
            <Form.Item label="Bank Name" name="bank_name" rules={[{ required: true, message: "Bank name is required" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="IFSC Code" name="ifsc_code" rules={[{ required: true, message: "IFSC code is required" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Branch" name="branch" rules={[{ required: true, message: "Branch is required" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Status" name="status" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Form>
        </Modal>

        {/* Import Modal (UI only) */}
        <Modal
          title="Import Bank Master"
          open={isImportOpen}
          onCancel={() => setIsImportOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsImportOpen(false)}>Cancel</Button>,
            <Button key="import" type="primary" className="bg-blue">Import</Button>,
          ]}
        >
          <Upload.Dragger
            className="!border-dashed !border-gray-300 rounded-lg p-6 hover:!border-blue"
            multiple={false}
            beforeUpload={() => false}
            showUploadList={false}
            accept=".xlsx,.xls,.csv"
          >
            <p className="ant-upload-drag-icon">
              <MdOutlineCloudUpload style={{ fontSize: 32, color: "#1890ff" }} />
            </p>
            <p className="text-textheading mb-0 font-medium text-lg">Choose a file or drag & drop it here</p>
            <p className="text-lighttext text-sm">Excel or CSV formats, up to 5MB</p>
            <Button className="mt-3 font-medium text-textheading">Browse File</Button>
          </Upload.Dragger>
        </Modal>
      </div>
    </>
  );
};

export default BankListPage;
