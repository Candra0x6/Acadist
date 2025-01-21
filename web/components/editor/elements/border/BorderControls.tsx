"use client";
import React, { useState } from "react";
import { Editor, Transforms, Element as SlateElement } from "slate";
import { BorderProperties, BorderStyle } from "../../types/editor.types";
import {
  BORDER_STYLES,
  BORDER_WIDTHS,
  DEFAULT_BORDER,
} from "../../constants/editor.contants";
import { Button } from "@/components/ui/button";
import {
  TbBorderAll,
  TbBorderBottom,
  TbBorderInner,
  TbBorderLeft,
  TbBorderNone,
  TbBorderOuter,
  TbBorderRight,
  TbBorderTop,
} from "react-icons/tb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const BorderControls: React.FC<{ editor: Editor }> = ({ editor }) => {
  const [showBorderControls, setShowBorderControls] = useState(false);
  const [selectedBorderColor, setSelectedBorderColor] = useState("#000000");
  const [selectedBorderStyle, setSelectedBorderStyle] =
    useState<BorderStyle>("solid");
  const [selectedBorderWidth, setSelectedBorderWidth] = useState(1);

  const applyBorder = (borderType: string) => {
    const { selection } = editor;
    if (!selection) return;

    const borderProps = {
      style: selectedBorderStyle,
      width: selectedBorderWidth,
      color: selectedBorderColor,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    };

    const newBorders: BorderProperties = {};

    switch (borderType) {
      case "all":
        newBorders.top = borderProps;
        newBorders.bottom = borderProps;
        newBorders.left = borderProps;
        newBorders.right = borderProps;
        break;
      case "outer":
        newBorders.top = borderProps;
        newBorders.bottom = borderProps;
        newBorders.left = borderProps;
        newBorders.right = borderProps;
        break;
      case "inner":
        // Apply only to selected nodes that are not on the edges
        break;
      case "none":
        newBorders.top = { ...DEFAULT_BORDER, style: "none" };
        newBorders.bottom = { ...DEFAULT_BORDER, style: "none" };
        newBorders.left = { ...DEFAULT_BORDER, style: "none" };
        newBorders.right = { ...DEFAULT_BORDER, style: "none" };
        break;
      default:
        newBorders[borderType as keyof BorderProperties] = borderProps;
    }

    Transforms.setNodes(
      editor,
      { borders: newBorders },
      { match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) }
    );
  };

  const updatePadding = (
    side: "top" | "bottom" | "left" | "right",
    value: number
  ) => {
    const { selection } = editor;
    if (!selection) return;

    Transforms.setNodes(
      editor,
      {
        borders: {
          // @ts-expect-error - This is a hack to get around the type error
          ...((Editor.getNodes(editor)[0] as any).borders || {}),
          padding: {
            // @ts-expect-error - This is a hack to get around the type error
            ...((Editor.getNodes(editor)[0] as any).borders?.padding || {}),
            [side]: value,
          },
        },
      },
      { match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) }
    );
  };

  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={() => setShowBorderControls(!showBorderControls)}
      >
        <TbBorderAll className="w-4 h-4" />
      </Button>

      {showBorderControls && (
        <div className="absolute z-10 mt-10 p-4 bg-white border-secondary rounded-lg shadow-lg border">
          <div className="grid grid-cols-3 gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyBorder("all")}
            >
              <TbBorderAll className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyBorder("outer")}
            >
              <TbBorderOuter className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyBorder("none")}
            >
              <TbBorderNone className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyBorder("top")}
            >
              <TbBorderTop className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyBorder("bottom")}
            >
              <TbBorderBottom className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyBorder("inner")}
            >
              <TbBorderInner className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyBorder("left")}
            >
              <TbBorderLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyBorder("right")}
            >
              <TbBorderRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Border Style Controls */}
          <div className="space-y-4">
            <Select
              value={selectedBorderStyle}
              onValueChange={(value: BorderStyle) =>
                setSelectedBorderStyle(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Border Style" />
              </SelectTrigger>
              <SelectContent>
                {BORDER_STYLES.map((style) => (
                  <SelectItem key={style} value={style}>
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedBorderWidth.toString()}
              onValueChange={(value) => setSelectedBorderWidth(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Border Width" />
              </SelectTrigger>
              <SelectContent>
                {BORDER_WIDTHS.map((width) => (
                  <SelectItem key={width} value={width.toString()}>
                    {width}px
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedBorderColor}
                onChange={(e) => setSelectedBorderColor(e.target.value)}
                className="w-8 h-8"
              />
              <span>Border Color</span>
            </div>

            {/* Padding Controls */}
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Top Padding"
                min="0"
                onChange={(e) => updatePadding("top", parseInt(e.target.value))}
              />
              <Input
                type="number"
                placeholder="Bottom Padding"
                min="0"
                onChange={(e) =>
                  updatePadding("bottom", parseInt(e.target.value))
                }
              />
              <Input
                type="number"
                placeholder="Left Padding"
                min="0"
                onChange={(e) =>
                  updatePadding("left", parseInt(e.target.value))
                }
              />
              <Input
                type="number"
                placeholder="Right Padding"
                min="0"
                onChange={(e) =>
                  updatePadding("right", parseInt(e.target.value))
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorderControls;
