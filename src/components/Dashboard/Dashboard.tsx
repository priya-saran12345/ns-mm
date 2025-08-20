import React from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Progress, Typography, Button, Space } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  RiseOutlined,
  EyeOutlined,
  EditOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  // Mock data for demonstration
  const stats = [
    {
      title: 'Total Users',
      value: 1234,
      icon: <UserOutlined className="text-primary-500" />,
      change: '+12%',
      color: 'primary',
    },
    {
      title: 'Total Orders',
      value: 856,
      icon: <ShoppingCartOutlined className="text-secondary-500" />,
      change: '+8%',
      color: 'secondary',
    },
    {
      title: 'Revenue',
      value: 45670,
      prefix: '$',
      icon: <DollarOutlined className="text-success-500" />,
      change: '+15%',
      color: 'success',
    },
    {
      title: 'Growth',
      value: 23,
      suffix: '%',
      icon: <RiseOutlined className="text-accent-500" />,
      change: '+5%',
      color: 'accent',
    },
  ];

  const recentOrders = [
    {
      key: '1',
      id: 'ORD-001',
      customer: 'John Smith',
      product: 'Premium Package',
      amount: 299,
      status: 'completed',
      date: '2024-01-15',
    },
    {
      key: '2',
      id: 'ORD-002',
      customer: 'Jane Doe',
      product: 'Basic Package',
      amount: 99,
      status: 'pending',
      date: '2024-01-15',
    },
    {
      key: '3',
      id: 'ORD-003',
      customer: 'Bob Johnson',
      product: 'Enterprise Package',
      amount: 599,
      status: 'processing',
      date: '2024-01-14',
    },
    {
      key: '4',
      id: 'ORD-004',
      customer: 'Alice Brown',
      product: 'Standard Package',
      amount: 199,
      status: 'completed',
      date: '2024-01-14',
    },
  ];

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <Text className="font-mono text-sm">{text}</Text>,
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      render: (text: string) => <Text className="font-medium">{text}</Text>,
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => <Text className="font-semibold">${amount}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          completed: 'success',
          pending: 'warning',
          processing: 'processing',
          cancelled: 'error',
        };
        return <Tag color={colors[status]} className="capitalize">{status}</Tag>;
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="text" size="small" icon={<EyeOutlined />} />
          <Button type="text" size="small" icon={<EditOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Title level={2} className="!mb-2">Dashboard</Title>
        <Text type="secondary">Welcome back! Here's what's happening with your business.</Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    valueStyle={{ 
                      fontSize: '24px', 
                      fontWeight: '600',
                      color: `rgb(var(--${stat.color}-500))` 
                    }}
                  />
                  <Text type="success" className="text-sm">
                    {stat.change} from last month
                  </Text>
                </div>
                <div className="text-3xl opacity-20">
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        {/* Recent Orders */}
        <Col xs={24} lg={16}>
          <Card 
            title="Recent Orders" 
            className="border-0 shadow-sm"
            extra={<Button type="primary">View All Orders</Button>}
          >
            <Table
              dataSource={recentOrders}
              columns={columns}
              pagination={{ pageSize: 5, showSizeChanger: false }}
              size="middle"
              className="rounded-lg"
            />
          </Card>
        </Col>

        {/* Performance Metrics */}
        <Col xs={24} lg={8}>
          <div className="space-y-6">
            <Card title="Performance Metrics" className="border-0 shadow-sm">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Text>Sales Target</Text>
                    <Text>75%</Text>
                  </div>
                  <Progress percent={75} strokeColor="#52c41a" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <Text>Customer Satisfaction</Text>
                    <Text>92%</Text>
                  </div>
                  <Progress percent={92} strokeColor="#1890ff" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <Text>Project Completion</Text>
                    <Text>68%</Text>
                  </div>
                  <Progress percent={68} strokeColor="#fa8c16" />
                </div>
              </div>
            </Card>

            <Card title="Quick Actions" className="border-0 shadow-sm">
              <div className="space-y-3">
                <Button type="primary" block>Add New Order</Button>
                <Button block>Manage Users</Button>
                <Button block>View Reports</Button>
                <Button block>Settings</Button>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;