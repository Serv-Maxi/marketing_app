"use client";
// Simple reusable table component using shadcn/ui Table primitives
import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export type ColumnDef<T> = {
  key: keyof T | string;
  header: string;
  cell?: (row: T, index: number) => React.ReactNode; // index after sorting
  className?: string;
};

interface AdminTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  rowKey: (row: T) => string;
  empty?: React.ReactNode;
}

export function AdminTable<T>({
  columns,
  data,
  rowKey,
  empty,
}: AdminTableProps<T>) {
  const [sort, setSort] = React.useState<{
    key: string;
    dir: "asc" | "desc";
  } | null>(null);
  const sorted = React.useMemo(() => {
    if (!sort) return data;
    const copy = [...data];
    copy.sort((a, b) => {
      const av = (a as Record<string, unknown>)[sort.key];
      const bv = (b as Record<string, unknown>)[sort.key];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [data, sort]);
  function toggleSort(key: string) {
    setSort((prev) =>
      !prev || prev.key !== key
        ? { key, dir: "asc" }
        : prev.dir === "asc"
          ? { key, dir: "desc" }
          : null
    );
  }
  return (
    <div className="rounded-[16px] border bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-[#F9F9FB]">
          <TableRow>
            {columns.map((col) => {
              const active = sort?.key === col.key;
              return (
                <TableHead
                  key={col.key as string}
                  className={
                    "p-3 font-medium select-none cursor-pointer" +
                    (col.className ?? "")
                  }
                  onClick={() => toggleSort(col.key as string)}
                >
                  <span className="inline-flex items-center gap-1 p-[8px] uppercase">
                    {col.header}
                    {active && (
                      <span className="text-[10px] leading-none">
                        {sort?.dir === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </span>
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="p-6 text-center text-muted-foreground"
              >
                {empty || "No data"}
              </TableCell>
            </TableRow>
          ) : (
            sorted.map((row, idx) => (
              <TableRow key={rowKey(row)} className={`hover:bg-muted/50`}>
                {columns.map((col) => (
                  <TableCell
                    key={col.key as string}
                    className={"p-[16px] text-[16px] " + (col.className ?? "")}
                  >
                    {col.cell
                      ? col.cell(row, idx)
                      : String(
                          (row as Record<string, unknown>)[col.key as string] ??
                            ""
                        )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
