import React, { useMemo, useState, useEffect } from "react";
import { Modal, Form, Select, Row, Col, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";

/** === Thunks: adjust import paths if needed === */
import { fetchRolesThunk } from "../../Master/Roles/thunk";
import { fetchUsersThunk } from "../User_Management/thunks"; // 👈 your users list thunk

type Option = { label: string; value: string | number };

type Props = {
  open: boolean;
  onClose: () => void;
  defaultRoleValues?: string[];

  sectionOptions?: Option[];
  mccOptions?: Option[];
  getMppOptions?: (mccValue: string) => Option[];

  onSubmit?: (payload: {
    role: string | number;
    user_id: number | string;
    section_ids: (number | string)[];
    mcc_code: string;
    mpp_code: string;
  }) => void;
};

/** --------- fallbacks only for sections/MCC/MPP --------- */
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

export default function AssignSectionModal({
  open,
  onClose,
  defaultRoleValues = ["LegalOfficer"],
  sectionOptions,
  mccOptions,
  getMppOptions,
  onSubmit,
}: Props) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [selectedMcc, setSelectedMcc] = useState<string>("");

  /** ----- ROLES from Redux (assumes reducer key: roles) ----- */
  const rolesState = useSelector((s: RootState) => s.roles);
  const { items: roles = [], loading: rolesLoading } = rolesState ?? { items: [], loading: false };

  /** ----- USERS from Redux (assumes reducer key: users) ----- */
  const usersState = useSelector((s: RootState) => s.users);
  const {
    items: users ,
    loading: usersLoading,
  } = usersState ?? { items: [], loading: false };

  /** Fetch roles + users when modal opens */
  useEffect(() => {
    if (!open) return;
    if ((!roles || roles.length === 0) && !rolesLoading) {
      dispatch(fetchRolesThunk({ path: "roles", page: 1, limit: 100 }) as any);
    }
    if ((!users || users.length === 0) && !usersLoading) {
      // change "user" to your actual path if different
      dispatch(fetchUsersThunk({ path: "user", page: 1, limit: 100, search: "" }) as any);
    }
  }, [open, roles, rolesLoading, users, usersLoading, dispatch]);

  /** Map roles to options */
  const roleOptionsFromStore: Option[] = useMemo(
    () =>
      (roles || []).map((r: any) => ({
        label: r.name ?? r.role_name ?? r.code ?? `Role ${r.id}`,
        value: r.code ?? r.id,
      })),
    [roles]
  );

  /** Map users to options (name + email). Adjust to your user shape. */
  const userOptionsFromStore: Option[] = useMemo(
    () =>
      (users || []).map((u: any) => {
        const name =
          [u.first_name, u.last_name].filter(Boolean).join(" ") || u.username || "User";
        // const email = u.email ? ` (${u.email})` : "";
        return { label: `${name}`, value: u.id };
      }),
    [users]
  );

  /** Use provided lists/fallbacks for remaining selects */
  const sectionOpts = sectionOptions ?? FALLBACK_SECTIONS;
  const mccOpts = mccOptions ?? FALLBACK_MCC;

  const mppOpts = useMemo(() => {
    if (!selectedMcc) return [];
    if (getMppOptions) return getMppOptions(selectedMcc);
    return FALLBACK_MPP_BY_MCC[selectedMcc] ?? [];
  }, [selectedMcc, getMppOptions]);

  /** Prefill Role from defaultRoleValues */
  useEffect(() => {
    if (open) {
      const def = defaultRoleValues?.[0];
      let prefill: string | number | undefined = undefined;
      if (def && roleOptionsFromStore.length) {
        const byValue = roleOptionsFromStore.find(
          (o) => String(o.value).toLowerCase() === String(def).toLowerCase()
        );
        const byLabel = roleOptionsFromStore.find(
          (o) => String(o.label).toLowerCase() === String(def).toLowerCase()
        );
        prefill = (byValue ?? byLabel)?.value;
      }
      form.setFieldsValue({ role: prefill });
    } else {
      form.resetFields();
      setSelectedMcc("");
    }
  }, [open, defaultRoleValues, roleOptionsFromStore, form]);

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
      /* validation errors */
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
                placeholder={usersLoading ? "Loading users..." : "Select Users"}
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
                placeholder="BMC/MCC"
                options={mccOpts}
                onChange={(v) => {
                  setSelectedMcc(String(v));
                  form.setFieldsValue({ mpp: undefined });
                }}
                showSearch
                optionFilterProp="label"
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
