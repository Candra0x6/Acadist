import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";
import { Descendant } from "slate";

export type BorderStyle = "solid" | "dashed" | "dotted" | "double" | "none";
export type BorderSizeStyle = {
  style: BorderStyle;
  width: number;
  color: string;
};
export interface BorderProperties {
  top?: BorderSizeStyle;
  bottom?: BorderSizeStyle;
  left?: BorderSizeStyle;
  right?: BorderSizeStyle;
  padding?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export type CustomElement = {
  type: string;
  align?: string;
  fontSize?: string;
  children: CustomText[] | CustomElement[];
  borders?: BorderProperties;
  isHeader?: boolean;
  isFooter?: boolean;
  colspan?: number;
  rowspan?: number;
  tableWidth?: string;
  backgroundColor?: string;
};

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  fontSize?: string;
  color?: string;
  strikethrough?: boolean;
  subscript?: boolean;
  superscript?: boolean;
};

export type PageElement = {
  type: "page";
  id: string;
  header?: string;
  footer?: string;
  pageNumber: number;
  children: Descendant[];
};

export type CustomEditor = BaseEditor &
  ReactEditor &
  HistoryEditor & {
    isContentOverflowing: (element: HTMLElement) => boolean;
    getContentHeight: (element: HTMLElement) => number;
  };

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export interface BlockButtonProps {
  format: string;
  icon: React.ReactNode;
}

// constants/editor.constants.ts
export const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
  "mod+z": "undo",
  "mod+shift+z": "redo",
  "mod+shift+x": "strikethrough",
  "mod+.": "superscript",
  "mod+,": "subscript",
  "mod+=": "increaseFontSize",
  "mod+-": "decreaseFontSize",
  "mod+f": "find",
  "mod+h": "replace",
  f3: "findNext",
  "shift+f3": "findPrevious",
};

export const LIST_TYPES = ["numbered-list", "bulleted-list"];
export const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];
export const FONT_SIZES = [
  "8",
  "9",
  "10",
  "11",
  "12",
  "14",
  "16",
  "18",
  "20",
  "22",
  "24",
  "26",
  "28",
  "36",
  "48",
  "72",
];

export const COLORS = [
  { name: "Default", value: "inherit" },
  { name: "Red", value: "#e11d48" },
  { name: "Green", value: "#16a34a" },
  { name: "Blue", value: "#2563eb" },
  { name: "Yellow", value: "#ca8a04" },
  { name: "Purple", value: "#9333ea" },
  { name: "Orange", value: "#ea580c" },
  { name: "Black", value: "#000000" },
];

export const BORDER_STYLES: BorderStyle[] = [
  "solid",
  "dashed",
  "dotted",
  "double",
  "none",
];
export const BORDER_WIDTHS = [1, 2, 3, 4, 5, 6];
export const DEFAULT_BORDER = {
  style: "solid" as BorderStyle,
  width: 1,
  color: "#000000",
};
