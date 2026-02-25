"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NotificationStats } from "./_components/notification-stats";
import { NotificationFilters } from "./_components/notification-filters";
import { NotificationTable } from "./_components/notification-table";
import { NotificationDialog } from "./_components/notification-dialog";
import { Notification, NotificationStatus } from "./_types/notification";
import { Bell, Plus } from "lucide-react";


export const mockNotifications: Notification[] = [
  {
    id: "noti-040",
    title: "Thông báo #40",
    content: "Nội dung thông báo số 40.",
    type: "success",
    status: "active",
    priority: "high",
    startDate: "2026-02-10T09:00:00Z",
    creator: "admin",
    isActive: true,
    createdAt: "2026-02-10T09:00:00Z",
    updatedAt: "2026-02-10T09:00:00Z",
    recipients: ["all"],
  },
  {
    id: "noti-039",
    title: "Thông báo #39",
    content: "Nội dung thông báo số 39.",
    type: "info",
    status: "active",
    priority: "medium",
    startDate: "2026-02-09T09:00:00Z",
    creator: "editor",
    isActive: true,
    createdAt: "2026-02-09T09:00:00Z",
    updatedAt: "2026-02-09T09:00:00Z",
    recipients: ["user_139"],
  },
  {
    id: "noti-038",
    title: "Thông báo #38",
    content: "Nội dung thông báo số 38.",
    type: "warning",
    status: "active",
    priority: "high",
    startDate: "2026-02-08T09:00:00Z",
    creator: "system",
    isActive: true,
    createdAt: "2026-02-08T09:00:00Z",
    updatedAt: "2026-02-08T09:00:00Z",
    recipients: ["user_138"],
  },
  {
    id: "noti-037",
    title: "Thông báo #37",
    content: "Nội dung thông báo số 37.",
    type: "error",
    status: "active",
    priority: "high",
    startDate: "2026-02-07T09:00:00Z",
    creator: "system",
    isActive: true,
    createdAt: "2026-02-07T09:00:00Z",
    updatedAt: "2026-02-07T09:00:00Z",
    recipients: ["all"],
  },

  {
    id: "noti-036",
    title: "Thông báo #36",
    content: "Nội dung thông báo số 36.",
    type: "info",
    status: "scheduled",
    priority: "medium",
    startDate: "2026-03-01T09:00:00Z",
    creator: "admin",
    isActive: true,
    createdAt: "2026-02-06T09:00:00Z",
    updatedAt: "2026-02-06T09:00:00Z",
    recipients: ["admin"],
  },
  {
    id: "noti-035",
    title: "Thông báo #35",
    content: "Nội dung thông báo số 35.",
    type: "success",
    status: "scheduled",
    priority: "low",
    startDate: "2026-02-28T09:00:00Z",
    creator: "marketing",
    isActive: true,
    createdAt: "2026-02-05T09:00:00Z",
    updatedAt: "2026-02-05T09:00:00Z",
    recipients: ["user_135"],
  },

  {
    id: "noti-034",
    title: "Thông báo #34",
    content: "Nội dung thông báo số 34.",
    type: "warning",
    status: "expired",
    priority: "high",
    startDate: "2026-01-20T09:00:00Z",
    endDate: "2026-01-25T09:00:00Z",
    creator: "system",
    isActive: false,
    createdAt: "2026-02-04T09:00:00Z",
    updatedAt: "2026-02-04T09:00:00Z",
    recipients: ["user_134"],
  },
  {
    id: "noti-033",
    title: "Thông báo #33",
    content: "Nội dung thông báo số 33.",
    type: "error",
    status: "expired",
    priority: "medium",
    startDate: "2026-01-18T09:00:00Z",
    endDate: "2026-01-22T09:00:00Z",
    creator: "system",
    isActive: false,
    createdAt: "2026-02-03T09:00:00Z",
    updatedAt: "2026-02-03T09:00:00Z",
    recipients: ["all"],
  },

  {
    id: "noti-032",
    title: "Thông báo #32",
    content: "Nội dung thông báo số 32.",
    type: "info",
    status: "expired",
    priority: "low",
    startDate: "2026-01-15T09:00:00Z",
    endDate: "2026-01-18T09:00:00Z",
    creator: "editor",
    isActive: false,
    createdAt: "2026-02-02T09:00:00Z",
    updatedAt: "2026-02-02T09:00:00Z",
    recipients: ["editor"],
  },

  {
    id: "noti-031",
    title: "Thông báo #31",
    content: "Nội dung thông báo số 31.",
    type: "success",
    status: "active",
    priority: "medium",
    startDate: "2026-01-14T09:00:00Z",
    creator: "editor",
    isActive: true,
    createdAt: "2026-02-01T09:00:00Z",
    updatedAt: "2026-02-01T09:00:00Z",
    recipients: ["user_131", "user_132"],
  },
  {
    id: "noti-030",
    title: "Thông báo #30",
    content: "Nội dung thông báo số 30.",
    type: "info",
    status: "scheduled",
    priority: "low",
    startDate: "2026-03-05T09:00:00Z",
    creator: "admin",
    isActive: true,
    createdAt: "2026-01-31T09:00:00Z",
    updatedAt: "2026-01-31T09:00:00Z",
    recipients: ["all"],
  },
  {
    id: "noti-029",
    title: "Thông báo #29",
    content: "Nội dung thông báo số 29.",
    type: "warning",
    status: "active",
    priority: "high",
    startDate: "2026-01-12T09:00:00Z",
    creator: "system",
    isActive: true,
    createdAt: "2026-01-30T09:00:00Z",
    updatedAt: "2026-01-30T09:00:00Z",
    recipients: ["user_129"],
  },
  {
    id: "noti-028",
    title: "Thông báo #28",
    content: "Nội dung thông báo số 28.",
    type: "error",
    status: "expired",
    priority: "medium",
    startDate: "2025-12-25T09:00:00Z",
    endDate: "2025-12-28T09:00:00Z",
    creator: "system",
    isActive: false,
    createdAt: "2026-01-29T09:00:00Z",
    updatedAt: "2026-01-29T09:00:00Z",
    recipients: ["all"],
  },
  {
    id: "noti-027",
    title: "Thông báo #27",
    content: "Nội dung thông báo số 27.",
    type: "success",
    status: "active",
    priority: "low",
    startDate: "2026-01-10T09:00:00Z",
    creator: "marketing",
    isActive: true,
    createdAt: "2026-01-28T09:00:00Z",
    updatedAt: "2026-01-28T09:00:00Z",
    recipients: ["user_127", "user_128"],
  },
  {
    id: "noti-026",
    title: "Thông báo #26",
    content: "Nội dung thông báo số 26.",
    type: "info",
    status: "scheduled",
    priority: "medium",
    startDate: "2026-03-10T09:00:00Z",
    creator: "admin",
    isActive: true,
    createdAt: "2026-01-27T09:00:00Z",
    updatedAt: "2026-01-27T09:00:00Z",
    recipients: ["user_126"],
  },
  {
    id: "noti-025",
    title: "Thông báo #25",
    content: "Nội dung thông báo số 25.",
    type: "warning",
    status: "expired",
    priority: "high",
    startDate: "2025-12-20T09:00:00Z",
    endDate: "2025-12-23T09:00:00Z",
    creator: "system",
    isActive: false,
    createdAt: "2026-01-26T09:00:00Z",
    updatedAt: "2026-01-26T09:00:00Z",
    recipients: ["user_125"],
  },
  {
    id: "noti-024",
    title: "Thông báo #24",
    content: "Nội dung thông báo số 24.",
    type: "error",
    status: "active",
    priority: "medium",
    startDate: "2026-01-05T09:00:00Z",
    creator: "system",
    isActive: true,
    createdAt: "2026-01-25T09:00:00Z",
    updatedAt: "2026-01-25T09:00:00Z",
    recipients: ["all"],
  },
  {
    id: "noti-023",
    title: "Thông báo #23",
    content: "Nội dung thông báo số 23.",
    type: "success",
    status: "scheduled",
    priority: "high",
    startDate: "2026-02-20T09:00:00Z",
    creator: "admin",
    isActive: true,
    createdAt: "2026-01-24T09:00:00Z",
    updatedAt: "2026-01-24T09:00:00Z",
    recipients: ["user_123"],
  },
  {
    id: "noti-022",
    title: "Thông báo #22",
    content: "Nội dung thông báo số 22.",
    type: "info",
    status: "expired",
    priority: "low",
    startDate: "2025-12-10T09:00:00Z",
    endDate: "2025-12-15T09:00:00Z",
    creator: "editor",
    isActive: false,
    createdAt: "2026-01-23T09:00:00Z",
    updatedAt: "2026-01-23T09:00:00Z",
    recipients: ["editor"],
  },
  {
    id: "noti-021",
    title: "Thông báo #21",
    content: "Nội dung thông báo số 21.",
    type: "warning",
    status: "active",
    priority: "medium",
    startDate: "2026-01-01T09:00:00Z",
    creator: "system",
    isActive: true,
    createdAt: "2026-01-22T09:00:00Z",
    updatedAt: "2026-01-22T09:00:00Z",
    recipients: ["user_121", "user_122"],
  },
  {
    id: "noti-020",
    title: "Thông báo #20",
    content: "Nội dung thông báo số 20.",
    type: "error",
    status: "scheduled",
    priority: "high",
    startDate: "2026-03-15T09:00:00Z",
    creator: "marketing",
    isActive: true,
    createdAt: "2026-01-21T09:00:00Z",
    updatedAt: "2026-01-21T09:00:00Z",
    recipients: ["user_120"],
  },
  {
    id: "noti-001",
    title: "Thông báo #1",
    content: "Nội dung thông báo số 1.",
    type: "info",
    status: "expired",
    priority: "low",
    startDate: "2025-12-01T09:00:00Z",
    endDate: "2025-12-05T09:00:00Z",
    creator: "admin",
    isActive: false,
    createdAt: "2026-01-02T09:00:00Z",
    updatedAt: "2026-01-02T09:00:00Z",
    recipients: ["admin"],
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNotification, setEditingNotification] =
    useState<Notification | null>(null);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const matchesSearch =
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        typeFilter === "all" || notification.type === typeFilter;
      const matchesStatus =
        statusFilter === "all" || notification.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [notifications, searchTerm, typeFilter, statusFilter]);

  useEffect(() => {}, []);

  const handleReset = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setStatusFilter("all");
  };

  const handleCreate = () => {
    setEditingNotification(null);
    setDialogOpen(true);
  };

  const handleEdit = (notification: Notification) => {
    setEditingNotification(notification);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa thông báo này?")) {
      setNotifications(notifications.filter((n) => n.id !== id));
    }
  };

  const handleSave = (data: Partial<Notification>) => {
    // Determine status based on dates
    const now = new Date();
    const start = new Date(data.startDate!);
    const end = data.endDate ? new Date(data.endDate) : null;

    let status: NotificationStatus = "active";
    if (now < start) {
      status = "scheduled";
    } else if (end && now > end) {
      status = "expired";
    } else {
      status = data.isActive ? "active" : "scheduled";
    }

    if (editingNotification) {
      // Update existing
      setNotifications(
        notifications.map((n) =>
          n.id === editingNotification.id
            ? {
                ...n,
                ...data,
                status,
                updatedAt: new Date().toISOString(),
              }
            : n
        )
      );
    } else {
      // Create new
      const newNotification: Notification = {
        id: String(Date.now()),
        title: data.title!,
        content: data.content!,
        type: data.type!,
        status,
        priority: data.priority!,
        startDate: data.startDate!,
        endDate: data.endDate,
        creator: "Admin",
        isActive: data.isActive!,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        recipients: data.recipients || [],
      };
      setNotifications([...notifications, newNotification]);
    }

    setDialogOpen(false);
    setEditingNotification(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-primary rounded-xl shadow-lg shadow-brand-primary/20">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    System Configuration
                  </h1>
                  <p className="text-muted-foreground text-sm mt-0.5">
                    Platform Administration & Settings
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleCreate}
                className="bg-primary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white shadow-lg shadow-brand-primary/20 min-w-[140px] transition-all duration-200"
              >
                <Plus className="mr-2 h-4 w-4" />
                Thêm thông báo mới
              </Button>
            </div>
          </div>
          <NotificationStats notifications={notifications} />
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="">
            <NotificationFilters
              searchTerm={searchTerm}
              typeFilter={typeFilter}
              statusFilter={statusFilter}
              onSearchChange={setSearchTerm}
              onTypeChange={setTypeFilter}
              onStatusChange={setStatusFilter}
              onReset={handleReset}
            />
          </CardContent>
        </Card>

        {/* Table */}
        <NotificationTable
          notifications={filteredNotifications}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Dialog */}
        <NotificationDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
