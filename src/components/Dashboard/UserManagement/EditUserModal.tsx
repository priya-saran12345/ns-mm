import { Modal, Form, Select, Input, Switch, Row, Col, Button } from "antd";

type User = {
  id: number;
  name: string;
  username: string;
  role: string;
  // ...other fields if needed
};
type Props = {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onSave?: (payload: any) => void;
};
export default function EditUserModal({ open, onClose, user, onSave }: Props) {
  const [form] = Form.useForm();

  const handleOpen = () => {
    if (user) {
      form.setFieldsValue({
        roleCategory: user.role,
        role: user.role,
        fullName: user.name,
        userName: user.username,
        contact: "",
        address: "",
        password: "",
        confirmPassword: "",
      });
    }
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    onSave?.({ id: user?.id, ...values });
    onClose();
  };

  return (
    <Modal
      title={<div className="text-center text-lg font-semibold">Edit User Details</div>}
      open={open}
      afterOpenChange={(vis) => vis && handleOpen()}
      onCancel={onClose}
      width={900}
      footer={[
        <Button key="cancel" onClick={onClose}>Cancel</Button>,
        <Button key="save" type="primary" className="bg-blue" onClick={handleSave}>
          Create
        </Button>,
      ]}
    >
      <div className="text-sm text-gray-500 mb-2">User Details</div>

      <Form layout="vertical" form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="roleCategory" label="Role Category :">
              <Select placeholder="Select" options={[
                { value: "Admin", label: "Admin" },
                { value: "WebUser", label: "Web User" },
                { value: "AppUser", label: "App User(Field User)" },
              ]} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="role" label="Select Role :">
              <Select
                placeholder="Select"
                options={[
                  { value: "Admin", label: "Admin" },
                  { value: "WebUser", label: "Web User" },
                  { value: "AppUser", label: "App User(Field User)" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="fullName" label="Full Name :">
              <Input placeholder="Enter Full Name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="userName" label="User Name :">
              <Input placeholder="Enter User Name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="contact" label="Contact Number :">
              <Input placeholder="Enter Contact Number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="address" label="User Address :">
              <Input placeholder="Enter User Address" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="password" label="Password :">
              <Input.Password placeholder="Enter Password" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="confirmPassword"
              label="Re-Type Password :"
              dependencies={["password"]}
              rules={[
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

        {/* Permissions grid (with alternating on/off like screenshot) */}
        <div className="text-sm text-gray-500 mt-2 mb-1">Permissions</div>
        <Row gutter={[16, 8]}>
          {Array.from({ length: 10 }).map((_, i) => (
            <Col span={12} key={i}>
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <span>Permission{i + 1}</span>
                <Switch defaultChecked={i % 3 !== 0} />
              </div>
            </Col>
          ))}
        </Row>
      </Form>
    </Modal>
  );
}
