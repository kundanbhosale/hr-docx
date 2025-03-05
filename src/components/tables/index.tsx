/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { ReactNode, useCallback, useMemo, useState } from "react";
import { columnFilterSchema, sortingSchema } from "./schema";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  TableMeta,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { LucideIcon, Search, Settings2 } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { z } from "zod";

import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import EmptyPage from "../pages/empty";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import Loading from "../ui/loading";

export type QState = {
  page: number;
  limit: number;
  search?: string | null;
  sort?: string | null;
  filters?: string | null;
};
export type ListTable = {
  queryKey: string;
  getData: (val: QState) => any;
  columns: ColumnDef<any, any>[];
  onRowClick?: (v: any) => void;
  config?: {
    loading: Parameters<typeof Loading>[0];
    empty?: { icon?: LucideIcon; title?: string; label?: string };
    searchInput?: { placeholder?: string };
  };
  meta?: TableMeta<any>;
  components?: {
    navbar?: {
      above?: ReactNode;
      below?: ReactNode;
      between?: ReactNode;
      after?: ReactNode;
      before?: ReactNode;
    };
  };
};

export default function ListTable({
  columns,
  config,
  getData,
  onRowClick,
  components,
  queryKey,
  meta,
}: ListTable) {
  const { empty, searchInput } = config || {};

  const [sorting, setSorting] = useQueryState("sort");
  const [columnFilters, setColumnFilters] = useQueryState("filters");
  const [search, setSearch] = useQueryState("search");
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(0));

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const decodedSort = useMemo(() => {
    return sortingSchema(z.string()).parse(sorting);
  }, [sorting]);

  const decodedFilters = useMemo(() => {
    return columnFilterSchema(
      z.object({ id: z.string(), value: z.unknown() })
    ).parse(columnFilters) as ColumnFiltersState;
  }, [columnFilters]);

  const opts = {
    search,
    sort: sorting,
    filters: columnFilters,
    page: Number(page),
    limit: 100,
  };

  const { data, isLoading, isError, isPlaceholderData, isFetching } = useQuery({
    queryKey: [queryKey, opts],
    queryFn: async () => await getData(opts),
    placeholderData: keepPreviousData,
  });

  const updater = <T,>(val: T, cb: (val: any) => void) => {
    if (typeof val === "function") {
      cb(val());
    } else {
      cb(val as any);
    }
  };

  const table = useReactTable({
    data: data?.items || [],
    columns,
    onSortingChange: (d) =>
      updater(d, (val) => setSorting(encodeURIComponent(JSON.stringify(val)))),
    onColumnFiltersChange: (d) =>
      updater(d, (val) =>
        setColumnFilters(encodeURIComponent(JSON.stringify(val)))
      ),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualFiltering: true,
    manualSorting: true,
    meta: { ...meta },

    state: {
      sorting: decodedSort,
      columnFilters: decodedFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="space-y-4">
      {components?.navbar?.above}

      <div className="flex items-center space-x-4">
        {components?.navbar?.before}
        <SearchBar
          placeholder={searchInput?.placeholder}
          search={search}
          setSearch={setSearch}
        />
        {components?.navbar?.between}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <Settings2 height={14} width={14} /> View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id.replaceAll("_", " ")}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        {components?.navbar?.after}
      </div>
      {components?.navbar?.below}

      <div className="min-h-[450px] rounded-md border">
        <Table className="w-full border-b">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={header.column.columnDef.meta?.headerClassName}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isError ? (
              <TableRow className="h-[450px]">
                <TableCell colSpan={columns.length} className="text-center">
                  <p>Failed to load data...</p>
                </TableCell>
              </TableRow>
            ) : isLoading || isFetching ? (
              [...Array(7)].map((m, i) => (
                <TableRow className="animate-pulse border-b" key={i}>
                  {table.getVisibleFlatColumns().map((_, k) => (
                    <TableCell key={k}>
                      <div className="bg-muted h-12" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table?.getRowModel().rows?.length ? (
              table?.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => onRowClick && onRowClick(row.original)}
                  className={cn(
                    "group border-b",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.cellClassName}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="h-[450px]">
                <TableCell colSpan={columns.length} className="text-center">
                  <EmptyPage {...empty} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm"></div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => setPage((old) => Math.max(old - 1, 0))}
            disabled={page === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => {
              if (!isPlaceholderData && data.hasMore) {
                setPage((old) => old + 1);
              }
            }}
            // Disable the Next Page button until we know a next page is available
            disabled={isPlaceholderData || !data?.hasMore}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

function SearchBar({
  placeholder,
  setSearch,
  search,
}: {
  search: string | null;
  placeholder?: string;
  setSearch: (v: string | null) => void;
}) {
  const [val, setVal] = useState(search || "");
  const handleSearch = useCallback(
    (e: any) => {
      e.preventDefault();
      setSearch(val);
    },
    [val]
  );

  return (
    <form onSubmit={handleSearch} className="relative flex w-full items-center">
      <Search
        width={18}
        height={18}
        className="text-muted-foreground absolute left-2 top-2"
      />
      <Input
        placeholder={placeholder || "Search..."}
        value={val}
        onChange={(e) => setVal(e.currentTarget.value)}
        className={cn(
          "w-full flex-1 pl-8",
          (val.length || 0) > 0 && val !== search && "pr-10"
        )}
      />
      <Button
        size={"icon"}
        type="submit"
        className={cn(
          "absolute right-1 top-1 size-7",
          val !== (search || "") ? "visible" : "invisible"
        )}
      >
        -&gt;
      </Button>
    </form>
  );
}
