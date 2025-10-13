// src/pages/auth/LoginForm.tsx
import React from "react";
import { Form, Input, Button, Typography, Alert } from "antd";
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hooks";
import { loginUser } from "../../store/authThunks";
import type { LoginCredentials } from "../../types/auth.types";
import loginimage from "../../images/login-bg.png";

const { Title } = Typography;

interface LoginFormProps {
  onSwitchToSignup?: () => void;
}

// Optional: narrow type for location.state usage
type LocationState = { from?: string } | null;

const LoginForm: React.FC<LoginFormProps> = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error } = useAppSelector((s) => s.auth as { isLoading: boolean; error: string | null });
  const [form] = Form.useForm<LoginCredentials>();

  const handleLogin = async (values: LoginCredentials) => {
    const res = await dispatch(loginUser(values));
    if (loginUser.fulfilled.match(res)) {
      const state = (location.state as LocationState) ?? null;
      const to = state?.from ?? "/dashboard";
      navigate(to, { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Image */}
      <div className="hidden md:flex w-1/2">
        <img src={loginimage} alt="Login" className="w-full h-full object-cover" />
      </div>

      {/* Right Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-8">
        <div className="max-w-md w-full">
          <Title level={2} className="!mb-2">Dudiya MMES</Title>

          {error && <Alert type="error" showIcon message={error} className="mb-4" />}

          <Form<LoginCredentials>
            form={form}
            name="login"
            onFinish={handleLogin}
            layout="vertical"
            size="large"
            className="mt-6"
            initialValues={{ email: "", password: "" }}
          >
            <Form.Item
              name="email"
              label="Email ID"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-neutral-400" />}
                placeholder="Enter your email"
                className="rounded-lg"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please input your password!" }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-neutral-400" />}
                placeholder="Enter your password"
                className="rounded-lg"
                iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                htmlType="submit"
                loading={isLoading}
                className="w-fit h-11 bg-[#2563EB] text-white rounded-full"
              >
                Log In →
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
