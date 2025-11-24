export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(time: string): string {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDateTime(date: string, time?: string): string {
  const dateStr = formatDate(date);
  return time ? `${dateStr} at ${formatTime(time)}` : dateStr;
}

export function isToday(date: string): boolean {
  const today = new Date().toISOString().split("T")[0];
  return date === today;
}

export function isFuture(date: string, time?: string): boolean {
  const checkDate = new Date(`${date}T${time || "00:00"}`);
  return checkDate > new Date();
}
