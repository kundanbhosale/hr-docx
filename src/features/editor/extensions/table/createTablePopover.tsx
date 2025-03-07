import React, { useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const createArray = (length: number) =>
  Array.from({ length }).map((_, index) => index + 1);

interface IPropsCreateTablePopover {
  createTable: any;
  children: any;
}

export interface GridSize {
  rows: number;
  cols: number;
}

export interface CreateTablePayload extends GridSize {
  withHeaderRow: boolean;
}

function CreateTablePopover(props: IPropsCreateTablePopover) {
  const [withHeaderRow, setWithHeaderRow] = useState<boolean>(true);
  const [tableGridSize, setTableGridSize] = useState<GridSize>({
    rows: 10, //isMobile() ? TABLE_MAX_GRID_SIZE : TABLE_INIT_GRID_SIZE,
    cols: 10, //isMobile() ? TABLE_MAX_GRID_SIZE : TABLE_INIT_GRID_SIZE,
  });

  const [selectedTableGridSize, setSelectedTableGridSize] = useState<GridSize>({
    rows: 2,
    cols: 2,
  });

  function selectTableGridSize(rows: number, cols: number): void {
    if (rows === tableGridSize.rows) {
      setTableGridSize((prev) => {
        return {
          ...prev,
          rows: Math.min(rows + 1, 10),
        };
      });
    }

    if (cols === tableGridSize.cols) {
      setTableGridSize((prev) => {
        return {
          ...prev,
          cols: Math.min(cols + 1, 10),
        };
      });
    }

    setSelectedTableGridSize({
      rows,
      cols,
    });
  }

  function onMouseDown(rows: number, cols: number) {
    props?.createTable({ rows, cols, withHeaderRow });
    resetTableGridSize();
  }

  function resetTableGridSize(): void {
    setWithHeaderRow(false);

    setTableGridSize({
      rows: 10,
      cols: 10,
    });

    setSelectedTableGridSize({
      rows: 2,
      cols: 2,
    });
  }

  return (
    <Popover modal>
      <PopoverTrigger asChild>{props?.children}</PopoverTrigger>
      <PopoverContent className="w-full !p-2" align="start" side="bottom">
        <div className="p-0 table-grid-size-editor">
          <div className="flex flex-col flex-wrap justify-between gap-1">
            {createArray(tableGridSize?.rows)?.map((row: any) => {
              return (
                <div key={`r-${row}`} className="flex gap-1">
                  {createArray(tableGridSize?.cols)?.map((col: any) => {
                    return (
                      <div
                        key={`c-${col}`}
                        className={`cursor-pointer border-border ${
                          col <= selectedTableGridSize.cols &&
                          row <= selectedTableGridSize.rows &&
                          "!bg-foreground tableCellActive"
                        }`}
                        onMouseOver={() => selectTableGridSize(row, col)}
                        onMouseDown={() => onMouseDown(row, col)}
                      >
                        <div className="w-4 h-4 p-1 !border rounded-[2px] box-border border-solid !border-border"></div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <div className="mt-2 text-sm text-center text-zinc-600">
            {selectedTableGridSize.rows} x{selectedTableGridSize.cols}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default CreateTablePopover;
