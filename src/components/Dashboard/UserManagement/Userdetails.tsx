import React, { useState } from "react";
import { Row, Col, Form, Input, Card, Button } from "antd";
import BradCrumb from "../BreadCrumb";
import DocTile from "./DocTile";
import ImagePreviewer from "./ImagePreviewer";

/* demo images */
const IMAGES = {
  profile: "https://i.pravatar.cc/300?img=12",
  signature: "https://dummyimage.com/600x300/ffffff/0a0a0a.png&text=Signature",
  aadhaarFront: "https://images.unsplash.com/photo-1601905392237-8a2f9b499d4a?q=80&w=1200&auto=format&fit=crop",
  aadhaarBack: "https://images.unsplash.com/photo-1520975922215-c0e1c2619a4c?q=80&w=1200&auto=format&fit=crop",
  pan: "https://images.unsplash.com/photo-1532171875345-9712d9d4f6f2?q=80&w=1200&auto=format&fit=crop",
};

const STEPS = ["Step 1","Step 2","Step 3","Step 4","Step 5","Step 6","Step 7","Step 8"];

export default function MemberViewWithKyc() {
  const [form] = Form.useForm();
  const [active, setActive] = useState(0);            // which step is open
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string>();

  const openPreview = (src: string) => { setPreviewSrc(src); setPreviewOpen(true); };
  const prev = () => setActive((s) => Math.max(0, s - 1));
  const next = () => setActive((s) => Math.min(STEPS.length - 1, s + 1));

  /* ---- per-step content (random demo fields as requested) ---- */
  const StepContent = () => {
    switch (active) {
      case 0:
        return (
          <>
            <Row gutter={16}>
              <Col span={6}><Form.Item label="Form No."><Input value="G7405" readOnly /></Form.Item></Col>
              <Col span={6}><Form.Item label="Application Name"><Input value="TEST" readOnly /></Form.Item></Col>
              <Col span={6}><Form.Item label="Second Name"><Input value="Smith" readOnly /></Form.Item></Col>
              <Col span={6}><Form.Item label="Husband/Father's Name"><Input value="Husband" readOnly /></Form.Item></Col>

              <Col span={6}><Form.Item label="Gender"><Input value="Female" readOnly /></Form.Item></Col>
              <Col span={6}><Form.Item label="DOB"><Input value="12-05-1992" readOnly /></Form.Item></Col>
              <Col span={6}><Form.Item label="Cast"><Input value="SC/ST/OBC" readOnly /></Form.Item></Col>
              <Col span={6}><Form.Item label="Education"><Input value="8th" readOnly /></Form.Item></Col>

              <Col span={6}><Form.Item label="Aadhaar Card No."><Input value="887262872873788" readOnly /></Form.Item></Col>
              <Col span={6}><Form.Item label="Pan Card No."><Input value="A2B9YUZ678Y3X3" readOnly /></Form.Item></Col>
            </Row>

            <Row gutter={[16,16]} className="mt-2">
              <Col xs={24} md={8}>
                <DocTile label="Profile Pic" src={IMAGES.profile} ratio="square" onClick={() => openPreview(IMAGES.profile)} />
              </Col>
              <Col xs={24} md={8}>
                <DocTile label="Signature" src={IMAGES.signature} onClick={() => openPreview(IMAGES.signature)} />
              </Col>
              <Col xs={24} md={8}>
                <DocTile label="Member Aadhaar card - front" src={IMAGES.aadhaarFront} onClick={() => openPreview(IMAGES.aadhaarFront)} />
              </Col>
              <Col xs={24} md={8}>
                <DocTile label="Member Aadhaar card - back" src={IMAGES.aadhaarBack} onClick={() => openPreview(IMAGES.aadhaarBack)} />
              </Col>
              <Col xs={24} md={8}>
                <DocTile label="Member PAN card" src={IMAGES.pan} onClick={() => openPreview(IMAGES.pan)} />
              </Col>
            </Row>
          </>
        );
      case 1:
        return (
          <Row gutter={16}>
            <Col span={8}><Form.Item name={["kyc","motherName"]} label="Mother's Name"><Input placeholder="Enter name" /></Form.Item></Col>
            <Col span={8}><Form.Item name={["kyc","maritalStatus"]} label="Marital Status"><Input placeholder="Single/Married" /></Form.Item></Col>
            <Col span={8}><Form.Item name={["kyc","nationality"]} label="Nationality"><Input placeholder="Indian" /></Form.Item></Col>
          </Row>
        );
      case 2:
        return (
          <Row gutter={16}>
            <Col span={12}><Form.Item name={["addr","currentAddress"]} label="Current Address"><Input placeholder="House, Street, City" /></Form.Item></Col>
            <Col span={6}><Form.Item name={["addr","pincode"]} label="Pincode"><Input placeholder="110001" /></Form.Item></Col>
            <Col span={6}><Form.Item name={["addr","state"]} label="State"><Input placeholder="Rajasthan" /></Form.Item></Col>
          </Row>
        );
      case 3:
        return (
          <Row gutter={16}>
            <Col span={8}><Form.Item name={["bank","accountName"]} label="Account Holder"><Input placeholder="Name as per bank" /></Form.Item></Col>
            <Col span={8}><Form.Item name={["bank","accountNo"]} label="Account Number"><Input placeholder="XXXX XXXX XXXX" /></Form.Item></Col>
            <Col span={8}><Form.Item name={["bank","ifsc"]} label="IFSC"><Input placeholder="HDFC0001234" /></Form.Item></Col>
          </Row>
        );
      case 4:
        return (
          <Row gutter={16}>
            <Col span={8}><Form.Item name={["farm","animals"]} label="No. of Milch Animals"><Input placeholder="e.g., 5" /></Form.Item></Col>
            <Col span={8}><Form.Item name={["farm","avgYield"]} label="Avg Milk Yield (L/day)"><Input placeholder="e.g., 12.5" /></Form.Item></Col>
            <Col span={8}><Form.Item name={["farm","preferredShift"]} label="Preferred Shift"><Input placeholder="M / E" /></Form.Item></Col>
          </Row>
        );
      case 5:
        return (
          <Row gutter={16}>
            <Col span={12}><Form.Item name={["pricing","rateCode"]} label="Rate Code"><Input placeholder="RC-2025-01" /></Form.Item></Col>
            <Col span={12}><Form.Item name={["pricing","withEffect"]} label="WEF Date"><Input placeholder="YYYY-MM-DD" /></Form.Item></Col>
          </Row>
        );
      case 6:
        return (
          <Row gutter={16}>
            <Col span={12}><Form.Item name={["refs","ref1"]} label="Reference 1"><Input placeholder="Name & Phone" /></Form.Item></Col>
            <Col span={12}><Form.Item name={["refs","ref2"]} label="Reference 2"><Input placeholder="Name & Phone" /></Form.Item></Col>
          </Row>
        );
      default:
        return (
          <Row gutter={16}>
            <Col span={24}><Form.Item name="notes" label="Notes / Remarks"><Input.TextArea rows={4} placeholder="Anything important…" /></Form.Item></Col>
          </Row>
        );
    }
  };

  return (
    <>
      <BradCrumb />
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">View Member Details</h2>

        <Card className="mb-6" bodyStyle={{ paddingTop: 16 }}>
          {/* clickable stepper */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {STEPS.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setActive(i)}
                className={`text-xs px-3 py-1 rounded-full border transition ${
                  i === active
                    ? "bg-[#246BFD] text-white border-[#246BFD]"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            ))}
            <div className="ml-auto">
              <div className="w-14 h-14 rounded-full border-4 border-white shadow -mt-6 overflow-hidden">
                <img src={IMAGES.profile} alt="profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* per-step form content */}
          <Form layout="vertical" form={form}>
            <StepContent />
          </Form>

          {/* nav buttons */}
          <div className="mt-4 flex justify-between">
            <Button onClick={prev} disabled={active === 0}>Back</Button>
            <div className="flex gap-2">
              <Button onClick={() => console.log("Draft:", form.getFieldsValue(true))}>
                Save Draft
              </Button>
              <Button type="primary" className="bg-blue" onClick={next} disabled={active === STEPS.length - 1}>
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* image preview modal */}
      <ImagePreviewer
        open={previewOpen}
        src={previewSrc}
        onClose={() => setPreviewOpen(false)}
        title="Document Preview"
      />
    </>
  );
}
