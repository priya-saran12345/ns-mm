// src/components/Dashboard/FieldAgentTable.tsx
import React from "react";
import { Input, Table } from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

interface FieldAgent {
  fieldAgent: string;
  forms: number;
}

const fieldAgents: FieldAgent[] = Array(15).fill({
  fieldAgent: "Amar Sharma",
  forms: 39,
});

const FieldAgentTable: React.FC = () => {
  const navigate = useNavigate();
  const columns = [
    {
      title: <span className="text-lighttext font-semibold">Field Agent</span>,
      dataIndex: "fieldAgent",
      key: "fieldAgent",
      render: (text: string) => <span className='font-medium text-textheading'>{text}</span>,
    },
{
  title: <span className="text-lighttext font-semibold">Number of Forms</span>,
  dataIndex: "forms",
  key: "forms",
  align: "center" as const,
  render: (text: string) => (
    <span className="font-medium text-textheading">{text}</span>
  ),
},
    {
      title:<span className="text-lighttext font-semibold">Action</span> ,
      key: "action",
      align: "center" as const,
      render: () => (
        <div
          className="bg-blue w-fit cursor-pointer rounded-full text-white py-1 px-3"
        //   style={{
        //     backgroundColor: "#1",
        //     borderRadius: "20px",
        //     padding: "0 20px",
        //   }}
              onClick={() => navigate(`/dashboard/fieldusers/1`)}

        >
       <EyeOutlined/>  View
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #f0f0f0",
        borderRadius: "8px",
        padding: "16px",
      }}
    >
      <div className="flex justify-between items-center">

      <div>

      <h3 style={{ marginBottom: "4px", fontWeight: 600 }}>
        Field Agent Forms
      </h3>
      <p style={{ marginBottom: "16px", color: "#888" }}>
        Lorem ipsum dolor sit amet, consectetur adipisi.
      </p>
      </div>
    <Input
      placeholder="Type to search"
      // value={searchText}
      // onChange={(e) => setSearchText(e.target.value)}
      prefix={<SearchOutlined style={{ color: "#b0b0b0" }} />}
      style={{
        width: '35%',
        borderRadius: 8,
        border: "1px solid #e5e5e5",
        padding: "8px 10px",
      }}
      />
      </div>

      <Table
        columns={columns}
        dataSource={fieldAgents.map((f, i) => ({ ...f, key: i }))}
        pagination={false}
        bordered={false}
        style={{ background: "transparent" }}
      />
    </div>
  );
};

export default FieldAgentTable;
