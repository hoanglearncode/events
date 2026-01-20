// pages/admin/users/_components/UserStatsCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserCheck, UserX, Ban, Shield } from "lucide-react";

interface UserStats {
  total: number;
  active: number;
  inactive: number;
  banned: number;
  admins: number;
}

interface UserStatsCardProps {
  stats?: any;
  isLoading: boolean;
}

export function UserStatsCard({ stats, isLoading }: UserStatsCardProps) {
  const statsConfig = [
    {
      title: "Tổng người dùng",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Đã kích hoạt",
      value: stats?.activeUsers ?? 0,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Chưa kích hoạt",
      value: stats?.inactiveUsers ?? 0,
      icon: UserX,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Bị cấm",
      value: stats?.bannedUsers ?? 0,
      icon: Ban,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Quản trị viên",
      value: stats?.adminUsers ?? 0,
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {statsConfig.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
