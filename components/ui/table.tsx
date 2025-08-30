import * as React from "react";

export const Table = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) => (
  <table
    className={"w-full caption-bottom text-sm " + (className || "")}
    {...props}
  />
);
export const TableHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={className} {...props} />
);
export const TableBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={className} {...props} />
);
export const TableFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tfoot className={className} {...props} />
);
export const TableRow = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr
    className={
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted " +
      (className || "")
    }
    {...props}
  />
);
export const TableHead = ({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 " +
      (className || "")
    }
    {...props}
  />
);
export const TableCell = ({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td
    className={
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 " + (className || "")
    }
    {...props}
  />
);
export const TableCaption = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCaptionElement>) => (
  <caption
    className={"mt-4 text-sm text-muted-foreground " + (className || "")}
    {...props}
  />
);
