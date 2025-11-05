import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Form, InputNumber, Select, message } from "antd";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { fetchRolesThunk } from "../Roles/thunk";
import { addApprovalHierarchy } from "./thunk";

type Props = { isOpen: boolean; onClose: () => void };

const AddApprovalHierarchy: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [levelCount, setLevelCount] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);

  // Roles slice mirrors your Roles list page shape
  const { items: roles = [], loading: rolesLoading } = useAppSelector((s) => s.roles ?? {});

  // Dev StrictMode double-run guard
  const didFetch = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      didFetch.current = false;
      return;
    }
    if (didFetch.current) return;
    if (rolesLoading) return;
    if (roles.length > 0) return;

    didFetch.current = true;
    dispatch(fetchRolesThunk({ path: "roles", page: 1, limit: 100, search: "" }))
      .unwrap()
      .catch(() => {});
  }, [isOpen, roles.length, rolesLoading, dispatch]);

  const handleLevelCountChange = (value: number | null) => {
    setLevelCount(value ?? 1);
    const vals = form.getFieldsValue();
    const toReset = Object.keys(vals)
      .filter((k) => k.startsWith("role"))
      .map((k) => ({ name: k, value: undefined }));
    if (toReset.length) form.setFields(toReset);
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const values = await form.validateFields();
      const body = {
        // API expects `level` (count) + `levels` array. No `name`.
        level: levelCount,
        levels: Array.from({ length: levelCount }, (_, i) => ({
          level: i + 1,
          role_id: values[`role${i + 1}`],
        })),
      };

      await dispatch(addApprovalHierarchy(body)).unwrap();

      message.success("Approval hierarchy added successfully!");
      form.resetFields();
      setLevelCount(1);
      onClose();
    } catch (e: any) {
      message.error(e?.message || "Failed to add approval hierarchy");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Add Approval Hierarchy"
      open={isOpen}
      onCancel={onClose}
      destroyOnClose
      autoFocusButton={null} // prevent Enter from "auto-clicking" primary
      footer={[
        <Button key="cancel" onClick={onClose} htmlType="button">
          Cancel
        </Button>,
        <Button
          key="add"
          type="primary"
          htmlType="button"
          onClick={handleSubmit}
          loading={submitting}
        >
          Add Hierarchy
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ levelCount: 1 }}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault(); // block accidental submits
        }}
      >
        <Form.Item label="Select Number of Levels" name="levelCount" rules={[{ required: true }]}>
          <InputNumber min={1} max={4} onChange={handleLevelCountChange} style={{ width: "100%" }} />
        </Form.Item>

        {Array.from({ length: levelCount }).map((_, idx) => (
          <Form.Item
            key={idx}
            label={`Select Role for Level ${idx + 1}`}
            name={`role${idx + 1}`}
            rules={[{ required: true, message: `Please select a role for level ${idx + 1}` }]}
          >
            <Select
              placeholder={`Select Role for Level ${idx + 1}`}
              showSearch
              optionFilterProp="children"
              loading={rolesLoading}
            >
              {roles.map((r: any) => (
                <Select.Option key={r.id} value={r.id}>
                  {r.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default AddApprovalHierarchy;
