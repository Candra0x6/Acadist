"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Grid2x2 } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

interface TableCell {
  rows: number;
  cols: number;
}

interface TableControlsProps {
  dimensions: TableCell;
  setDimensions: Dispatch<
    SetStateAction<{
      rows: number;
      cols: number;
    }>
  >;
  hoveredCell: { row: number; col: number };
  setHoveredCell: Dispatch<
    SetStateAction<{
      row: number;
      col: number;
    }>
  >;
  onTableCreate: (rows: number, cols: number) => void;
}

export const TableControls: React.FC<TableControlsProps> = ({
  dimensions,
  hoveredCell,
  onTableCreate,
  setDimensions,
  setHoveredCell,
}) => {
  const [showTableGrid, setShowTableGrid] = useState(false);

  return (
    <Popover open={showTableGrid} onOpenChange={setShowTableGrid}>
      <PopoverTrigger asChild>
        <div className="flex items-center hover:bg-primary/10 rounded-lg cursor-pointer">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 hover:bg-transparent"
          >
            <Grid2x2 className="w-6 h-6" />
          </Button>
          <span className="text-sm">Table</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="p-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">
              {hoveredCell.row + 1} x {hoveredCell.col + 1}
            </span>
          </div>
          <div className="grid grid-rows-10 gap-1 p-2">
            {Array.from({ length: dimensions.rows }).map((_, row) => (
              <div key={row} className="flex gap-1">
                {Array.from({ length: dimensions.cols }).map((_, col) => (
                  <div
                    key={`${row}-${col}`}
                    className={`w-6 h-6 border cursor-pointer transition-colors ${
                      row <= hoveredCell.row && col <= hoveredCell.col
                        ? "bg-primary"
                        : "bg-secondary"
                    }`}
                    onMouseEnter={() => setHoveredCell({ row, col })}
                    onClick={() => onTableCreate(row + 1, col + 1)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full rounded-none">
              Insert Custom Table
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Insert Custom Table</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label>Rows</label>
                  <Input
                    type="number"
                    min="1"
                    value={dimensions.rows}
                    onChange={(e) =>
                      setDimensions({
                        ...dimensions,
                        rows: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label>Columns</label>
                  <Input
                    type="number"
                    min="1"
                    value={dimensions.cols}
                    onChange={(e) =>
                      setDimensions({
                        ...dimensions,
                        cols: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
              </div>
              <Button
                onClick={() => onTableCreate(dimensions.rows, dimensions.cols)}
              >
                Insert Table
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PopoverContent>
    </Popover>
  );
};
