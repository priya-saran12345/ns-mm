// EditApprovalHierarchy.tsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Select, message } from "antd";
import { useDispatch } from "react-redux";
import { fetchRolesThunk, updateApprovalHierarchy } from "./thunk"; // Assuming you have these thunks

const EditApprovalHierarchy = ({ isOpen, onClose, hierarchyData }: { isOpen: boolean, onClose: () => void, hierarchyData: any }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [roles, setRoles] = useState<any[]>([]); // Array to store roles

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchRolesThunk()).then((response: any) => {
        setRoles(response.payload); // Assuming your API returns a list of roles
      });
      form.setFieldsValue(hierarchyData); // Set form values to existing hierarchy data
    }
  }, [isOpen, dispatch, hierarchyData]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedHierarchyData = {
        id: hierarchyData.id, // Preserve the id of the hierarchy
        name: hierarchyData.name,
        level: hierarchyData.level,
        levels: Array.from({ length: hierarchyData.level }).map((_, i) => ({
          level: i + 1,
          role_id: values[`role${i + 1}`],
        })),
      };
      dispatch(updateApprovalHierarchy(updatedHierarchyData));
      message.success("Approval Hierarchy updated successfully!");
      onClose();
    } catch (error) {
      message.error("Failed to update Approval Hierarchy");
    }
  };

  return (
    <Modal
      title="Edit Approval Hierarchy"
      visible={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Cancel</Button>,
        <Button key="save" type="primary" onClick={handleSubmit}>Save Changes</Button>
      ]}
    >
      <Form form={form} layout="vertical">
        {Array.from({ length: hierarchyData.level }).map((_, index) => (
          <Form.Item
            key={index}
            label={`Level ${index + 1} Role`}
            name={`role${index + 1}`}
            rules={[{ required: true, message: `Please select a role for level ${index + 1}` }]}
          >
            <Select placeholder={`Select Role for Level ${index + 1}`}>
              {roles.map(role => (
                <Select.Option key={role.id} value={role.id}>
                  {role.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default EditApprovalHierarchy;
