// src/modules/UserManagement/components/RegisterUserModal.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Modal, Form, Select, Input, Row, Col, Button } from "antd";
import { useAppDispatch, useAppSelector } from "../../../../store/store";

// ✅ thunks to load roles & categories
import { fetchRolesThunk } from "../../Master/Roles/thunk";
import { fetchCategoriesThunk } from "../../Master/Category/thunk";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate?: (payload: {
    email: string;
    password: string;
    role_id: number;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
  }) => void | Promise<void>;
};

type OptionNum = { label: string; value: number };

export default function RegisterUserModal({ open, onClose, onCreate }: Props) {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  // ----- categories slice -----
  const { items: categories = [], loading: categoriesLoading } = useAppSelector(
    (s: any) => s.categories || { items: [], loading: false }
  );

  // ----- roles slice -----
  const { items: roles = [], loading: rolesLoading } = useAppSelector(
    (s: any) => s.roles || { items: [], loading: false }
  );

  // local: selected category id to filter roles (keep for future use)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [creating, setCreating] = useState(false);

  // fetch categories & roles when modal opens if not already loaded
  useEffect(() => {
    if (!open) return;
    if (!categories.length) {
      dispatch(fetchCategoriesThunk({ path: "categories", page: 1, limit: 100 }))
        .unwrap()
        .catch(() => {});
    }
    if (!roles.length) {
      dispatch(fetchRolesThunk({ path: "roles", page: 1, limit: 100 }))
        .unwrap()
        .catch(() => {});
    }
  }, [open, categories.length, roles.length, dispatch]);

  // reset form & local state when modal closes
  useEffect(() => {
    if (!open) {
      form.resetFields();
      setSelectedCategoryId(undefined);
      setCreating(false);
    }
  }, [open, form]);

  // category options (if/when you re-enable Category select)
  const categoryOptions: OptionNum[] = useMemo(
    () =>
      (categories || [])
        .filter((c: any) => c?.status !== false)
        .map((c: any) => ({ label: c.name, value: c.id })),
    [categories]
  );

  // role options filtered by category; if no category chosen, show all active roles
  const roleOptions: OptionNum[] = useMemo(() => {
    const list = (roles || []).filter((r: any) => r?.status !== false);
    if (!selectedCategoryId) {
      return list.map((r: any) => ({ label: r.name, value: r.id }));
    }
    return list
      .filter((r: any) => {
        const cid = r.category_id ?? r.category?.id ?? null;
        return cid === selectedCategoryId;
      })
      .map((r: any) => ({ label: r.name, value: r.id }));
  }, [roles, selectedCategoryId]);

  const handleCreate = async () => {
    const v = await form.validateFields();

    const payload = {
      email: (v.email || "").trim(),
      password: v.password,
      role_id: v.role_id as number,
      firstName: (v.firstName || "").trim(),
      lastName: (v.lastName || "").trim(),
      phone: (v.phone || "").trim(),
      address: (v.address || "").trim(),
    };

    try {
      setCreating(true);
      await onCreate?.(payload);
      // DO NOT close here; parent will close after success
    } finally {
      setCreating(false);
    }
  };

  return (
    <Modal
      title={<div className="text-center text-lg font-semibold">Register A New User</div>}
      open={open}
      onCancel={onClose}
      width={900}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={creating}>
          Cancel
        </Button>,
        <Button
          key="create"
          type="primary"
          className="bg-blue"
          onClick={handleCreate}
          loading={creating}
        >
          Create
        </Button>,
      ]}
      destroyOnClose
    >
      <div className="text-sm text-gray-500 mb-2">User Details</div>

      <Form layout="vertical" form={form}>
        <Row gutter={16}>
          {/* Category (optional; uncomment if you want to filter roles by category)
          <Col span={12}>
            <Form.Item
              name="category_id"
              label="Role Category :"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select
                placeholder={categoriesLoading && !categories.length ? "Loading categories..." : "Select"}
                options={categoryOptions}
                loading={categoriesLoading && !categories.length}
                disabled={categoriesLoading && !categories.length}
                showSearch
                optionFilterProp="label"
                onChange={(cid: number) => {
                  setSelectedCategoryId(cid);
                  form.setFieldsValue({ role_id: undefined });
                }}
              />
            </Form.Item>
          </Col>
          */}

          {/* Role */}
          <Col span={12}>
            <Form.Item
              name="role_id"
              label="Select Role :"
              rules={[{ required: true, message: "Please select a role" }]}
            >
              <Select
                placeholder={rolesLoading && !roles.length ? "Loading roles..." : "Select"}
                options={roleOptions}
                loading={rolesLoading && !roles.length}
                disabled={rolesLoading && !roles.length}
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
          </Col>

          {/* First Name */}
          <Col span={12}>
            <Form.Item
              name="firstName"
              label="First Name :"
              rules={[{ required: true, message: "Please enter first name" }]}
            >
              <Input placeholder="Enter First Name" />
            </Form.Item>
          </Col>

          {/* Last Name */}
          <Col span={12}>
            <Form.Item
              name="lastName"
              label="Last Name :"
              rules={[{ required: true, message: "Please enter last name" }]}
            >
              <Input placeholder="Enter Last Name" />
            </Form.Item>
          </Col>

          {/* Email */}
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email :"
              rules={[{ required: true, type: "email", message: "Invalid email" }]}
            >
              <Input placeholder="Enter Email" />
            </Form.Item>
          </Col>

          {/* Phone */}
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Contact Number :"
              rules={[{ required: true, message: "Please enter contact number" }]}
            >
              <Input placeholder="Enter Contact Number" />
            </Form.Item>
          </Col>

          {/* Address */}
          <Col span={12}>
            <Form.Item
              name="address"
              label="User Address :"
              rules={[{ required: true, message: "Please enter address" }]}
            >
              <Input placeholder="Enter User Address" />
            </Form.Item>
          </Col>

          {/* Password / Confirm */}
          <Col span={12}>
            <Form.Item
              name="password"
              label="Password :"
              rules={[{ required: true, message: "Please enter password" }]}
            >
              <Input.Password placeholder="Enter Password" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="confirmPassword"
              label="Re-Type Password :"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please re-type password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) return Promise.resolve();
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Enter Re-Type Password" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
