// AssignSectionModal.tsx
import React, { useMemo, useState, useEffect } from "react";
import { Modal, Form, Select, Row, Col, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";

import { fetchRolesThunk } from "../../Master/Roles/thunk";
import { fetchUsersThunk } from "../User_Management/thunks";
import { fetchAssignedPermissionByIdThunk } from "./thunk";

type Option = { label: string; value: string | number };

type Props = {
  open: boolean;
  onClose: () => void;
  defaultRoleValues?: string[];

  sectionOptions?: Option[];
  mccOptions?: Option[];
  getMppOptions?: (mccValue: string) => Option[];

  selectedUserId?: number | string | null;

  onSubmit?: (payload: {
    role: string | number;
    user_id: number | string;
    section_ids: (number | string)[];
    mcc_code: string;
    mpp_code: string;
  }) => void;
};

/* ---------- FALLBACK OPTIONS ---------- */
const FALLBACK_SECTIONS: Option[] = [
  { label: "1. Member Details", value: 1 },
  { label: "2. Address And Contact Details", value: 2 },
  { label: "3. Bank Details", value: 3 },
  { label: "4. Documents", value: 4 },
];

const FALLBACK_MCC: Option[] = [
  { label: "BMC-1", value: "BMC-1" },
  { label: "BMC-2", value: "BMC-2" },
  { label: "MCC-1", value: "MCC-1" },
];

const FALLBACK_MPP_BY_MCC: Record<string, Option[]> = {
  "BMC-1": [
    { label: "001103", value: "001103" },
    { label: "001109", value: "001109" },
  ],
  "BMC-2": [
    { label: "001210", value: "001210" },
    { label: "001304", value: "001304" },
  ],
  "MCC-1": [
    { label: "009001", value: "009001" },
    { label: "009009", value: "009009" },
  ],
};
/* -------------------------------------- */

export default function AssignSectionModal({
  open,
  onClose,
  defaultRoleValues = ["LegalOfficer"],
  sectionOptions,
  mccOptions,
  getMppOptions,
  selectedUserId,
  onSubmit,
}: Props) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [selectedMcc, setSelectedMcc] = useState<string>("");

  const rolesState = useSelector((s: RootState) => s.roles);
  const { items: roles = [], loading: rolesLoading } =
    rolesState ?? { items: [], loading: false };

  const usersState = useSelector((s: RootState) => s.users);
  const { items: users, loading: usersLoading } =
    usersState ?? { items: [], loading: false };

  /* 1. Fetch roles + users when modal opens */
  useEffect(() => {
    if (!open) return;

    if ((!roles || roles.length === 0) && !rolesLoading) {
      dispatch(fetchRolesThunk({ path: "roles", page: 1, limit: 100 }) as any);
    }
    if ((!users || users.length === 0) && !usersLoading) {
      dispatch(
        fetchUsersThunk({ path: "user", page: 1, limit: 100, search: "" }) as any
      );
    }
  }, [open, roles, rolesLoading, users, usersLoading, dispatch]);

  const roleOptionsFromStore: Option[] = useMemo(
    () =>
      (roles || []).map((r: any) => ({
        label: r.name ?? r.role_name ?? r.code ?? `Role ${r.id}`,
        value: r.code ?? r.id,
      })),
    [roles]
  );

  const userOptionsFromStore: Option[] = useMemo(
    () =>
      (users || []).map((u: any) => {
        const name =
          [u.first_name, u.last_name].filter(Boolean).join(" ") ||
          u.username ||
          "User";
        return { label: `${name}`, value: u.id };
      }),
    [users]
  );

  const sectionOpts = sectionOptions ?? FALLBACK_SECTIONS;
  const mccOpts = mccOptions ?? FALLBACK_MCC;

  const mppOpts = useMemo(() => {
    if (!selectedMcc) return [];
    if (getMppOptions) return getMppOptions(selectedMcc);
    return FALLBACK_MPP_BY_MCC[selectedMcc] ?? [];
  }, [selectedMcc, getMppOptions]);

  /* 2. Prefill Role + User for new + edit */
  useEffect(() => {
    if (!open) {
      form.resetFields();
      setSelectedMcc("");
      return;
    }

    const baseValues: any = {};

    // default Role from props
    const def = defaultRoleValues?.[0];
    if (def && roleOptionsFromStore.length) {
      const byValue = roleOptionsFromStore.find(
        (o) => String(o.value).toLowerCase() === String(def).toLowerCase()
      );
      const byLabel = roleOptionsFromStore.find(
        (o) => String(o.label).toLowerCase() === String(def).toLowerCase()
      );
      baseValues.role = (byValue ?? byLabel)?.value;
    }

    // User from selected row (for new assignment)
    if (selectedUserId) {
      baseValues.user = selectedUserId;
    }

    form.setFieldsValue(baseValues);
  }, [open, defaultRoleValues, roleOptionsFromStore, selectedUserId, form]);

  /* 3. When editing existing user assignment -> load details from API and patch form */
  useEffect(() => {
    if (!open || !selectedUserId) return;

    (async () => {
      try {
        const result = await (dispatch(
          fetchAssignedPermissionByIdThunk(selectedUserId) as any
        )).unwrap();

        // result should be AssignedPermission from your API:
        // { user_id, formsteps_ids, mcc_codes, mpp_codes, ... }

        const patch: any = {};

        if (result?.user_id) {
          patch.user = result.user_id;
        }
        if (Array.isArray(result?.formsteps_ids)) {
          patch.sections = result.formsteps_ids;
        }
        if (Array.isArray(result?.mcc_codes) && result.mcc_codes.length > 0) {
          const mcc = result.mcc_codes[0];
          patch.mcc = mcc;
          setSelectedMcc(mcc);
        }
        if (Array.isArray(result?.mpp_codes) && result.mpp_codes.length > 0) {
          patch.mpp = result.mpp_codes[0];
        }

        form.setFieldsValue(patch);
      } catch (e) {
        // ignore — API error will be handled by thunk/slice if needed
      }
    })();
  }, [open, selectedUserId, dispatch, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit?.({
        role: values.role,
        user_id: values.user,
        section_ids: values.sections || [],
        mcc_code: values.mcc,
        mpp_code: values.mpp,
      });
      onClose();
    } catch {
      // validation errors
    }
  };

  const label = (text: string) => (
    <span>
      <span style={{ color: "#ff4d4f", marginRight: 4 }}>*</span>
      {text} :
    </span>
  );

  return (
    <Modal
      title={<div className="text-lg font-semibold">Assign Section To Users</div>}
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="ok"
          type="primary"
          onClick={handleOk}
          loading={rolesLoading || usersLoading}
        >
          Assign
        </Button>,
      ]}
      width={820}
      centered
      destroyOnClose
    >
      <Form layout="vertical" form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="role"
              label={label("Role")}
              rules={[{ required: true, message: "Please select a role" }]}
            >
              <Select
                placeholder={rolesLoading ? "Loading roles..." : "Select Role"}
                options={roleOptionsFromStore}
                loading={rolesLoading}
                showSearch
                optionFilterProp="label"
                disabled={rolesLoading}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="user"
              label={label("User")}
              rules={[{ required: true, message: "Please select a user" }]}
            >
              <Select
                placeholder={usersLoading ? "Loading users..." : "Select User"}
                options={userOptionsFromStore}
                loading={usersLoading}
                showSearch
                optionFilterProp="label"
                disabled={usersLoading}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="sections"
              label={label("Sections")}
              rules={[{ required: true, message: "Please select at least one section" }]}
            >
              <Select
                mode="multiple"
                placeholder="Select Sections"
                options={sectionOpts}
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="mcc"
              label={label("BMC/MCC")}
              rules={[{ required: true, message: "Please select BMC/MCC" }]}
            >
              <Select
                placeholder="Select BMC/MCC"
                options={mccOpts}
                showSearch
                optionFilterProp="label"
                onChange={(v) => {
                  setSelectedMcc(String(v));
                  form.setFieldsValue({ mpp: undefined });
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="mpp"
              label={label("MPP")}
              rules={[{ required: true, message: "Please select an MPP" }]}
            >
              <Select
                placeholder="Select MPP"
                options={mppOpts}
                disabled={!selectedMcc}
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
