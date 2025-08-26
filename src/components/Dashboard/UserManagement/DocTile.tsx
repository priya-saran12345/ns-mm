import React from "react";

type Props = {
  label: string;
  src: string;
  onClick: () => void;
  ratio?: "square" | "wide" | "tall";
};

export default function DocTile({ label, src, onClick, ratio = "wide" }: Props) {
  const ratioClass =
    ratio === "square"
      ? "aspect-square"
      : ratio === "tall"
      ? "aspect-[4/5]"
      : "aspect-[16/9]";

  return (
    <div className="border rounded-lg p-3">
      <div className="text-sm text-gray-500 mb-2">{label}</div>
      <button
        onClick={onClick}
        className={`w-full ${ratioClass} overflow-hidden rounded-md border bg-gray-50 hover:shadow transition`}
      >
        <img
          src={src}
          alt={label}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </button>
    </div>
  );
}
