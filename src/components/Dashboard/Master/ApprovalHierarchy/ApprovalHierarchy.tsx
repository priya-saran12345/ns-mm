import React, { useEffect, useState, useMemo } from "react";
import { Table, Input, Button, Modal, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { BiEdit } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";
import BradCrumb from "../../BreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import { fetchApprovalHierarchyThunk } from "./thunk";
import { setApprovalHierarchyFilters } from "./slice";
import { RootStateWithApprovalHierarchy, ApprovalHierarchyRow } from "./types";
import AddApprovalHierarchy from "./AddApprovalHierarchy"; // Import AddApprovalHierarchy component

// Status rendering for pills
const statusPill = (raw: boolean | string | undefined) => {
  // normalize to 'Active' | 'Inactive'
  let key: "Active" | "Inactive" = "Inactive";
  if (typeof raw === "boolean") key = raw ? "Active" : "Inactive";
  else if (typeof raw === "string") {
    const v = raw.trim().toLowerCase();
    if (v === "active" || v === "true" || v === "1" || v === "yes") key = "Active";
    else key = "Inactive";
  }

  const s =
    key === "Active"
      ? { bg: "bg-[#DCFCE7]", fg: "text-[#14532D]", dot: "bg-[#22C55E]" }
      : { bg: "bg-[#FEE2E2]", fg: "text-[#7F1D1D]", dot: "bg-[#EF4444]" };

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${s.bg} ${s.fg}`}>
      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
      {key}
    </span>
  );
};

const ApprovalHierarchyPage: React.FC = () => {
  const dispatch = useDispatch();
  const { rows, loading, page, limit, total, search, levelFilter } =
  useSelector((state: RootStateWithApprovalHierarchy) => state.approvalHierarchy);
  const [localSearch, setLocalSearch] = useState(search ?? "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Added for Add Hierarchy Modal

  // Fetch approval hierarchy data
  useEffect(() => {
    dispatch(fetchApprovalHierarchyThunk({ page, limit, search, levelFilter }));
  }, [dispatch, page, limit, search, levelFilter]);

  // Determine max level count from the data
  const maxLevelCount = useMemo(() => {
    let max = 0;
    rows.forEach((row) => {
      max = Math.max(max, row.levels.length);
    });
    return max;
  }, [rows]);

  // Generate table columns dynamically based on max level count
  const columns = useMemo(() => {
    const levelColumns = [];
    for (let i = 1; i <= maxLevelCount; i++) {
      levelColumns.push({
        title: `Level ${i}`,
        dataIndex: `level${i}`,
        key: `level${i}`,
        render: (_, record: ApprovalHierarchyRow) => {
          // Get the corresponding level from the record
          const level = record.levels[i - 1]; // i-1 because index starts at 0
          return <span>{level ? level.role?.name || "No Role" : "N/A"}</span>;
        },
      });
    }

    return [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Level Count", dataIndex: "level", key: "levelCount", width: 100 },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (val: boolean | string | undefined) => statusPill(val),
      },
      ...levelColumns, // Add dynamic level columns here
      // {
      //   title: "Action",
      //   key: "action",
      //   width: 220,
      //   render: (_, record: ApprovalHierarchyRow) => (
      //     <div className="flex gap-3">
      //       <Button
      //         type="primary"
      //         onClick={() => {
      //           setIsModalOpen(true);
      //           // Edit logic
      //         }}
      //       >
      //         <BiEdit /> Edit
      //       </Button>
      //       <Button
      //         danger
      //         onClick={() => {
      //           // Delete logic
      //         }}
      //       >
      //         <MdDeleteForever /> Delete
      //       </Button>
      //     </div>
      //   ),
      // },
    ];
  }, [rows, maxLevelCount]);

  const onSearchApply = () => dispatch(setApprovalHierarchyFilters({ search: localSearch.trim() }));

  return (
    <>
      <BradCrumb />
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold">Approval Hierarchy</h2>
            <p className="text-sm text-gray-500">Manage your approval hierarchy</p>
          </div>
          <div className="flex gap-2">
            <Input
              allowClear
              placeholder="Search"
              prefix={<SearchOutlined />}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onPressEnter={onSearchApply}
              style={{ width: 260 }}
            />
            <Button onClick={onSearchApply}>Search</Button>
            <Button onClick={() => setIsAddModalOpen(true)}>Add Hierarchy</Button> {/* Added Add button */}
          </div>
        </div>

        <Table bordered rowKey="id" dataSource={rows} columns={columns} loading={loading} />

        <div className="flex justify-end mt-4">
          <Pagination
            current={page}
            pageSize={limit}
            total={total}
            showSizeChanger
            pageSizeOptions={["10", "20", "50", "100"]}
            onChange={(newPage) => dispatch(setApprovalHierarchyFilters({ page: newPage }))}
          />
        </div>

        {/* Edit Modal */}
        <Modal
          title={<span className="text-lg font-semibold">Edit Approval Hierarchy</span>}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>,
            <Button key="save" type="primary" className="bg-blue" onClick={() => { /* handle save edit */ }}>
              Save Changes
            </Button>,
          ]}
        >
          {/* Form or inputs for editing the approval hierarchy */}
        </Modal>

        {/* Add Hierarchy Modal */}
        <AddApprovalHierarchy isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      </div>
    </>
  );
};

export default ApprovalHierarchyPage;
