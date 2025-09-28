// src/modules/UserManagement/components/EditUserModal.tsx
import React, { useEffect } from "react";
import { Modal, Form, Select, Input, Switch, Row, Col, Button, Spin, Alert, message } from "antd";
import { clearSelected } from "./slice";
import { useAppDispatch,useAppSelector } from "../../../../store/store";
import {fetchUserByIdThunk ,updateUserThunk} from "./thunks";
type Props = {
  open: boolean;
  onClose: () => void;
  userId: number | null;
};

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "web_user", label: "Web User" },
  { value: "field_user", label: "App User (Field User)" },
];

export default function EditUserModal({ open, onClose, userId }: Props) {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const { selected, detailLoading, detailError, updateLoading } = useAppSelector((s) => s.users);

  useEffect(() => {
    if (open && userId) {
      dispatch(fetchUserByIdThunk({ path: "/api/v1/user", id: userId }));
    }
    if (!open) {
      form.resetFields();
      dispatch(clearSelected());
    }
  }, [open, userId, dispatch]); // eslint-disable-line

  useEffect(() => {
    if (selected) {
      form.setFieldsValue({
        username: selected.username ?? "",
        email: selected.email ?? "",
        role: selected.role ?? undefined,
        first_name: selected.first_name ?? "",
        last_name: selected.last_name ?? "",
        address: selected.address ?? "",
        city: selected.city ?? "",
        state: selected.state ?? "",
        country: selected.country ?? "",
        zip_code: selected.zip_code ?? "",
        is_block: !!selected.is_block,
        status: !!selected.status,
      });
    }
  }, [selected, form]);

  const handleSave = async () => {
    const values = await form.validateFields();

    // Shape exactly as you provided for PUT
    const body = {
      username: values.username,
      email: values.email,
      role: values.role,
      first_name: values.first_name,
      last_name: values.last_name,
      address: values.address,
      city: values.city || undefined,
      state: values.state || undefined,
      country: values.country || undefined,
      zip_code: values.zip_code || undefined,
      is_block: !!values.is_block,
      status: !!values.status,
    };

    try {
      await dispatch(updateUserThunk({ path: "/api/v1/user", id: userId!, body })).unwrap();
      message.success("User updated successfully");
      onClose();
    } catch (e: any) {
      message.error(e ?? "Failed to update user");
    }
  };

  return (
    <Modal
      title={<div className="text-center text-lg font-semibold">Edit User Details</div>}
      open={open}
      onCancel={onClose}
      width={900}
      footer={[
        <Button key="cancel" onClick={onClose}>Cancel</Button>,
        <Button key="save" type="primary" className="bg-blue" onClick={handleSave} loading={updateLoading}>
          Save
        </Button>,
      ]}
      destroyOnClose
    >
      {detailLoading && (
        <div className="my-4">
          <Spin /> <span className="ml-2">Loading user…</span>
        </div>
      )}
      {detailError && <Alert type="error" message={detailError} className="mb-3" />}

      <div className="text-sm text-gray-500 mb-2">User Details</div>

      <Form layout="vertical" form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="role" label="Role :" rules={[{ required: true, message: "Role is required" }]}>
              <Select placeholder="Select" options={ROLE_OPTIONS} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="username" label="User Name :" rules={[{ required: true, message: "Username is required" }]}>
              <Input placeholder="Enter User Name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="first_name" label="First Name :" rules={[{ required: true, message: "First name is required" }]}>
              <Input placeholder="Enter First Name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="last_name" label="Last Name :" rules={[{ required: true, message: "Last name is required" }]}>
              <Input placeholder="Enter Last Name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="email" label="Email :" rules={[{ type: "email", message: "Invalid email" }]}>
              <Input placeholder="Enter Email" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="address" label="Address :">
              <Input placeholder="Enter Address" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="city" label="City :">
              <Input placeholder="Enter City" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="state" label="State :">
              <Input placeholder="Enter State" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="country" label="Country :">
              <Input placeholder="Enter Country" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="zip_code" label="Zip Code :">
              <Input placeholder="Enter Zip Code" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="is_block" label="Blocked :" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="status" label="Active :" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        {/* Permissions placeholder, keep if you need it */}
        {/* <div className="text-sm text-gray-500 mt-2 mb-1">Permissions</div> */}
      </Form>
    </Modal>
  );
}
