import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Form, InputNumber, Select, message, Tag, Spin } from "antd";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { fetchRolesThunk } from "../Roles/thunk";
import { addApprovalHierarchy, fetchApprovalHierarchyThunk } from "./thunk";

type Props = { isOpen: boolean; onClose: () => void };

type Role = {
  id: number;
  name: string;
  category_id?: number;
  status?: boolean;
  category?: { id: number; name: string };
};

const APPROVAL_CATEGORY_ID = 3;
const APPROVAL_CATEGORY_NAME = "Approval Users";

const AddApprovalHierarchy: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [levelCount, setLevelCount] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);

  // Roles slice shape assumed: { items, loading }
  const { items: allRoles = [], loading: rolesLoading } = useAppSelector((s) => s.roles ?? {});

  // Filter only "Approval Users" roles and active ones
  const approvalRoles: Role[] = (allRoles as Role[]).filter((r) => {
    const isApprovalById = r.category_id === APPROVAL_CATEGORY_ID;
    const isApprovalByName = r.category?.name === APPROVAL_CATEGORY_NAME;
    return (isApprovalById || isApprovalByName) && (r.status ?? true);
  });

  // StrictMode double-run guard
  const didFetch = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      didFetch.current = false;
      return;
    }
    if (didFetch.current) return;

    didFetch.current = true;
    // If your API supports category filters, pass them here; otherwise we filter client-side.
    dispatch(fetchRolesThunk({ path: "roles", page: 1, limit: 100, search: "" }))
      .unwrap()
      .catch(() => {});
  }, [isOpen, dispatch]);

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

      // Final duplicate check (defense-in-depth)
      const chosen: number[] = Array.from({ length: levelCount }, (_, i) => values[`role${i + 1}`]).filter(Boolean);
      const uniq = new Set(chosen);
      if (uniq.size !== chosen.length) {
        message.error("Each level must have a unique role (duplicates found).");
        setSubmitting(false);
        return;
      }

      const body = {
        level: levelCount,
        levels: Array.from({ length: levelCount }, (_, i) => ({
          level: i + 1,
          role_id: values[`role${i + 1}`],
        })),
      };

      await dispatch(addApprovalHierarchy(body)).unwrap();
          await dispatch(fetchApprovalHierarchyThunk({ page: 1, limit: 20, search: "" })).unwrap();

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
      autoFocusButton={null}
      footer={[
        <Button key="cancel" onClick={onClose} htmlType="button">
          Cancel
        </Button>,
        <Button key="add" type="primary" htmlType="button" onClick={handleSubmit} loading={submitting}>
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
            shouldUpdate // rerender when form values change (for disabling options)
            noStyle
          >
            {() => {
              // Build the set of selected role IDs to disable duplicates
              const vals = form.getFieldsValue();
              const selectedIds = new Set<number>(
                Object.keys(vals)
                  .filter((k) => k.startsWith("role"))
                  .map((k) => vals[k])
                  .filter(Boolean)
              );
              const currentFieldName = `role${idx + 1}`;
              const currentValue = vals[currentFieldName];

              return (
                <Form.Item
                  label={
                    <span>
                      Select Role for Level {idx + 1}{" "}
                      <Tag color="blue" style={{ marginLeft: 8 }}>
                        {APPROVAL_CATEGORY_NAME}
                      </Tag>
                    </span>
                  }
                  name={currentFieldName}
                  rules={[{ required: true, message: `Please select a role for level ${idx + 1}` }]}
                >
                  <Select
                    placeholder={`Select Role for Level ${idx + 1}`}
                    showSearch
                    optionFilterProp="children"
                    loading={rolesLoading}
                    notFoundContent={rolesLoading ? <Spin size="small" /> : "No roles"}
                  >
                    {approvalRoles.map((r) => {
                      const disabled = selectedIds.has(r.id) && currentValue !== r.id;
                      return (
                        <Select.Option key={r.id} value={r.id} disabled={disabled}>
                          {r.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              );
            }}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default AddApprovalHierarchy;
