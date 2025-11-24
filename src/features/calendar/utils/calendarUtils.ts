/**
 * Calendar utility functions for date calculations and formatting
 */

/**
 * Check if a given day number is today
 */
export const isToday = (day: number, month: number, year: number): boolean => {
  const today = new Date();
  return (
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear()
  );
};

/**
 * Format a date as YYYY-MM-DD
 */
export const formatDate = (
  day: number,
  month: number,
  year: number
): string => {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

/**
 * Get month name from month index
 */
export const getMonthName = (month: number): string => {
  const date = new Date(2000, month, 1);
  return date.toLocaleString("default", { month: "long" });
};

/**
 * Generate calendar grid data (35 cells for month view)
 * Returns array of day numbers, with negative or > 31 for other months
 */
export const generateCalendarGrid = (
  _month: number,
  _year: number
): number[] => {
  // Simple mock implementation - offset by 2 for visual layout
  return Array.from({ length: 35 }, (_, i) => i - 2);
};

/**
 * Check if a day number is in the current month view
 */
export const isCurrentMonth = (day: number): boolean => {
  return day > 0 && day <= 31;
};
