import React, { useMemo, useState } from "react";
import { Table, Input, Button, Select, Modal, message, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import BradCrumb from "../BreadCrumb";
import { LuFilter } from "react-icons/lu";

type Row = {
  id: number;
  formNumber: string;
  applicationName: string;
  facilitatorName: string;
  mccName: string;
  mppCode: string;
};

const FACILITATORS = ["Raju", "Bheem", "Chutki", "Kalia"];
const MCCS = ["MCC-001", "MCC-002", "MCC-003"]; // no placeholder here
const MPPS = ["MPP-101", "MPP-102", "MPP-103"]; // no placeholder here

const popupProps = {
  // keeps the dropdown inside the same stacking context to avoid clipping
  getPopupContainer: (node: HTMLElement) => node.parentElement as HTMLElement,
  popupMatchSelectWidth: false as const,
};

const FacilitatorFormTransfer: React.FC = () => {
  // ---- Mock data ----
  const [rows, setRows] = useState<Row[]>(
    Array.from({ length: 6 }).map((_, i) => ({
      id: i === 0 ? 1 : 7628,
      formNumber: "G7405",
      applicationName: "Test",
      facilitatorName: "Raju",
      mccName: "Test",
      mppCode: "Test",
    }))
  );

  // ---- UI state ----
  const [search, setSearch] = useState("");
  const [filterFac, setFilterFac] = useState<string | undefined>(undefined);
  const [filterMcc, setFilterMcc] = useState<string | undefined>(undefined);
  const [filterMpp, setFilterMpp] = useState<string | undefined>(undefined);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [newFacilitator, setNewFacilitator] = useState<string | undefined>();

  // ---- Derived list (filters + search) ----
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      const okSearch =
        !q ||
        r.formNumber.toLowerCase().includes(q) ||
        r.applicationName.toLowerCase().includes(q) ||
        r.facilitatorName.toLowerCase().includes(q) ||
        String(r.id).includes(q);
      const okFac = !filterFac || r.facilitatorName === filterFac;
      const okMcc = !filterMcc || r.mccName === filterMcc;
      const okMpp = !filterMpp || r.mppCode === filterMpp;
      return okSearch && okFac && okMcc && okMpp;
    });
  }, [rows, search, filterFac, filterMcc, filterMpp]);

  // ---- Table ----
  const columns: ColumnsType<Row> = [
    {
      title: "S. No",
      key: "sn",
      width: 90,
      render: (_: any, __: Row, index: number) => String(index + 1).padStart(2, "0"),
    },
    {
      title: "Facilitator Name",
      dataIndex: "facilitatorName",
      key: "facilitatorName",
      render: (t: string) => <span className="text-textheading font-medium">{t}</span>,
    },
    { title: "Form Number", dataIndex: "formNumber", key: "formNumber" },
    { title: "Application Name", dataIndex: "applicationName", key: "applicationName" },
    { title: "MCC Name", dataIndex: "mccName", key: "mccName" },
    { title: "MPP Code", dataIndex: "mppCode", key: "mppCode" },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  // ---- Bulk update ----
  const openBulkModal = () => {
    if (!selectedRowKeys.length) {
      message.warning("Please select at least one row.");
      return;
    }
    setNewFacilitator(undefined);
    setSelectModalOpen(true);
  };

  const applyBulkUpdate = () => {
    if (!newFacilitator) {
      message.error("Please select a facilitator.");
      return;
    }
    const keySet = new Set(selectedRowKeys);
    setRows((prev) =>
      prev.map((r, idx) =>
        keySet.has(idx) || keySet.has(r.id) ? { ...r, facilitatorName: newFacilitator } : r
      )
    );
    setSelectModalOpen(false);
    setSelectedRowKeys([]);
    message.success("Updated facilitator for selected rows.");
  };

  return (
    <>
      <BradCrumb />
      <div className="p-4 bg-white rounded-lg shadow">
        {/* Header */}
        <div className="flex justify-between items-center ">
          <div>
            <h2 className="text-lg font-semibold">Facilitator Form Transfer</h2>
            <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet, consectetur adipis.</p>
          </div>

          {/* Toolbar */}
          <Space size="middle" wrap align="center">
            <Input
              allowClear
              size="middle"
              placeholder="Type to search"
              prefix={<SearchOutlined />}
              style={{ width: 260 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Button size="middle" className="bg-blue text-white" onClick={openBulkModal}>
              Update Map Selected Member
            </Button>

          </Space>
        </div>
<div className="flex gap-3 mb-4 justify-end">
            <Select
              {...popupProps}
              size="middle"
              placeholder="Select Facilitator"
              style={{ width: 200 }}
              allowClear
              value={filterFac}
              onChange={setFilterFac}
              options={FACILITATORS.map((f) => ({ label: f, value: f }))}
              showSearch
              optionFilterProp="label"
            />
            <Select
              {...popupProps}
              size="middle"
              placeholder="MCC"
              style={{ width: 140 }}
              allowClear
              value={filterMcc}
              onChange={setFilterMcc}
              options={MCCS.map((m) => ({ label: m, value: m }))}
              showSearch
              optionFilterProp="label"
            />
            <Select
              {...popupProps}
              size="middle"
              placeholder="MPP"
              style={{ width: 140 }}
              allowClear
              value={filterMpp}
              onChange={setFilterMpp}
              options={MPPS.map((m) => ({ label: m, value: m }))}
              showSearch
              optionFilterProp="label"
            />

            <Button size="middle" type="primary" className=" flex gap-2 items-center bg-blue">
             <LuFilter className="text-[18px]"/>

              Filter
            </Button>

</div>
        {/* Table */}
        <Table<Row>
          rowKey={(r, index) => index}
          bordered
          dataSource={filtered}
          columns={columns}
          rowSelection={{ type: "checkbox", ...rowSelection }}
          pagination={{ pageSize: 5 }}
        />

        <div className="text-sm text-gray-500 mt-2">
          Showing <b>1</b> to <b>5</b> of <b>5</b> entries
        </div>
      </div>

      {/* Modal: Select New Facilitator */}
      <Modal
        title={<span className="text-base font-semibold">Select New Facilitator</span>}
        open={selectModalOpen}
        onCancel={() => setSelectModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setSelectModalOpen(false)}>
            Close
          </Button>,
          <Button key="update" type="primary" className="bg-blue" onClick={applyBulkUpdate}>
            Update
          </Button>,
        ]}
      >
        <Select
          {...popupProps}
          size="middle"
          placeholder="Select Facilitator"
          style={{ width: "100%" }}
          value={newFacilitator}
          onChange={setNewFacilitator}
          options={FACILITATORS.map((f) => ({ label: f, value: f }))}
          showSearch
          optionFilterProp="label"
          dropdownStyle={{ maxHeight: 260, overflowY: "auto" }}
        />
      </Modal>
    </>
  );
};

export default FacilitatorFormTransfer;
