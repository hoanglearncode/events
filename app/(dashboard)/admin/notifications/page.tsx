"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NotiDialog from "./_components/NotiDialog";
import {
  NotificationResponse,
  useMyNotifications,
} from "@/hooks/queries/notiQueries";
import {
  useReadNotification,
  useReadAllNotifications,
} from "@/hooks/queries/notiQueries";
import { cn } from "@/lib/utils";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Filter,
  Plus,
  Search,
  Trash2,
  Eye,
  AlertCircle,
  Info,
  MessageSquare,
  ShoppingCart,
  Package,
} from "lucide-react";

// Notification type icons mapping
const typeIcons = {
  order: ShoppingCart,
  product: Package,
  system: AlertCircle,
  info: Info,
  message: MessageSquare,
};

// Notification type colors
const typeColors = {
  order: "bg-brand-primary/10 text-brand-primary border-brand-primary/20",
  product: "bg-brand-success/10 text-brand-success border-brand-success/20",
  system: "bg-brand-error/10 text-brand-error border-brand-error/20",
  info: "bg-brand-accent/10 text-brand-accent border-brand-accent/20",
  message: "bg-brand-warning/10 text-brand-warning border-brand-warning/20",
};

export default function AdminNotificationsPage() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("all");

  const { data, isLoading } = useMyNotifications();
  const readOneMutation = useReadNotification();
  const readAllMutation = useReadAllNotifications();

  const onReadOne = async (id: number) => {
    await readOneMutation.mutateAsync(id);
  };

  const onReadAll = async () => {
    await readAllMutation.mutateAsync();
  };

  // Filter notifications
  const filteredNotifications = data?.filter((notification: NotificationResponse) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "all" || notification.type === filterType;
    
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "unread" && !notification.read) ||
      (activeTab === "read" && notification.read);

    return matchesSearch && matchesType && matchesTab;
  });

  const unreadCount = data?.filter((n: NotificationResponse) => !n.read).length || 0;
  const readCount = data?.filter((n: NotificationResponse) => n.read).length || 0;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl shadow-lg">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">
                  Quản lý thông báo
                </h1>
                <p className="text-muted-foreground mt-1">
                  Theo dõi & quản lý thông báo hệ thống
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={onReadAll}
                disabled={readAllMutation.isPending || unreadCount === 0}
                className="gap-2 bg-card hover:bg-muted"
              >
                <CheckCheck className="w-4 h-4" />
                Đọc tất cả ({unreadCount})
              </Button>

              <Button
                onClick={() => setOpen(true)}
                className="gap-2 bg-brand-primary hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/30"
              >
                <Plus className="w-4 h-4" />
                Tạo thông báo
              </Button>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="border-border shadow-md glass-dark">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-accent/20 rounded-lg">
                    <Bell className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tổng số</p>
                    <p className="text-2xl font-bold text-foreground">{data?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-md glass-dark">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-warning/20 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-brand-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Chưa đọc</p>
                    <p className="text-2xl font-bold text-foreground">{unreadCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-md glass-dark">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-success/20 rounded-lg">
                    <CheckCheck className="w-5 h-5 text-brand-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Đã đọc</p>
                    <p className="text-2xl font-bold text-foreground">{readCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FILTERS & TABS */}
        <Card className="border-border shadow-xl glass-dark">
          <CardHeader className="border-b border-border bg-muted/30">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm thông báo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card border-border"
                />
              </div>

              {/* Type Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px] bg-card border-border">
                    <SelectValue placeholder="Loại thông báo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại</SelectItem>
                    <SelectItem value="order">Đơn hàng</SelectItem>
                    <SelectItem value="product">Sản phẩm</SelectItem>
                    <SelectItem value="system">Hệ thống</SelectItem>
                    <SelectItem value="info">Thông tin</SelectItem>
                    <SelectItem value="message">Tin nhắn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b border-border px-6 bg-muted/20">
                <TabsList className="bg-transparent h-12">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-card data-[state=active]:shadow-sm"
                  >
                    Tất cả ({data?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger
                    value="unread"
                    className="data-[state=active]:bg-card data-[state=active]:shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      Chưa đọc
                      {unreadCount > 0 && (
                        <Badge className="bg-brand-warning hover:bg-brand-warning/90">
                          {unreadCount}
                        </Badge>
                      )}
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="read"
                    className="data-[state=active]:bg-card data-[state=active]:shadow-sm"
                  >
                    Đã đọc ({readCount})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="m-0">
                {isLoading && (
                  <div className="p-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-muted border-t-brand-primary"></div>
                    <p className="mt-4 text-muted-foreground">Đang tải thông báo...</p>
                  </div>
                )}

                {!isLoading && filteredNotifications?.length === 0 && (
                  <div className="p-12 text-center">
                    <BellOff className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-foreground font-medium">
                      Không tìm thấy thông báo nào
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Thử thay đổi bộ lọc hoặc tìm kiếm khác
                    </p>
                  </div>
                )}

                <div className="divide-y divide-border">
                  {filteredNotifications?.map((notification: NotificationResponse) => {
                    const isUnread = !notification.read;
                    const TypeIcon =
                      typeIcons[notification.type as keyof typeof typeIcons] ||
                      Bell;
                    const typeColorClass =
                      typeColors[notification.type as keyof typeof typeColors] ||
                      "bg-muted text-muted-foreground border-border";

                    return (
                      <div
                        key={notification.id}
                        className={cn(
                          "flex items-start gap-4 p-5 transition-all hover:bg-muted/50",
                          isUnread && "bg-brand-accent/5 border-l-4 border-l-brand-primary"
                        )}
                      >
                        {/* TYPE ICON */}
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl border-2 flex items-center justify-center flex-shrink-0",
                            typeColorClass
                          )}
                        >
                          <TypeIcon className="w-5 h-5" />
                        </div>

                        {/* CONTENT */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-foreground">
                                {notification.title}
                              </h3>
                              <Badge
                                variant="outline"
                                className="text-xs capitalize border-border"
                              >
                                {notification.type}
                              </Badge>
                              {isUnread && (
                                <Badge className="bg-brand-primary hover:bg-brand-primary/90 text-xs">
                                  Mới
                                </Badge>
                              )}
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                            {notification.message}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {new Date(notification.createdAt).toLocaleString(
                                "vi-VN",
                                {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                }
                              )}
                            </span>
                          </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          {isUnread && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onReadOne(notification.id)}
                              disabled={readOneMutation.isPending}
                              className="gap-2 hover:bg-brand-accent/20 hover:text-brand-primary"
                            >
                              <Check className="w-4 h-4" />
                              Đánh dấu đã đọc
                            </Button>
                          )}
                          {notification.read && (
                            <div className="flex items-center gap-2 text-xs text-brand-success px-3 py-2 bg-brand-success/10 rounded-lg">
                              <CheckCheck className="w-4 h-4" />
                              Đã đọc
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* ADMIN DIALOG */}
      <NotiDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}