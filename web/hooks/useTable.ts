import { useState } from "react";
import { Editor, Transforms } from "slate";

export const useTable = (editor: Editor) => {
  const [dimensions, setDimensions] = useState({ rows: 10, cols: 10 });
  const [hoveredCell, setHoveredCell] = useState({ row: 0, col: 0 });

  const createTableNode = (rows: number, cols: number) => {
    const tableRows = new Array(rows).fill(0).map(() => ({
      type: "table-row",
      children: new Array(cols).fill(0).map(() => ({
        type: "table-cell",
        children: [{ type: "paragraph", children: [{ text: "" }] }],
      })),
    }));

    return {
      type: "table",
      children: tableRows,
    };
  };

  const handleTableCreate = (rows: number, cols: number) => {
    const table = createTableNode(rows, cols);
    Transforms.insertNodes(editor, table);
  };

  return {
    dimensions,
    setDimensions,
    hoveredCell,
    setHoveredCell,
    handleTableCreate,
  };
};
