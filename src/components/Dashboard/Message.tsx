// src/components/MessageModal.tsx
import React from "react";
import { Modal, Button } from "antd";
import {
  DeleteFilled,
  ExclamationCircleFilled,
  CheckCircleFilled,
  InfoCircleFilled,
} from "@ant-design/icons";

type Variant = "delete" | "warning" | "success" | "info";

export interface MessageModalProps {
  open: boolean;
  variant: Variant;
  title?: string;
  message: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  confirmText?: string; // default changes by variant
  cancelText?: string;  // default changes by variant
  closable?: boolean;   // default true
}

const variantConfig: Record<
  Variant,
  { color: string; bg: string; Icon: React.ReactNode; defTitle: string; defConfirm: string; defCancel?: string }
> = {
  delete: {
    color: "#ef4444", // red
    bg: "#fee2e2",
    Icon: <DeleteFilled />,
    defTitle: "Delete",
    defConfirm: "Delete",
    defCancel: "Cancel",
  },
  warning: {
    color: "#f59e0b", // yellow
    bg: "#fef3c7",
    Icon: <ExclamationCircleFilled />,
    defTitle: "Warning!",
    defConfirm: "Proceed",
    defCancel: "Cancel",
  },
  success: {
    color: "#22c55e", // green
    bg: "#dcfce7",
    Icon: <CheckCircleFilled />,
    defTitle: "Success!",
    defConfirm: "Okay!",
  },
  info: {
    color: "#3b82f6", // blue
    bg: "#dbeafe",
    Icon: <InfoCircleFilled />,
    defTitle: "Info!",
    defConfirm: "Ok",
  },
};

export default function MessageModal({
  open,
  variant,
  title,
  message,
  onCancel,
  onConfirm,
  confirmText,
  cancelText,
  closable = true,
}: MessageModalProps) {
  const cfg = variantConfig[variant];
  const showCancel = variant === "delete" || variant === "warning";

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      closable={closable}
      width={520}
      bodyStyle={{ padding: 0, borderRadius: 12, overflow: "hidden" }}
    >
      <div className="p-6">
        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
             style={{ background: cfg.bg, color: cfg.color, fontSize: 28 }}>
          {cfg.Icon}
        </div>

        <div className="text-center mt-4">
          <div className="text-lg font-semibold">{title ?? cfg.defTitle}</div>
          <div className="text-gray-600 mt-2">{message}</div>
          {variant === "delete" && (
            <div className="text-red-500 text-sm mt-2">
              This action is permanent and cannot be undone!
            </div>
          )}
        </div>

        <div className="flex bg-chartbg items-center justify-end gap-2 mt-6">
          {showCancel && (
            <Button onClick={onCancel}>{cancelText ?? cfg.defCancel}</Button>
          )}
          <Button
            type="primary"
            className={
              variant === "delete"
                ? "bg-red-500"
                : variant === "warning"
                ? "bg-yellow-500 border-0"
                : variant === "success"
                ? "bg-green-500"
                : "bg-blue-500"
            }
            onClick={onConfirm}
          >
            {confirmText ?? cfg.defConfirm}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
