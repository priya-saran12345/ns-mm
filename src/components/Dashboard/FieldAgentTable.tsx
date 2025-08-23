// src/components/Dashboard/FieldAgentTable.tsx
import React from "react";
import { Table } from "antd";
import { EyeOutlined } from "@ant-design/icons";

interface FieldAgent {
  fieldAgent: string;
  forms: number;
}

const fieldAgents: FieldAgent[] = Array(15).fill({
  fieldAgent: "Amar Sharma",
  forms: 39,
});

const FieldAgentTable: React.FC = () => {
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
          className="bg-blue w-fit rounded-full text-white py-1 px-3"
        //   style={{
        //     backgroundColor: "#1",
        //     borderRadius: "20px",
        //     padding: "0 20px",
        //   }}
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
      <h3 style={{ marginBottom: "4px", fontWeight: 600 }}>
        Field Agent Forms
      </h3>
      <p style={{ marginBottom: "16px", color: "#888" }}>
        Lorem ipsum dolor sit amet, consectetur adipisi.
      </p>

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
