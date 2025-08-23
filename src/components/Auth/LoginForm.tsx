import React from "react";
import { Form, Input, Button, Typography, Image } from "antd";
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hooks";
import { loginUser } from "../../store/authThunks";
import { LoginCredentials } from "../../types/auth.types";
import loginimage from "../../images/login-bg.png";

const { Title, Text } = Typography;

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const [form] = Form.useForm();

  const handleLogin = async (values: LoginCredentials) => {
    try {
      await dispatch(loginUser(values)).unwrap();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side Image */}
      <div className="hidden md:flex w-1/2">
            <img src={loginimage} alt="Login" className="w-full h-full object-cover" />
      </div>

      {/* Right Side Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-8">
        <div className="max-w-md w-full">
          <Title level={2} className="!mb-2">
            Dudiya MMES
          </Title>
          {/* <Text className="text-gray-500">
            Clarity gives you the blocks and components you need to create a
            truly professional website.
          </Text> */}

          <Form
            form={form}
            name="login"
            onFinish={handleLogin}
            layout="vertical"
            size="large"
            className="mt-8"
          >
            {/* Email */}
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
              />
            </Form.Item>

            {/* Password */}
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-neutral-400" />}
                placeholder="Enter your password"
                className="rounded-lg"
                iconRender={(visible) =>
                  visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            {/* Log In Button */}
            <Form.Item>
              <Button
                // type="primary"
                htmlType="submit"
                loading={isLoading}
                className="w-fit h-11 
                bg-[#2563EB] rounded-full "
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
