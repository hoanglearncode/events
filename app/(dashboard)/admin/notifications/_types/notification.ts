export type NotificationType = "info" | "success" | "warning" | "error";
export type NotificationStatus = "active" | "scheduled" | "expired";
export type NotificationPriority = "low" | "medium" | "high";

export interface Notification {
  id: string;
  title: string;
  content: string;
  type: NotificationType;
  status: NotificationStatus;
  priority: NotificationPriority;
  startDate: string;
  endDate?: string;
  creator: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
