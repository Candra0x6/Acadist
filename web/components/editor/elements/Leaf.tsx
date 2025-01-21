"use client";

import React from "react";
import { CustomText } from "../types/editor.types";

interface LeafProps {
  attributes: any;
  children: React.ReactNode;
  leaf: CustomText;
}

export const Leaf: React.FC<LeafProps> = ({ attributes, children, leaf }) => {
  const style: React.CSSProperties = {
    fontSize: leaf.fontSize ? `${leaf.fontSize}px` : undefined,
    color: leaf.color || undefined,
  };

  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.code)
    children = (
      <code className="bg-gray-100 rounded px-1 font-mono">{children}</code>
    );
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;
  if (leaf.strikethrough) children = <s>{children}</s>;
  if (leaf.subscript) children = <sub>{children}</sub>;
  if (leaf.superscript) children = <sup>{children}</sup>;

  return (
    <span {...attributes} style={style}>
      {children}
    </span>
  );
};
