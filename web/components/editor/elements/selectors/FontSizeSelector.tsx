"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSlate } from "slate-react";
import { FONT_SIZES } from "../../constants/editor.contants";

export const FontSizeSelector: React.FC = () => {
  const editor = useSlate();

  const handleFontSizeChange = (size: string) => {
    editor.addMark("fontSize", size);
  };

  return (
    <Select onValueChange={handleFontSizeChange}>
      <SelectTrigger className="w-[80px] h-8">
        <SelectValue placeholder="12" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {FONT_SIZES.map((size) => (
            <SelectItem key={size} value={size}>
              {size}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
