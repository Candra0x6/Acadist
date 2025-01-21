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
import { Palette } from "lucide-react";
import { useSlate } from "slate-react";
import { COLORS } from "../../constants/editor.contants";

export const ColorSelector: React.FC = () => {
  const editor = useSlate();

  const handleColorChange = (color: string) => {
    editor.addMark("color", color);
  };

  return (
    <Select onValueChange={handleColorChange}>
      <SelectTrigger className="w-[100px] h-8">
        <Palette className="w-4 h-4 mr-2" />
        <SelectValue placeholder="Color" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {COLORS.map((color) => (
            <SelectItem
              key={color.value}
              value={color.value}
              className="flex items-center gap-2"
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{
                  backgroundColor: color.value,
                  border:
                    color.value === "inherit" ? "1px solid #e2e8f0" : "none",
                }}
              />
              {color.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
