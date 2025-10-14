// src/modules/UserManagement/components/EditUserModal.tsx
import React, { useEffect, useMemo } from "react";
import { Modal, Form, Select, Input, Switch, Row, Col, Button, Spin, Alert, message } from "antd";
import { clearSelected } from "./slice";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { fetchUserByIdThunk, updateUserThunk } from "./thunks";

// 👇 import roles list thunk from Roles state
import { fetchRolesThunk } from "../../Master/Roles/thunk";

type Props = {
  open: boolean;
  onClose: () => void;
  userId: number | null;
};

type OptionNum = { label: string; value: number };

export default function EditUserModal({ open, onClose, userId }: Props) {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  // ----- users slice (current user detail) -----
  const { selected, detailLoading, detailError, updateLoading } = useAppSelector((s: any) => s.users);

  // ----- roles slice (for dropdown) -----
  const { items: roleItems = [], loading: rolesLoading } = useAppSelector((s: any) => s.roles || { items: [], loading: false });

  // Build Select options from roles slice (active only if you want)
  const roleOptions: OptionNum[] = useMemo(
    () =>
      (roleItems || [])
        .filter((r: any) => r?.status !== false)
        .map((r: any) => ({ label: r.name, value: r.id })),
    [roleItems]
  );

  // Load current user on open; cleanup on close
  useEffect(() => {
    if (open && userId) {
      dispatch(fetchUserByIdThunk({ path: "user", id: userId }));
    }
    if (!open) {
      form.resetFields();
      dispatch(clearSelected());
    }
  }, [open, userId, dispatch]); // eslint-disable-line

  // When modal opens, if roles not in store, fetch them
  useEffect(() => {
    if (!open) return;
    if (!roleItems.length) {
      dispatch(fetchRolesThunk({ path: "roles", page: 1, limit: 100 }))
        .unwrap()
        .catch(() => {});
    }
  }, [open, roleItems.length, dispatch]);

  // Prefill form when selected user or role options change
  useEffect(() => {
    if (!selected) return;

    // prefer numeric role_id; fallback to nested userRole.id
    const roleId: number | undefined =
      (selected.role_id as number | undefined) ??
      (selected.userRole?.id as number | undefined);

    form.setFieldsValue({
      // username: selected.username ?? "",
      email: selected.email ?? "",
      role: roleId, // Select expects the role id
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
  }, [selected, form, roleOptions]);

  const handleSave = async () => {
    const values = await form.validateFields();

    // send role_id (number) to backend; keep rest same as your shape
    const body = {
      email: values.email,
      role_id: values.role, // <-- important: send numeric role id
      firstName: values.first_name,
      lastName: values.last_name,
      address: values.address,
      city: values.city || undefined,
      state: values.state || undefined,
      country: values.country || undefined,
      zip_code: values.zip_code || undefined,
      is_block: !!values.is_block,
      status: !!values.status,
    };

    try {
      await dispatch(updateUserThunk({ path: "user", id: userId!, body })).unwrap();
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
            <Form.Item
              name="role"
              label="Role :"
              rules={[{ required: true, message: "Role is required" }]}
            >
              <Select
                placeholder={rolesLoading && !roleItems.length ? "Loading roles..." : "Select"}
                options={roleOptions}
                loading={rolesLoading && !roleItems.length}
                disabled={rolesLoading && !roleItems.length}
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
          </Col>

          {/* <Col span={12}>
            <Form.Item name="username" label="User Name :" rules={[{ required: true, message: "Username is required" }]}>
              <Input placeholder="Enter User Name" />
            </Form.Item>
          </Col> */}

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

          {/* If you need them later:
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
          </Col> */}

          {/* <Col span={12}>
            <Form.Item name="is_block" label="Blocked :" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col> */}
          <Col span={12}>
            <Form.Item name="status" label="Active :" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
