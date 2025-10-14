// src/modules/UserManagement/Roles/pages/EditRoleModal.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Modal, Form, Select, Input, Button, Spin, Alert, message } from "antd";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { fetchRoleByIdThunk, updateRoleThunk } from "./thunk"; // <- adjust path if different
import { clearSelected } from "./slice";
// categories (for the Category select)
import { fetchCategoriesThunk } from "../../Master/Category/thunk";
type OptionNum = { label: string; value: number };
type OptionBool = { label: string; value: boolean };
const STATUS_OPTIONS: OptionBool[] = [
  { label: "Active", value: true },
  { label: "Inactive", value: false },
];

type Props = {
  open: boolean;
  roleId: number | null;
  onClose: () => void;
  /** optional: refresh list after save */
  onSaved?: () => void | Promise<void>;
};

const EditRoleModal: React.FC<Props> = ({ open, roleId, onClose, onSaved }) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  // roles slice (for selected role + loading states)
  const { selected, detailLoading, detailError, updateLoading } = useAppSelector(
    (s: any) => s.roles
  );

  // categories slice (for dropdown)
  const { items: categories = [], loading: catLoading } = useAppSelector(
    (s: any) => s.category || { items: [], loading: false }
  );

  // Fetch the single role when opened
  useEffect(() => {
    if (open && roleId) {
      dispatch(fetchRoleByIdThunk({ path: "roles", id: roleId })).unwrap().catch(() => {});
    }
    if (!open) {
      form.resetFields();
      dispatch(clearSelected());
    }
  }, [open, roleId, dispatch]); // eslint-disable-line

  // If categories not in store, fetch them (once) when modal opens
  useEffect(() => {
    if (!open) return;
    if (!categories.length) {
      dispatch(fetchCategoriesThunk({ path: "categories", page: 1, limit: 100 }))
        .unwrap()
        .catch(() => {});
    }
  }, [open, categories.length, dispatch]);

  // Build category options
  const categoryOptions: OptionNum[] = useMemo(
    () =>
      (categories || [])
        .filter((c: any) => c?.status !== false)
        .map((c: any) => ({ label: c.name, value: c.id })),
    [categories]
  );

  // Prefill form when the selected role is loaded/changes
  useEffect(() => {
    if (!selected) return;
    form.setFieldsValue({
      name: selected.name ?? "",
      category_id: selected.category_id ?? selected.category?.id,
      status: !!selected.status,
    });
  }, [selected, form]);

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const v = await form.validateFields();
    if (!roleId) return;

    try {
      setSaving(true);
      await dispatch(
        updateRoleThunk({
          path: "roles",
          id: roleId,
          body: {
            name: v.name,
            category_id: v.category_id,
            status: v.status,
          },
        })
      ).unwrap();

      message.success("Role updated successfully");
      await onSaved?.();
      onClose();
    } catch (e: any) {
      message.error(e?.message || "Failed to update role");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={<span className="text-lg font-semibold">Edit Role</span>}
      open={open}
      onCancel={onClose}
      destroyOnClose
      footer={[
        <Button key="cancel" onClick={onClose} disabled={saving}>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          className="bg-blue"
          onClick={handleSave}
          loading={saving || updateLoading}
        >
          Update
        </Button>,
      ]}
    >
      {detailLoading ? (
        <div className="py-4">
          <Spin /> <span className="ml-2">Loading role…</span>
        </div>
      ) : detailError ? (
        <Alert type="error" message={detailError} className="mb-3" />
      ) : (
        <Form layout="vertical" form={form} className="mt-2">
          <Form.Item
            label={<span className="font-medium">Category :</span>}
            name="category_id"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select
              placeholder={
                catLoading && !categories.length ? "Loading categories..." : "Select category"
              }
              options={categoryOptions}
              loading={catLoading && !categories.length}
              disabled={catLoading && !categories.length}
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-medium">Role Name :</span>}
            name="name"
            rules={[{ required: true, message: "Please enter a role name" }]}
          >
            <Input placeholder="Enter role name" />
          </Form.Item>

          <Form.Item
            label={<span className="font-medium">Status :</span>}
            name="status"
            rules={[{ required: true }]}
          >
            <Select options={STATUS_OPTIONS} />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default EditRoleModal;
