import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Parse date string or return Date object
 * @param date - Date string or Date object
 * @returns Date object
 */
function parseDate(date: string | Date): Date {
  return typeof date === "string" ? parseISO(date) : date;
}

/**
 * Format a date string or Date object to a readable format
 * @param date - Date string or Date object
 * @param formatString - date-fns format string (default: "MMM d, yyyy")
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date,
  formatString: string = "MMM d, yyyy"
): string {
  const dateObj = parseDate(date);
  return format(dateObj, formatString);
}

/**
 * Format a date to a short format (e.g., "Aug 12, 2025")
 * @param date - Date string or Date object
 * @returns Short formatted date string
 */
export function formatDateShort(date: string | Date): string {
  return formatDate(date, "MMM d, yyyy");
}

/**
 * Format a date to a long format (e.g., "August 12, 2025")
 * @param date - Date string or Date object
 * @returns Long formatted date string
 */
export function formatDateLong(date: string | Date): string {
  return formatDate(date, "MMMM d, yyyy");
}

/**
 * Format a date to include time (e.g., "Aug 12, 2025 at 3:45 PM")
 * @param date - Date string or Date object
 * @returns Formatted date with time string
 */
export function formatDateTime(date: string | Date): string {
  return formatDate(date, "MMM d, yyyy 'at' h:mm a");
}

/**
 * Get relative time from now (e.g., "2 hours ago", "3 days ago")
 * @param date - Date string or Date object
 * @returns Relative time string
 */
export function getRelativeTime(date: string | Date): string {
  const dateObj = parseDate(date);
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

/**
 * Format a date for display in UI components
 * @param date - Date string or Date object
 * @returns User-friendly date string
 */
export function formatDisplayDate(date: string | Date): string {
  return formatDate(date, "MMM d");
}

/**
 * Format a date for API requests (ISO format)
 * @param date - Date string or Date object
 * @returns ISO date string
 */
export function formatApiDate(date: string | Date): string {
  const dateObj = parseDate(date);
  return dateObj.toISOString();
}

/**
 * Check if a date is today
 * @param date - Date string or Date object
 * @returns Boolean indicating if date is today
 */
export function isToday(date: string | Date): boolean {
  const dateObj = parseDate(date);
  const today = new Date();
  return dateObj.toDateString() === today.toDateString();
}
