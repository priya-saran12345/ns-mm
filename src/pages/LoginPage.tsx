import React from "react";
import { Form, Input, Button, Typography } from "antd";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux.hooks";
import { loginUser } from "../store/authThunks";
import { LoginCredentials } from "../types/auth.types";
import loginimage from "../images/login-bg.png";
const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const [form] = Form.useForm();

  const handleLogin = async (values: LoginCredentials) => {
    try {
      await dispatch(loginUser(values)).unwrap();
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen  flex">
      {/* Left Section (Image) */}
      {/* <div
        className="hidden md:flex w-1/2 bg-cover bg-center"
      > */}
      <div className="hidden bg-black h-[100vh] md:flex min-w-1/2">
        <img src={loginimage} alt="Login" className="w-full h-full bg-cover " />
      </div>

      {/* </div> */}

      {/* Right Section (Form) */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-8">
        <div className="max-w-md w-full">
          <Title level={2} className="!mb-2 !font-bold text-textheading">
            Dudiya MMES
          </Title>
          <Text className="text-normaltext text-md">
            Clarity gives you the blocks and components you need to create a
            truly professional website.
          </Text>

          <Form
            form={form}
            name="login"
            onFinish={handleLogin}
            layout="vertical"
            size="large"
            className="mt-4"
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
                // prefix={<UserOutlined className="text-neutral-400" />}
                // placeholder="Enter your email"
                className="rounded-lg !bg-[#CBD5E1] border-cardbgblue"
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
                rootClassName="rounded-lg !bg-[#CBD5E1] border border-cardbgblue"
                iconRender={(visible) =>
                  visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            {/* Login Button */}
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
