"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Bell, CheckCircle, Clock, XCircle } from "lucide-react"
import { Notification } from "../_types/notification"

interface NotificationStatsProps {
  notifications: Notification[]
}

export function NotificationStats({ notifications }: NotificationStatsProps) {
  const stats = {
    total: notifications.length,
    active: notifications.filter(n => n.status === "active").length,
    scheduled: notifications.filter(n => n.status === "scheduled").length,
    expired: notifications.filter(n => n.status === "expired").length,
  }

  const statCards = [
    {
      title: "Tổng thông báo",
      value: stats.total,
      icon: Bell,
      color: "text-brand-primary",
      bgColor: "bg-brand-primary/10",
    },
    {
      title: "Đang hoạt động",
      value: stats.active,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Đã lên lịch",
      value: stats.scheduled,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Đã hết hạn",
      value: stats.expired,
      icon: XCircle,
      color: "text-gray-500",
      bgColor: "bg-gray-100 dark:bg-gray-800/50",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="overflow-hidden transition-all hover:shadow-md">
          <CardContent className="">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="mt-1 text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`rounded-full p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
