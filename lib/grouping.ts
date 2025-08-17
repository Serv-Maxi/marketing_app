// ...existing code...

import {
  format,
  parseISO,
  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
} from "date-fns";

// ...existing code...

export interface GroupedByDate<T> {
  date: string;
  data: T[];
}

/**
 * Groups array of items by date
 * @param items - Array of items with created_at property
 * @param formatType - How to format the date ('friendly' | 'short' | 'full')
 * @returns Array of grouped items by date
 */
export function groupByDate<T extends { created_at: string }>(
  items: T[],
  formatType: "friendly" | "short" | "full" = "friendly"
): GroupedByDate<T>[] {
  if (!items || items.length === 0) return [];

  // Group items by date
  const grouped = items.reduce(
    (acc, item) => {
      const date = parseISO(item.created_at);
      let dateKey: string;

      switch (formatType) {
        case "friendly":
          if (isToday(date)) {
            dateKey = "Today";
          } else if (isYesterday(date)) {
            dateKey = "Yesterday";
          } else if (isThisWeek(date)) {
            dateKey = format(date, "EEEE"); // Monday, Tuesday, etc.
          } else if (isThisMonth(date)) {
            dateKey = format(date, "EEEE, MMM d"); // Monday, Jan 15
          } else {
            dateKey = format(date, "MMM d, yyyy"); // Jan 15, 2024
          }
          break;
        case "short":
          dateKey = format(date, "MMM d"); // Jan 15
          break;
        case "full":
          dateKey = format(date, "MMMM d, yyyy"); // January 15, 2024
          break;
        default:
          dateKey = format(date, "MMM d, yyyy");
      }

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(item);
      return acc;
    },
    {} as Record<string, T[]>
  );

  // Convert to array format and sort by date (newest first)
  return Object.entries(grouped)
    .map(([date, data]) => ({ date, data }))
    .sort((a, b) => {
      // Special handling for "Today" and "Yesterday"
      if (a.date === "Today") return -1;
      if (b.date === "Today") return 1;
      if (a.date === "Yesterday") return -1;
      if (b.date === "Yesterday") return 1;

      // For other dates, sort by the first item's date
      const dateA = parseISO(a.data[0].created_at);
      const dateB = parseISO(b.data[0].created_at);
      return dateB.getTime() - dateA.getTime();
    });
}
