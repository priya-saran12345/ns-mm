// src/modules/UserManagement/Roles/pages/AddRoleModal.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Modal, Form, Select, Input, Button } from "antd";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { fetchCategoriesThunk } from "../Category/thunk";

export type OptionNum = { label: string; value: number };
export type OptionBool = { label: string; value: boolean };

export type AddRoleFormValues = {
  category_id: number;
  name: string;
  status: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AddRoleFormValues) => Promise<void> | void;
  /** Optional – will default to Active/Inactive if omitted */
  statusOptions?: OptionBool[];
  /** Optional: pre-select category; defaults to first available */
  defaultCategoryId?: number;
};

const DEFAULT_STATUS_OPTIONS: OptionBool[] = [
  { label: "Active", value: true },
  { label: "Inactive", value: false },
];

const AddRoleModal: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  statusOptions,
  defaultCategoryId,
}) => {
  const [form] = Form.useForm<AddRoleFormValues>();
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useAppDispatch();

  // Grab categories from slice
  const { items: catItems = [], loading: catLoading } = useAppSelector(
    (s: any) => s.category || { items: [], loading: false }
  );

  // Fetch categories on open if not already there
  useEffect(() => {
    if (!open) return;
    if (!catItems.length) {
      dispatch(fetchCategoriesThunk({ path: "categories", page: 1, limit: 100 }))
        .unwrap()
        .catch(() => {});
    }
  }, [open, catItems.length, dispatch]);

  // Derive Select options (active only)
  const derivedOptions: OptionNum[] = useMemo(
    () =>
      (catItems || [])
        .filter((c: any) => c?.status !== false)
        .map((c: any) => ({ label: c.name, value: c.id })),
    [catItems]
  );

  // Initialize defaults when modal opens and options are ready
  useEffect(() => {
    if (!open) {
      form.resetFields();
      return;
    }
    if (catLoading) return; // wait until categories loaded

    const firstCat = defaultCategoryId ?? derivedOptions?.[0]?.value;
    form.setFieldsValue({
      category_id: firstCat,
      status: true,
    } as Partial<AddRoleFormValues>);
  }, [open, form, defaultCategoryId, derivedOptions, catLoading]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      await onSubmit(values);
      setSubmitting(false);
      onClose();
      form.resetFields();
    } catch {
      setSubmitting(false);
    }
  };

  const effectiveStatusOptions =
    statusOptions?.length ? statusOptions : DEFAULT_STATUS_OPTIONS;

  return (
    <Modal
      title={<span className="text-lg font-semibold">Add New Role</span>}
      open={open}
      onCancel={() => {
        if (!submitting) onClose();
      }}
      destroyOnClose
      footer={[
        <Button key="cancel" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>,
        <Button
          key="add"
          type="primary"
          className="bg-blue"
          onClick={handleOk}
          loading={submitting}
        >
          Add Role
        </Button>,
      ]}
    >
      <Form<AddRoleFormValues> layout="vertical" form={form} className="mt-2 flex w-full gap-3 ">
        <Form.Item
          label={<span className="font-medium">Category :</span>}
          name="category_id"
          rules={[{ required: true, message: "Please select a category" }]}

          className="w-1/2"
        >
          <Select
            options={derivedOptions}
            placeholder={catLoading ? "Loading categories..." : "Select category"}
            showSearch
            optionFilterProp="label"
            loading={catLoading && !catItems.length}
            disabled={catLoading && !catItems.length}
          />
        </Form.Item>

        <Form.Item
          label={<span className="font-medium">Role Name :</span>}
          name="name"
          rules={[
            { required: true, message: "Please enter a role name" },
            { min: 2, message: "Role name must be at least 2 characters" },
          ]}
                    className="w-1/2"

        >
          <Input placeholder="Enter role name" />
        </Form.Item>

        {/* <Form.Item
          label={<span className="font-medium">Status :</span>}
          name="status"
          rules={[{ required: true }]}
          initialValue={true}
        >
          <Select options={effectiveStatusOptions} />
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default AddRoleModal;
