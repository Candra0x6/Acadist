"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useSlate } from "slate-react";
import { BlockButtonProps } from "../../types/editor.types";
import { isBlockActive, toggleBlock } from "../../utils/editor";
import { TEXT_ALIGN_TYPES } from "../../constants/editor.contants";

export const HeadingButton: React.FC<BlockButtonProps> = ({ format, icon }) => {
  const editor = useSlate();

  return (
    <Button
      variant={
        isBlockActive(
          editor,
          format,
          TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
        )
          ? "default"
          : "ghost"
      }
      size="icon"
      className="w-[100px] h-[50px] border-r border-muted-foreground rounded-none"
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {icon}
    </Button>
  );
};
