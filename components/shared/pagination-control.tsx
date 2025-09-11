"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export interface PaginationControlProps {
  currentPage: number;
  pageCount: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: string) => void;
  isLoading?: boolean;
}

export function PaginationControl({
  currentPage,
  pageCount,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}: PaginationControlProps) {
  return (
    <div className="mt-4">
      {isLoading && (
        <p className="text-xs text-muted-foreground mb-2">Refreshing...</p>
      )}

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
          {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries
        </div>

        <div className="flex items-center gap-4 w-fit">
          <div className="flex w-full items-center">
            <span className="text-sm">Rows per page:&nbsp;</span>
            <Select
              value={pageSize.toString()}
              onValueChange={onPageSizeChange}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder={pageSize.toString()} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  className={
                    currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {/* Generate page numbers */}
              {Array.from({ length: pageCount }, (_, i) => i + 1).map(
                (page) => {
                  // Show only first, last, current and pages within 1 of current
                  const shouldShow =
                    page === 1 ||
                    page === pageCount ||
                    Math.abs(page - currentPage) <= 1;

                  // Show ellipsis after first page if needed
                  const showStartEllipsis = page === 1 && currentPage > 3;

                  // Show ellipsis before last page if needed
                  const showEndEllipsis =
                    page === pageCount && currentPage < pageCount - 2;

                  return shouldShow ? (
                    <React.Fragment key={page}>
                      {showStartEllipsis && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => onPageChange(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                      {showEndEllipsis && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                    </React.Fragment>
                  ) : null;
                }
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    onPageChange(Math.min(pageCount, currentPage + 1))
                  }
                  className={
                    currentPage >= pageCount
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

export interface SearchToolbarProps {
  onSearch: (q: string) => void;
  placeholder?: string;
}

export function SearchToolbar({
  onSearch,
  placeholder = "Search...",
}: SearchToolbarProps) {
  const [searchValue, setSearchValue] = React.useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    // Debounce search input
    const timer = setTimeout(() => {
      onSearch(value);
    }, 500);

    return () => clearTimeout(timer);
  };

  return (
    <div className="flex gap-4 items-center">
      <Input
        placeholder={placeholder}
        className="max-w-sm bg-white rounded-[12px] w-full"
        value={searchValue}
        onChange={handleSearch}
      />
    </div>
  );
}
