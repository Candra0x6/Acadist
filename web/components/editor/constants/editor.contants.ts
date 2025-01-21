import { BorderStyle, CustomElement } from "../types/editor.types";

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
export const HEADING_TYPES = ["heading-one", "heading-two"];
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

export const PAGE_CONFIG = {
  width: 816, // 8.5 inches * 96 DPI
  minHeight: 1056, // 11 inches * 96 DPI
  padding: 96, // 1 inch padding
  headerHeight: 50,
  footerHeight: 50,
  breakThreshold: 0.95, // Percentage of page height before forcing break
};

export const TABLE_TYPES = ["table", "table-cell"] as const;
// Initial value for the editor
export const INITIAL_EDITOR_VALUE = [
  {
    type: "page",
    children: [
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ],
  },
] as CustomElement[];
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
