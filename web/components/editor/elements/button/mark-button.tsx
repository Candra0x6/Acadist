"use client";

import { useSlate } from "slate-react";
import { Button } from "@/components/ui/button";
import { BlockButtonProps } from "../../types/editor.types";
import { toggleMark, isMarkActive } from "../../utils/editor";

export const MarkButton: React.FC<BlockButtonProps> = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      variant={isMarkActive(editor, format) ? "default" : "ghost"}
      size="icon"
      className="w-8 h-8"
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon}
    </Button>
  );
};
