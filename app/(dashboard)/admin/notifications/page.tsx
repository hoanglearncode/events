"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NotificationStats } from "./_components/notification-stats"
import { NotificationFilters } from "./_components/notification-filters"
import { NotificationTable } from "./_components/notification-table"
import { NotificationDialog } from "./_components/notification-dialog"
import { Notification, NotificationStatus } from "./_types/notification"
import { Bell, Plus } from "lucide-react"

// Sample data
const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Bảo trì hệ thống",
    content: "Hệ thống sẽ được bảo trì vào ngày 10/02/2026 từ 2:00 - 4:00 sáng",
    type: "warning",
    status: "scheduled",
    priority: "high",
    startDate: "2026-02-10T02:00",
    endDate: "2026-02-10T04:00",
    creator: "Admin",
    isActive: false,
    createdAt: "2026-02-01T10:00:00",
    updatedAt: "2026-02-01T10:00:00",
  },
  {
    id: "2",
    title: "Cập nhật tính năng mới",
    content: "Chúng tôi vừa ra mắt tính năng xuất báo cáo tự động",
    type: "success",
    status: "active",
    priority: "medium",
    startDate: "2026-02-01T00:00",
    endDate: "2026-02-28T23:59",
    creator: "Admin",
    isActive: true,
    createdAt: "2026-02-01T00:00:00",
    updatedAt: "2026-02-01T00:00:00",
  },
  {
    id: "3",
    title: "Lỗi đăng nhập",
    content: "Hệ thống đăng nhập tạm thời gặp lỗi, chúng tôi đang khắc phục",
    type: "error",
    status: "active",
    priority: "high",
    startDate: "2026-02-08T10:00",
    endDate: "2026-02-08T18:00",
    creator: "Support Team",
    isActive: true,
    createdAt: "2026-02-08T10:00:00",
    updatedAt: "2026-02-08T10:00:00",
  },
  {
    id: "4",
    title: "Chúc mừng năm mới",
    content: "Chúc toàn thể người dùng một năm mới an khang thịnh vượng",
    type: "info",
    status: "expired",
    priority: "low",
    startDate: "2026-01-01T00:00",
    endDate: "2026-01-05T23:59",
    creator: "Admin",
    isActive: false,
    createdAt: "2025-12-30T00:00:00",
    updatedAt: "2025-12-30T00:00:00",
  },
  {
    id: "5",
    title: "Khuyến mãi tháng 2",
    content: "Giảm giá 20% cho tất cả gói dịch vụ trong tháng 2",
    type: "success",
    status: "active",
    priority: "high",
    startDate: "2026-02-01T00:00",
    endDate: "2026-02-28T23:59",
    creator: "Marketing",
    isActive: true,
    createdAt: "2026-01-28T00:00:00",
    updatedAt: "2026-01-28T00:00:00",
  },
  {
    id: "31",
    title: "Bảo trì hệ thống",
    content: "Hệ thống sẽ được bảo trì vào ngày 10/02/2026 từ 2:00 - 4:00 sáng",
    type: "warning",
    status: "scheduled",
    priority: "high",
    startDate: "2026-02-10T02:00",
    endDate: "2026-02-10T04:00",
    creator: "Admin",
    isActive: false,
    createdAt: "2026-02-01T10:00:00",
    updatedAt: "2026-02-01T10:00:00",
  },
  {
    id: "22",
    title: "Cập nhật tính năng mới",
    content: "Chúng tôi vừa ra mắt tính năng xuất báo cáo tự động",
    type: "success",
    status: "active",
    priority: "medium",
    startDate: "2026-02-01T00:00",
    endDate: "2026-02-28T23:59",
    creator: "Admin",
    isActive: true,
    createdAt: "2026-02-01T00:00:00",
    updatedAt: "2026-02-01T00:00:00",
  },
  {
    id: "23",
    title: "Lỗi đăng nhập",
    content: "Hệ thống đăng nhập tạm thời gặp lỗi, chúng tôi đang khắc phục",
    type: "error",
    status: "active",
    priority: "high",
    startDate: "2026-02-08T10:00",
    endDate: "2026-02-08T18:00",
    creator: "Support Team",
    isActive: true,
    createdAt: "2026-02-08T10:00:00",
    updatedAt: "2026-02-08T10:00:00",
  },
  {
    id: "24",
    title: "Chúc mừng năm mới",
    content: "Chúc toàn thể người dùng một năm mới an khang thịnh vượng",
    type: "info",
    status: "expired",
    priority: "low",
    startDate: "2026-01-01T00:00",
    endDate: "2026-01-05T23:59",
    creator: "Admin",
    isActive: false,
    createdAt: "2025-12-30T00:00:00",
    updatedAt: "2025-12-30T00:00:00",
  },
  {
    id: "25",
    title: "Khuyến mãi tháng 2",
    content: "Giảm giá 20% cho tất cả gói dịch vụ trong tháng 2",
    type: "success",
    status: "active",
    priority: "high",
    startDate: "2026-02-01T00:00",
    endDate: "2026-02-28T23:59",
    creator: "Marketing",
    isActive: true,
    createdAt: "2026-01-28T00:00:00",
    updatedAt: "2026-01-28T00:00:00",
  },
  {
    id: "21",
    title: "Bảo trì hệ thống",
    content: "Hệ thống sẽ được bảo trì vào ngày 10/02/2026 từ 2:00 - 4:00 sáng",
    type: "warning",
    status: "scheduled",
    priority: "high",
    startDate: "2026-02-10T02:00",
    endDate: "2026-02-10T04:00",
    creator: "Admin",
    isActive: false,
    createdAt: "2026-02-01T10:00:00",
    updatedAt: "2026-02-01T10:00:00",
  },
  {
    id: "21",
    title: "Cập nhật tính năng mới",
    content: "Chúng tôi vừa ra mắt tính năng xuất báo cáo tự động",
    type: "success",
    status: "active",
    priority: "medium",
    startDate: "2026-02-01T00:00",
    endDate: "2026-02-28T23:59",
    creator: "Admin",
    isActive: true,
    createdAt: "2026-02-01T00:00:00",
    updatedAt: "2026-02-01T00:00:00",
  },
  {
    id: "31",
    title: "Lỗi đăng nhập",
    content: "Hệ thống đăng nhập tạm thời gặp lỗi, chúng tôi đang khắc phục",
    type: "error",
    status: "active",
    priority: "high",
    startDate: "2026-02-08T10:00",
    endDate: "2026-02-08T18:00",
    creator: "Support Team",
    isActive: true,
    createdAt: "2026-02-08T10:00:00",
    updatedAt: "2026-02-08T10:00:00",
  },
  {
    id: "41",
    title: "Chúc mừng năm mới",
    content: "Chúc toàn thể người dùng một năm mới an khang thịnh vượng",
    type: "info",
    status: "expired",
    priority: "low",
    startDate: "2026-01-01T00:00",
    endDate: "2026-01-05T23:59",
    creator: "Admin",
    isActive: false,
    createdAt: "2025-12-30T00:00:00",
    updatedAt: "2025-12-30T00:00:00",
  },
  {
    id: "51",
    title: "Khuyến mãi tháng 2",
    content: "Giảm giá 20% cho tất cả gói dịch vụ trong tháng 2",
    type: "success",
    status: "active",
    priority: "high",
    startDate: "2026-02-01T00:00",
    endDate: "2026-02-28T23:59",
    creator: "Marketing",
    isActive: true,
    createdAt: "2026-01-28T00:00:00",
    updatedAt: "2026-01-28T00:00:00",
  },
  {
    id: "11",
    title: "Bảo trì hệ thống",
    content: "Hệ thống sẽ được bảo trì vào ngày 10/02/2026 từ 2:00 - 4:00 sáng",
    type: "warning",
    status: "scheduled",
    priority: "high",
    startDate: "2026-02-10T02:00",
    endDate: "2026-02-10T04:00",
    creator: "Admin",
    isActive: false,
    createdAt: "2026-02-01T10:00:00",
    updatedAt: "2026-02-01T10:00:00",
  },
  {
    id: "12",
    title: "Cập nhật tính năng mới",
    content: "Chúng tôi vừa ra mắt tính năng xuất báo cáo tự động",
    type: "success",
    status: "active",
    priority: "medium",
    startDate: "2026-02-01T00:00",
    endDate: "2026-02-28T23:59",
    creator: "Admin",
    isActive: true,
    createdAt: "2026-02-01T00:00:00",
    updatedAt: "2026-02-01T00:00:00",
  },
  {
    id: "13",
    title: "Lỗi đăng nhập",
    content: "Hệ thống đăng nhập tạm thời gặp lỗi, chúng tôi đang khắc phục",
    type: "error",
    status: "active",
    priority: "high",
    startDate: "2026-02-08T10:00",
    endDate: "2026-02-08T18:00",
    creator: "Support Team",
    isActive: true,
    createdAt: "2026-02-08T10:00:00",
    updatedAt: "2026-02-08T10:00:00",
  },
  {
    id: "14",
    title: "Chúc mừng năm mới",
    content: "Chúc toàn thể người dùng một năm mới an khang thịnh vượng",
    type: "info",
    status: "expired",
    priority: "low",
    startDate: "2026-01-01T00:00",
    endDate: "2026-01-05T23:59",
    creator: "Admin",
    isActive: false,
    createdAt: "2025-12-30T00:00:00",
    updatedAt: "2025-12-30T00:00:00",
  },
  {
    id: "15",
    title: "Khuyến mãi tháng 21",
    content: "Giảm giá 20% cho tất cả gói dịch vụ trong tháng 2",
    type: "success",
    status: "active",
    priority: "high",
    startDate: "2026-02-01T00:00",
    endDate: "2026-02-28T23:59",
    creator: "Marketing",
    isActive: true,
    createdAt: "2026-01-28T00:00:00",
    updatedAt: "2026-01-28T00:00:00",
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null)

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const matchesSearch =
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.content.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === "all" || notification.type === typeFilter
      const matchesStatus = statusFilter === "all" || notification.status === statusFilter

      return matchesSearch && matchesType && matchesStatus
    })
  }, [notifications, searchTerm, typeFilter, statusFilter])

  const handleReset = () => {
    setSearchTerm("")
    setTypeFilter("all")
    setStatusFilter("all")
  }

  const handleCreate = () => {
    setEditingNotification(null)
    setDialogOpen(true)
  }

  const handleEdit = (notification: Notification) => {
    setEditingNotification(notification)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa thông báo này?")) {
      setNotifications(notifications.filter((n) => n.id !== id))
    }
  }

  const handleSave = (data: Partial<Notification>) => {
    // Determine status based on dates
    const now = new Date()
    const start = new Date(data.startDate!)
    const end = data.endDate ? new Date(data.endDate) : null

    let status: NotificationStatus = "active"
    if (now < start) {
      status = "scheduled"
    } else if (end && now > end) {
      status = "expired"
    } else {
      status = data.isActive ? "active" : "scheduled"
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
      )
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
      }
      setNotifications([...notifications, newNotification])
    }

    setDialogOpen(false)
    setEditingNotification(null)
  }

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
                  <p className="text-muted-foreground text-sm mt-0.5">Platform Administration & Settings</p>
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
          notification={editingNotification}
        />
      </div>
    </div>
  )
}
