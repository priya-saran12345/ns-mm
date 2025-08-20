import React from 'react';
import { Form, Input, Button, Card, Typography, Alert, Divider } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hooks';
import { signupUser } from '../../store/authThunks';
import { SignupCredentials } from '../../types/auth.types';

const { Title, Text } = Typography;

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [form] = Form.useForm();

  const handleSignup = async (values: SignupCredentials) => {
    try {
      await dispatch(signupUser(values)).unwrap();
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-accent-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl border-0">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserOutlined className="text-2xl text-white" />
          </div>
          <Title level={2} className="!mb-2">Create Account</Title>
          <Text type="secondary">Join our ERP system today</Text>
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
          name="signup"
          onFinish={handleSignup}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please input your full name!' }]}
          >
            <Input
              prefix={<UserOutlined className="text-neutral-400" />}
              placeholder="Enter your full name"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-neutral-400" />}
              placeholder="Enter your email"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-neutral-400" />}
              placeholder="Enter your password"
              className="rounded-lg"
              iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-neutral-400" />}
              placeholder="Confirm your password"
              className="rounded-lg"
              iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              className="w-full rounded-lg h-12 bg-secondary-500 border-secondary-500 hover:bg-secondary-600 hover:border-secondary-600"
            >
              Create Account
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center">
          <Text type="secondary">
            Already have an account?{' '}
            <Button type="link" onClick={onSwitchToLogin} className="p-0 font-semibold text-secondary-500">
              Sign in
            </Button>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default SignupForm;