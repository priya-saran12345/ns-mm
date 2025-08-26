import { Modal, Form, Select, Input, Switch, Row, Col, Button } from "antd";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate?: (payload: any) => void;
};

export default function RegisterUserModal({ open, onClose, onCreate }: Props) {
  const [form] = Form.useForm();

  const handleCreate = async () => {
    const values = await form.validateFields();
    onCreate?.(values);
    onClose();
  };

  return (
    <Modal
      title={<div className="text-center text-lg font-semibold">Register A New User</div>}
      open={open}
      onCancel={onClose}
      width={900}
      footer={[
        <Button key="cancel" onClick={onClose}>Cancel</Button>,
        <Button key="create" type="primary" className="bg-blue" onClick={handleCreate}>
          Create
        </Button>,
      ]}
    >
      {/* Top section title (User Details) like screenshot */}
      <div className="text-sm text-gray-500 mb-2">User Details</div>

      <Form layout="vertical" form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="roleCategory" label="Role Category :" rules={[{ required: true }]}>
              <Select placeholder="Select" options={[
                { value: "Admin", label: "Admin" },
                { value: "WebUser", label: "Web User" },
                { value: "AppUser", label: "App User(Field User)" },
              ]} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="role" label="Select Role :" rules={[{ required: true }]}>
              <Select placeholder="Select" options={[
                { value: "Admin", label: "Admin" },
                { value: "WebUser", label: "Web User" },
                { value: "AppUser", label: "App User(Field User)" },
              ]} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="fullName" label="Full Name :" rules={[{ required: true }]}>
              <Input placeholder="Enter Full Name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="userName" label="User Name :" rules={[{ required: true }]}>
              <Input placeholder="Enter User Name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="contact" label="Contact Number :" rules={[{ required: true }]}>
              <Input placeholder="Enter Contact Number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="address" label="User Address :" rules={[{ required: true }]}>
              <Input placeholder="Enter User Address" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="password" label="Password :" rules={[{ required: true }]}>
              <Input.Password placeholder="Enter Password" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="confirmPassword" label="Re-Type Password :" dependencies={["password"]} rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) return Promise.resolve();
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}>
              <Input.Password placeholder="Enter Re-Type Password" />
            </Form.Item>
          </Col>
        </Row>

        {/* Permissions grid */}
        <div className="text-sm text-gray-500 mt-2 mb-1">Permissions</div>
        <Row gutter={[16, 8]}>
          {Array.from({ length: 10 }).map((_, i) => (
            <Col span={12} key={i}>
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <span>Permission{i + 1}</span>
                <Switch defaultChecked={i % 2 === 1} />
              </div>
            </Col>
          ))}
        </Row>
      </Form>
    </Modal>
  );
}
