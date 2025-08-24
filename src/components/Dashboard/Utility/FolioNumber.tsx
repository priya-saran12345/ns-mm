import React, { useState } from "react";
import { Upload, Button, message } from "antd";
import type { UploadProps, RcFile } from "antd/es/upload";
import { InboxOutlined, DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import BradCrumb from "../BreadCrumb";

const ACCEPT =
  ".jpg,.jpeg,.png,.pdf,.mp4"; // matches screenshot text (JPEG, PNG, PDF, MP4)

const MAX_MB = 50;
const MAX_SIZE = MAX_MB * 1024 * 1024;

const MemberCodeImport: React.FC = () => {
  const [file, setFile] = useState<RcFile | null>(null);
  const [importing, setImporting] = useState(false);

  const beforeUpload: UploadProps["beforeUpload"] = (f) => {
    if (!ACCEPT.split(",").some(ext => f.name.toLowerCase().endsWith(ext.trim()))) {
      message.error("Unsupported file type. Use JPEG, PNG, PDF, or MP4.");
      return Upload.LIST_IGNORE;
    }
    if (f.size > MAX_SIZE) {
      message.error(`File is larger than ${MAX_MB}MB.`);
      return Upload.LIST_IGNORE;
    }
    setFile(f as RcFile);
    return false; // prevent auto-upload
  };

  const onRemove = () => {
    setFile(null);
  };

  const handleFormatDownload = () => {
    // sample CSV; change columns if you already have a format
    const csv = "member_code,folio_number\n1100100100101000,12345\n";
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "member_code_format.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (!file) return;
    try {
      setImporting(true);
      // TODO: wire your API here – example:
      // const form = new FormData();
      // form.append("file", file);
      // await api.post("/utilities/member-code/import", form);

      // demo feedback
      await new Promise((r) => setTimeout(r, 900));
      message.success(`Imported: ${file.name}`);
      setFile(null);
    } catch (e) {
      message.error("Import failed. Please try again.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <>
      <BradCrumb />
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Folio Number</h2>
          <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet, consectetur adipis.</p>
        </div>

        <div className="relative  rounded-xl p-4">
          {/* Section header */}
          <div className="text-sm font-medium mb-2">Import Folio Number</div>

          {/* floating avatar circle (optional, matches screenshot vibe) */}

          {/* Drag & Drop zone */}
          <Upload.Dragger
            className=" rounded-xl py-10 hover:!border-blue-400"
            multiple={false}
            accept={ACCEPT}
            beforeUpload={beforeUpload}
            showUploadList={!!file}
            onRemove={onRemove}
            fileList={file ? [file as any] : []}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ fontSize: 26, color: "#94a3b8" }} />
            </p>
            <p className="text-textheading mb-1 font-medium">
              Choose a file or drag &amp; drop it here
            </p>
            <p className="text-lighttext text-xs mb-3">
              JPEG, PNG, PDF, and MP4 formats, up to {MAX_MB}MB
            </p>
            <Button className="font-medium  text-textheading">Browse File</Button>
          </Upload.Dragger>

          {/* footer buttons (right aligned) */}
          <div className="mt-4 flex justify-end gap-2">
            <Button icon={<DownloadOutlined />} className="bg-blue text-white font-medium" onClick={handleFormatDownload}>
              Format Download
            </Button>
            <Button
              type="primary"
              className="bg-blue"
              icon={<UploadOutlined />}
              disabled={!file}
              loading={importing}
              onClick={handleImport}
            >
              Import
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberCodeImport;
