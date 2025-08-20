import React from 'react';
import { Form, Input, Button, Card, Typography, Alert, Divider } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux.hooks';
import { loginUser } from '../store/authThunks';
import { LoginCredentials } from '../types/auth.types';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [form] = Form.useForm();

  const handleLogin = async (values: LoginCredentials) => {
    try {
      await dispatch(loginUser(values)).unwrap();
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl border-0">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserOutlined className="text-2xl text-white" />
          </div>
          <Title level={2} className="!mb-2">Welcome Back</Title>
          <Text type="secondary">Sign in to your ERP account</Text>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            className="mb-4 rounded-lg"
          />
        )}

        <Form
          form={form}
          name="login"
          onFinish={handleLogin}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-neutral-400" />}
              placeholder="Enter your email"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-neutral-400" />}
              placeholder="Enter your password"
              className="rounded-lg"
              iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              className="w-full rounded-lg h-12 bg-primary-500 border-primary-500 hover:bg-primary-600 hover:border-primary-600"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <Divider className="my-6">
          <Text type="secondary">Demo Credentials</Text>
        </Divider>

        <div className="bg-neutral-50 rounded-lg p-4 mb-6 text-sm">
          <div className="grid grid-cols-1 gap-2">
            <div>
              <Text strong>Admin:</Text> admin@erp.com / admin123
            </div>
            <div>
              <Text strong>User:</Text> user@erp.com / user123
            </div>
          </div>
        </div>

        <div className="text-center">
          <Text type="secondary">
            Don't have an account?{' '}
            <Link to="/auth/signup" className="font-semibold text-primary-500 hover:text-primary-600">
              Sign up
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;