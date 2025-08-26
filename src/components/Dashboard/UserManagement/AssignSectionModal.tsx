import { Modal, Form, Row, Col, Select, Button, Tag } from "antd";
import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  defaultRoleValues?: string[];
  onAssign?: (payload: any) => void;
};

const sectionOptions = [
  { value: "1", label: "1. Member Details" },
  { value: "2", label: "2. Address And Contact Details" },
  { value: "3", label: "3. Milk Production And Consumption" },
  { value: "4", label: "4. Bank Details" },
  { value: "5", label: "5. Documents" },
  { value: "6", label: "6. Pricing / Rate" },
  { value: "7", label: "7. Payments & Dues" },
  { value: "8", label: "8. Misc" },
];

const bluePill = (props: any) => {
  const { label, closable, onClose } = props;
  return (
    <Tag
      closable={closable}
      onClose={onClose}
      style={{
        background: "#246BFD",
        color: "#fff",
        border: "none",
        borderRadius: 999,
        padding: "2px 10px",
        marginRight: 8,
        marginTop: 6,
      }}
    >
      {label}
    </Tag>
  );
};

export default function AssignSectionModal({
  open,
  onClose,
  defaultRoleValues,
  onAssign,
}: Props) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue({
        role: defaultRoleValues && defaultRoleValues[0] ? defaultRoleValues[0] : undefined,
        users: undefined,
        sections: ["1", "2"], // like screenshot (two selected)
        bmcmcc: undefined,
        mpp: undefined,
      });
    }
  }, [open]);

  const handleAssign = async () => {
    const values = await form.validateFields();
    onAssign?.(values);
    onClose();
  };
  return (
    <Modal
      title={<div className="text-center text-lg font-semibold">Assign Section To Users</div>}
      open={open}
      onCancel={onClose}
      width={900}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="assign" type="primary" className="bg-blue" onClick={handleAssign}>
          Assign
        </Button>,
      ]}
    >
      <Form layout="vertical" form={form}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="role" label="Role :" rules={[{ required: true }]}>
              <Select
                placeholder="Select Role"
                options={[
                  { value: "Admin", label: "Admin" },
                  { value: "AreaOfficer", label: "Area Officer" },
                  { value: "LegalOfficer", label: "Legal Officer" },
                  { value: "FinanceOfficer", label: "Finance Officer" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="users" label="User :" rules={[{ required: true }]}>
              <Select
                mode="multiple"
                placeholder="Select Users"
                options={[
                  { value: "1", label: "Admin" },
                  { value: "2", label: "Kaushikee(CS)" },
                  { value: "3", label: "kaushikeemilk" },
                  { value: "4", label: "test" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="sections" label="Sections :" rules={[{ required: true }]}>
              <Select
                mode="multiple"
                placeholder="Select Sections"
                options={sectionOptions}
                tagRender={bluePill}
                maxTagCount="responsive"
                dropdownMatchSelectWidth
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="bmcmcc" label="BMC/MCC :" rules={[{ required: true }]}>
              <Select
                placeholder="BMC/MCC"
                options={[
                  { value: "BMC-1", label: "BMC-1" },
                  { value: "BMC-2", label: "BMC-2" },
                  { value: "MCC-1", label: "MCC-1" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="mpp" label="MPP :" rules={[{ required: true }]}>
              <Select
                placeholder="Select MPP"
                options={[
                  { value: "MPP-1", label: "MPP-1" },
                  { value: "MPP-2", label: "MPP-2" },
                  { value: "MPP-3", label: "MPP-3" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
