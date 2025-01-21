"use client";

import React from "react";
import { CustomElement } from "../types/editor.types";
import { PAGE_CONFIG } from "../constants/editor.contants";

interface ElementProps {
  attributes: any;
  children: React.ReactNode;
  element: CustomElement;
}

export const Element: React.FC<ElementProps> = ({
  attributes,
  children,
  element,
}) => {
  const style: React.CSSProperties = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    textAlign: element.align,
    borderTop:
      element.borders?.top?.style !== "none"
        ? `${element.borders?.top?.width}px ${element.borders?.top?.style} ${element.borders?.top?.color}`
        : undefined,
    borderBottom:
      element.borders?.bottom?.style !== "none"
        ? `${element.borders?.bottom?.width}px ${element.borders?.bottom?.style} ${element.borders?.bottom?.color}`
        : undefined,
    borderLeft:
      element.borders?.left?.style !== "none"
        ? `${element.borders?.left?.width}px ${element.borders?.left?.style} ${element.borders?.left?.color}`
        : undefined,
    borderRight:
      element.borders?.right?.style !== "none"
        ? `${element.borders?.right?.width}px ${element.borders?.right?.style} ${element.borders?.right?.color}`
        : undefined,
    paddingTop: element.borders?.padding?.top,
    paddingBottom: element.borders?.padding?.bottom,
    paddingLeft: element.borders?.padding?.left,
    paddingRight: element.borders?.padding?.right,
  };

  const components = {
    page: () => (
      <div
        {...attributes}
        className="relative bg-white shadow-lg mx-auto my-4 "
        style={{
          minHeight: `${PAGE_CONFIG.minHeight}px`, // US Letter height in pixels (11 inches)
          width: `${PAGE_CONFIG.width}px`, // US Letter width in pixels (8.5 inches)
          padding: "96px 72px", // 1-inch margins
          breakInside: "avoid",
          breakAfter: "page",
          backgroundColor: "white",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        {children}
      </div>
    ),
    "block-quote": () => (
      <blockquote
        style={style}
        className="border-l-4 border-gray-300 pl-4 italic"
        {...attributes}
      >
        {children}
      </blockquote>
    ),
    "bulleted-list": () => (
      <ul style={style} className="list-disc list-inside" {...attributes}>
        {children}
      </ul>
    ),
    "heading-one": () => (
      <h1 style={style} className="text-4xl font-bold my-2" {...attributes}>
        {children}
      </h1>
    ),
    "heading-two": () => (
      <h2 style={style} className="text-3xl font-bold my-2" {...attributes}>
        {children}
      </h2>
    ),
    "heading-three": () => (
      <h3 style={style} className="text-2xl font-bold my-2" {...attributes}>
        {children}
      </h3>
    ),
    "heading-four": () => (
      <h4 style={style} className="text-xl font-bold my-2" {...attributes}>
        {children}
      </h4>
    ),
    "heading-five": () => (
      <h5 style={style} className="text-lg font-bold my-2" {...attributes}>
        {children}
      </h5>
    ),
    "list-item": () => (
      <li style={style} className="my-1" {...attributes}>
        {children}
      </li>
    ),
    "numbered-list": () => (
      <ol style={style} className="list-decimal list-inside" {...attributes}>
        {children}
      </ol>
    ),
    paragraph: () => (
      <p style={style} className="my-1" {...attributes}>
        {children}
      </p>
    ),
    table: () => (
      <table style={{ width: element.tableWidth || "100%" }} {...attributes}>
        <tbody>{children}</tbody>
      </table>
    ),
    "table-row": () => <tr {...attributes}>{children}</tr>,
    "table-cell": () => (
      <td
        {...attributes}
        style={{
          padding: "8px",
          border: "1px solid #ccc",
          backgroundColor: element.backgroundColor,
        }}
        colSpan={element.colspan}
        rowSpan={element.rowspan}
      >
        {children}
      </td>
    ),
    "table-header": () => (
      <th
        {...attributes}
        style={{
          padding: "8px",
          border: "1px solid #ccc",
          backgroundColor: element.backgroundColor,
        }}
        colSpan={element.colspan}
        rowSpan={element.rowspan}
      >
        {children}
      </th>
    ),
    title: () => (
      <h1 style={style} className="text-4xl font-bold my-2" {...attributes}>
        {children}
      </h1>
    ),
    subtitle: () => (
      <h2 style={style} className="text-3xl font-bold my-2" {...attributes}>
        {children}
      </h2>
    ),
    author: () => (
      <p style={style} className="my-1" {...attributes}>
        {children}
      </p>
    ),
    date: () => (
      <p style={style} className="my-1" {...attributes}>
        {children}
      </p>
    ),

    // ... other element types
  };

  return (
    // @ts-expect-error - This is a hack to get around the type error
    components[element.type]?.() || (
      <p style={style} className="my-1" {...attributes}>
        {children}
      </p>
    )
  );
};
