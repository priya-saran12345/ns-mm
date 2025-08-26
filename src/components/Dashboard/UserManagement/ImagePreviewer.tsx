import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Space, Tooltip } from "antd";
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  ReloadOutlined,
  CloseOutlined,
} from "@ant-design/icons";

type Props = {
  open: boolean;
  src?: string;
  onClose: () => void;
  title?: string;
};

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export default function ImagePreviewer({ open, src, onClose, title }: Props) {
  const imgWrapRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState(1);         // 1 = 100%
  const [tx, setTx] = useState(0);             // translate X
  const [ty, setTy] = useState(0);             // translate Y
  const [drag, setDrag] = useState(false);
  const start = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  const reset = () => {
    setZoom(1);
    setTx(0);
    setTy(0);
  };

  useEffect(() => {
    if (open) reset();
  }, [open, src]);

  const onWheel: React.WheelEventHandler = (e) => {
    e.preventDefault();
    const delta = -e.deltaY; // up = zoom in
    const step = delta > 0 ? 0.1 : -0.1;
    setZoom((z) => clamp(Number((z + step).toFixed(2)), 0.2, 5));
  };

  const onMouseDown: React.MouseEventHandler = (e) => {
    setDrag(true);
    start.current = { x: e.clientX, y: e.clientY, tx, ty };
  };
  const onMouseMove: React.MouseEventHandler = (e) => {
    if (!drag) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    setTx(start.current.tx + dx);
    setTy(start.current.ty + dy);
  };
  const onMouseUp = () => setDrag(false);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      closable={false}
      bodyStyle={{ padding: 0 }}
      destroyOnClose
    >
      <div className="relative bg-black">
        {/* Close button (top-right) */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-20 text-white/90 hover:text-white bg-black/40 rounded-full w-9 h-9 flex items-center justify-center"
          aria-label="Close preview"
        >
          <CloseOutlined />
        </button>

        {/* Canvas */}
        <div
          ref={imgWrapRef}
          className="w-full h-[70vh] flex items-center justify-center overflow-hidden select-none cursor-grab active:cursor-grabbing"
          onWheel={onWheel}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseUp}
          onMouseUp={onMouseUp}
          onDoubleClick={() => setZoom((z) => (z < 1.5 ? 2 : 1))}
        >
          {src ? (
            <img
              src={src}
              alt={title || "preview"}
              draggable={false}
              style={{
                transform: `translate(${tx}px, ${ty}px) scale(${zoom})`,
                transformOrigin: "center center",
                transition: drag ? "none" : "transform 120ms ease",
                maxWidth: "100%",
                maxHeight: "100%",
                userSelect: "none",
                pointerEvents: "none",
              }}
            />
          ) : null}
        </div>

        {/* Toolbar (bottom-center) */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
          <Space size="middle">
            <Tooltip title="Zoom In">
              <Button
                icon={<ZoomInOutlined />}
                onClick={() => setZoom((z) => clamp(Number((z + 0.2).toFixed(2)), 0.2, 5))}
              />
            </Tooltip>
            <Tooltip title="Zoom Out">
              <Button
                icon={<ZoomOutOutlined />}
                onClick={() => setZoom((z) => clamp(Number((z - 0.2).toFixed(2)), 0.2, 5))}
              />
            </Tooltip>
            <Tooltip title="Reset">
              <Button icon={<ReloadOutlined />} onClick={reset} />
            </Tooltip>
          </Space>
        </div>
      </div>
    </Modal>
  );
}
