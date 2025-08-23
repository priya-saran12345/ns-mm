import React from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Table,
  
} from "antd";
import {
  EyeOutlined,
} from "@ant-design/icons";
import { FaAngleRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import { BsDownload } from "react-icons/bs";

const { Title, Text } = Typography;

// Mock data
const summaryStats = [
  { title: "Submitted", value: 12426, icon: <BsDownload />
 },
  { title: "Pending", value: 12426, icon:  <BsDownload /> },
  { title: "Rejected", value: 12426, icon: <BsDownload /> },
  { title: "Approved", value: 12426, icon: <BsDownload /> },
];

const membershipData = [
  { month: "Jan", valueMain: 67000, valueSecondary: 54000 },

  { month: "Feb", valueMain: 30000, valueSecondary: 25000 },
  { month: "Mar", valueMain: 35000, valueSecondary: 28000 },
  { month: "Apr", valueMain: 40000, valueSecondary: 32000 },
  { month: "May", valueMain: 45591, valueSecondary: 36000 },
  { month: "Jun", valueMain: 42000, valueSecondary: 34000 },
  { month: "Jul", valueMain: 48000, valueSecondary: 39000 },
  { month: "Aug", valueMain: 49000, valueSecondary: 41000 },
  { month: "Sep", valueMain: 53000, valueSecondary: 43000 },
  { month: "Oct", valueMain: 60000, valueSecondary: 47000 },
  { month: "Nov", valueMain: 62000, valueSecondary: 49000 },
  { month: "Dec", valueMain: 65000, valueSecondary: 52000 },
];

const fieldAgents = Array(6).fill({
  fieldAgent: "Amor Sharma",
  forms: 39,
});

const barData = [
  { name: "Figma", value: 58, max: 100 },
  { name: "Figma", value: 65, max: 100 },
  { name: "Figma", value: 72, max: 100 },
  { name: "Figma", value: 80, max: 100 },
  { name: "Figma", value: 68, max: 100 },
  { name: "Figma", value: 38, max: 100 },
];

const Dashboard: React.FC = () => {
  const columns = [
    // {
    //   title: <span className="text-lighttext font-semibold">Number of Forms</span>,
    //   dataIndex: "forms",
    //   key: "forms",
    // },
    {
    title: <span className="text-lighttext font-semibold">Field Agent</span>,
      dataIndex: "fieldAgent",
      key: "fieldAgent",
    },
    {
      title: <span className="text-lighttext font-semibold">Number of Forms</span>,
      dataIndex: "forms",
      key: "forms",
    },
    {
      title: <span className="text-lighttext font-semibold">Action</span>,
      key: "action",
      render: () => (
    <div
      className="bg-blue text-white flex gap-2 cursro-pointer items-center rounded-full px-3 py-1 w-fit cursor-pointer"
      onClick={() => navigate(`/dashboard/fieldusers/1`)}
    >
      <EyeOutlined />
      View
    </div>
      ),
    },
  ];
  const pieData = [
  { name: "Approved", value: 82 },
  { name: "Pending", value: 46 },
  { name: "Rejected", value: 10 },
];

const pieColors = ["#6FD195", "#FFAE4C", "#EE6A6C"];

  const renderCenterLabel = ({ viewBox }: any) => {
  const total = pieData.reduce((acc, cur) => acc + cur.value, 0);
  const { cx, cy } = viewBox;
  return (
    <text
      x={cx}
      y={cy}
      
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={24}
      fontWeight="bold"
      fill="#000"
    >
      {total}
    </text>
  );
};


  const renderCustomizedLabel = (props: any) => {
  const { cx, cy, midAngle, outerRadius, name, value, fill } = props;
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill={fill}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={14}
    >
      {name}
      <tspan x={x} dy={14} fontSize={14} fontWeight="500">
        {value}
      </tspan>
    </text>
  );
};


const navigate = useNavigate();
  return (

    <div className="space-y-6">
      {/* Header */}
      {/* <div>
        <Title level={4}>
          Hey Amor Sharma – here’s what’s happening with your store today
        </Title>
      </div> */}

      {/* Stats */}
      <Row gutter={[16, 16]}>
        {summaryStats?.map((item, idx) => (
          <Col xs={24} sm={12} md={6} key={idx}>
            <Card className="shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <Text className="text-lighttext font-medium">{item.title}</Text>
                  <Title className='!mt-2 !text-2xl !font-medium text-textheading' level={3}>{item.value}</Title>
                </div>
                <div className="text-lg font-bold text-blue w-[45px] h-[35px] bg-cardbgblue
                 flex justify-center items-center rounded-lg
                ">{item.icon}</div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      {/* Membership Progress */}
<Card
  className="shadow-md"
  title="Membership Progress"
  extra={
    <div className="space-x-2">
      <Button size="middle" className="text-normaltext font-medium" type="default">12 Months</Button>
      <Button size="middle" className="text-normaltext font-medium" type="text">6 Months</Button>
      <Button size="middle" className="text-normaltext font-medium" type="text">30 Days</Button>
      <Button size="middle" className="text-normaltext font-medium" type="text">7 Days</Button>
    </div>
  }
>
  <ResponsiveContainer width="100%" height={280}>
    <AreaChart
      data={membershipData}
      margin={{ top: 20, right: 12, left: 9, bottom: 0 }}
    >
      {/* Gradient Fills */}
      <defs>
        <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#CBD5E1" stopOpacity={0.3} />
          <stop offset="100%" stopColor="#CBD5E1" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="colorSecondary" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#CBD5E1" stopOpacity={0.2} />
          <stop offset="100%" stopColor="#CBD5E1" stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Axes */}
      <XAxis
      className="ml-4"
        dataKey="month"
        axisLine={false}
        tickLine={false}
        interval={0}      // ✅ forces every tick to display
        tickMargin={10}   // ✅ gives spacing so labels don’t cut
      />
      <YAxis hide />
      <Tooltip
        contentStyle={{
          borderRadius: "8px",
          border: "1px solid #eee",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
        formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
        labelFormatter={(label) => `${label} 2021`}
      />

      {/* Main Area Line */}
      <Area
        type="monotone"
        dataKey="valueMain"
        stroke="#2563EB"
        strokeWidth={2}
        fillOpacity={1}
        fill="url(#colorMain)"
        activeDot={{ r: 6, fill: "#3366ff", strokeWidth: 2, stroke: "#fff" }}
      />

      {/* Secondary Area Line */}
      <Area
        type="monotone"
        dataKey="valueSecondary"
        stroke="#2563EB33"
        strokeWidth={2}
        fillOpacity={1}
        fill="url(#colorSecondary)"
        activeDot={false}
      />
    </AreaChart>
  </ResponsiveContainer>
</Card>
  <Card
      title={
        <div className="my-5">
          <div className="font-semibold  text-base">Field Agent Forms</div>
          <div className="text-lighttext mt-1  text-sm">
            Lorem ipsum dolor sit amet, consectetur adipis.
          </div>
        </div>
      }
extra={
  <Button
    className="!text-blue font-medium flex items-center"
    type="link"
    onClick={() => navigate("/dashboard/fieldusers")}  // ✅ navigate on click
  >
    See All Forms <FaAngleRight />
  </Button>
}
        className="shadow-md"
      >
      <Table
        columns={columns}
        dataSource={fieldAgents.map((f, i) => ({ ...f, key: i }))}
        pagination={false}
        bordered={true}
        style={{ borderRadius: "6px", overflow: "hidden" }}
        rowClassName={() => "custom-row"}
      />
      </Card>

      <Row gutter={[16, 16]}>
        {/* Total Forms Status */}
    <Col xs={24} md={12}>
      <Card
        title="Total Forms Status"
        style={{ borderRadius: "12px", overflow: "hidden" }}
      >
        <ResponsiveContainer width="100%" height={330}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              innerRadius={45}
              outerRadius={120}
              labelLine
              label={renderCustomizedLabel}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index]} />
              ))}
            </Pie>
            {renderCenterLabel({ viewBox: { cx: 265, cy: 166 } })}
          </PieChart>
        </ResponsiveContainer>

        {/* legend at bottom */}
        <div className="flex justify-center gap-6 mt-4">
          {pieData.map((p, i) => (
            <div>

            <Text className="mr-2" key={i} style={{ color: pieColors[i], fontSize: 24 }}>
              ● 
            </Text>
            {p.name}
            </div>
          ))}
        </div>
      </Card>
    </Col>

        {/* MCC Wise Form */}
        <Col xs={24} md={12}>
          <Card title="MCC Wise Form">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                        {/* <Bar dataKey="max" stackId="a" fill="#e6f0ff" />   light blue background */}

                <Bar dataKey="value" fill="#1890ff" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
