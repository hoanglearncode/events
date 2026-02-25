export type NotificationType = "info" | "success" | "warning" | "error";
export type NotificationStatus = "active" | "scheduled" | "expired";
export type PriorityLevel    = "low" | "medium" | "high";

export interface NotificationFormData {
  title:      string;
  content:    string;
  type:       NotificationType;
  priority:   PriorityLevel;
  startDate:  string;
  endDate:    string;
  isActive:   boolean;
  recipients: string[];
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  type: NotificationType;
  status: NotificationStatus;
  priority: PriorityLevel;
  startDate: string;
  endDate?: string;
  creator: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  recipients: string[];
}
