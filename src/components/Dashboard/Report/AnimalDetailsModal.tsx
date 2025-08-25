import React from "react";
import { Modal, Row, Col, Form, Image, Button } from "antd";

export type AnimalDetails = {
  aadharNumber: string;
  regDate: string;
  animalType: string;
  breed: string;
  age: string;
  category: string;
  milkProduction: string;
  lactationCount: string;
  pregnantStatus: string;
  tagNumber: string;
  virtualTag: string;
  photos: string[];
};

type Props = {
  open: boolean;
  data: AnimalDetails | null;
  onCancel: () => void;
  onAssign: () => void;
};

const Label: React.FC<{ text: string }> = ({ text }) => (
  <div className="text-gray-500 mb-1">{text}</div>
);

const ReadonlyInput: React.FC<{ value?: string }> = ({ value }) => (
  <input
    value={value}
    readOnly
    className="w-full border-0 border-b border-slate-200 focus:ring-0 focus:outline-none text-gray-800 pb-1"
  />
);

const AnimalDetailsModal: React.FC<Props> = ({ open, data, onCancel, onAssign }) => {
  return (
    <Modal
      title={<div className="text-lg font-semibold text-black text-center">Animal Details</div>}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="assign" type="primary" onClick={onAssign}>
          Assign
        </Button>,
      ]}
      width={900}
      destroyOnClose
    >
      <Form layout="vertical">
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item label={<Label text="Aadhar Number:" />} className="!mb-4">
              <ReadonlyInput value={data?.aadharNumber} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label={<Label text="Animal Registration Date:" />} className="!mb-4">
              <ReadonlyInput value={data?.regDate} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label={<Label text="Animal Type:" />} className="!mb-4">
              <ReadonlyInput value={data?.animalType} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label={<Label text="Breed:" />} className="!mb-4">
              <ReadonlyInput value={data?.breed} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label={<Label text="Age:" />} className="!mb-4">
              <ReadonlyInput value={data?.age} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label={<Label text="Category:" />} className="!mb-4">
              <ReadonlyInput value={data?.category} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label={<Label text="Milk Production:" />} className="!mb-4">
              <ReadonlyInput value={data?.milkProduction} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label={<Label text="Lactation Count:" />} className="!mb-4">
              <ReadonlyInput value={data?.lactationCount} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label={<Label text="Pregnant Status:" />} className="!mb-4">
              <ReadonlyInput value={data?.pregnantStatus} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label={<Label text="Tag Number:" />} className="!mb-4">
              <ReadonlyInput value={data?.tagNumber} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label={<Label text="Virtual Tag:" />} className="!mb-4">
              <ReadonlyInput value={data?.virtualTag} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label={<Label text="Photos:" />} className="!mb-4">
              <div className="flex gap-3">
                {(data?.photos ?? []).map((src, idx) => (
                  <Image
                    key={idx}
                    src={src}
                    width={180}
                    height={110}
                    style={{ objectFit: "cover", borderRadius: 8 }}
                    preview
                  />
                ))}
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AnimalDetailsModal;
