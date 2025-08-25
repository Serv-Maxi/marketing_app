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

/**
 * Copy text to clipboard with fallback for older browsers
 * @param text - Text content to copy to clipboard
 * @returns Promise that resolves to boolean indicating success
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      // Modern browsers
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;

      // Make the textarea out of viewport
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);

      // Focus and select the text
      textArea.focus();
      textArea.select();

      // Execute the copy command
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (error) {
    console.error("Failed to copy text: ", error);
    return false;
  }
}
