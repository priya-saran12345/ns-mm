import React from "react";
import { Form, Input, Button, Typography, Alert } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux.hooks";
import { loginUser } from "../store/authThunks";
import { LoginCredentials } from "../types/auth.types";
import loginimage from "../images/login-bg.png";
const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((s) => s.auth);
  const [form] = Form.useForm();

  // if user was redirected here from a protected route, go back there
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const handleLogin = async (values: LoginCredentials) => {
    try {
      await dispatch(loginUser(values)).unwrap();
      navigate(from, { replace: true });
    } catch (err) {
      // error already in slice -> shown via <Alert/>
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left image */}
      <div className="hidden bg-black h-[100vh] md:flex min-w-1/2">
        <img src={loginimage} alt="Login" className="w-full h-full bg-cover" />
      </div>

      {/* Right form */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-8">
        <div className="max-w-md w-full">
          <Title level={2} className="!mb-2 !font-bold text-textheading">
            Dudiya MMES
          </Title>
          <Text className="text-normaltext text-md">
            Clarity gives you the blocks and components you need to create a truly professional website.
          </Text>

          {error ? (
            <Alert className="mt-4" type="error" message={error} showIcon />
          ) : null}

          <Form
            form={form}
            name="login"
            onFinish={handleLogin}
            layout="vertical"
            size="large"
            className="mt-4"
          >
            <Form.Item
              name="email"
              label="Email ID"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input className="rounded-lg !bg-[#CBD5E1] border-cardbgblue" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please input your password!" }]}
            >
              <Input.Password
                rootClassName="rounded-lg !bg-[#CBD5E1] border border-cardbgblue"
                iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                className="w-fit h-11 rounded-full bg-blue"
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

export default LoginPage;
