export type ToastType = "success" | "error" | "info";

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "mention";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}
