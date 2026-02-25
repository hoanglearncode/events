"use client";

import React, { useState, useMemo } from "react";
import {
  Bell,
  Briefcase,
  MessageSquare,
  Info,
  CheckCheck,
  MoreHorizontal,
  Trash2,
  Search,
  BellOff,
  Filter,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronDown,
  Clock,
  Users,
  SlidersHorizontal,
  Dot,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TablePagination } from "@/components/TablePagination";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
export type NotificationType = "info" | "success" | "warning" | "error";
export type NotificationStatus = "active" | "scheduled" | "expired";
export type PriorityLevel = "low" | "medium" | "high";

export interface NotificationFormData {
  title: string;
  content: string;
  type: NotificationType;
  priority: PriorityLevel;
  startDate: string;
  endDate: string;
  isActive: boolean;
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
  isRead?: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Cơ hội việc làm mới phù hợp với bạn",
    content:
      "Vị trí 'Senior Product Designer' tại VinGroup phù hợp với hồ sơ của bạn. Hạn nộp hồ sơ: 30/03/2025.",
    type: "info",
    status: "active",
    priority: "high",
    startDate: "2025-03-01",
    endDate: "2025-03-30",
    creator: "system",
    isActive: true,
    createdAt: "2025-03-20T08:00:00Z",
    updatedAt: "2025-03-20T08:00:00Z",
    recipients: ["user_1"],
    isRead: false,
  },
  {
    id: "2",
    title: "Lời mời phỏng vấn từ Viettel",
    content:
      "Bạn nhận được lời mời phỏng vấn trực tuyến từ bộ phận HR của Tập đoàn Viettel vào 14:00 ngày 25/03/2025.",
    type: "success",
    status: "active",
    priority: "high",
    startDate: "2025-03-20",
    creator: "hr_viettel",
    isActive: true,
    createdAt: "2025-03-20T07:00:00Z",
    updatedAt: "2025-03-20T07:00:00Z",
    recipients: ["user_1"],
    isRead: false,
  },
  {
    id: "3",
    title: "Bảo trì hệ thống định kỳ",
    content:
      "Hệ thống sẽ bảo trì vào 2:00 AM ngày mai để nâng cấp trải nghiệm người dùng. Thời gian dự kiến: 2 giờ.",
    type: "warning",
    status: "scheduled",
    priority: "medium",
    startDate: "2025-03-21",
    creator: "admin",
    isActive: true,
    createdAt: "2025-03-20T05:00:00Z",
    updatedAt: "2025-03-20T05:00:00Z",
    recipients: ["all"],
    isRead: true,
  },
  {
    id: "4",
    title: "Hồ sơ của bạn đã được duyệt",
    content:
      "Hồ sơ ứng tuyển vị trí UX Designer tại FPT Software đã được xét duyệt thành công. Vui lòng kiểm tra email.",
    type: "success",
    status: "active",
    priority: "medium",
    startDate: "2025-03-19",
    creator: "system",
    isActive: true,
    createdAt: "2025-03-19T15:00:00Z",
    updatedAt: "2025-03-19T15:00:00Z",
    recipients: ["user_1"],
    isRead: true,
  },
  {
    id: "5",
    title: "Cảnh báo: Đăng nhập bất thường",
    content:
      "Phát hiện đăng nhập từ thiết bị mới tại Hà Nội lúc 03:22 AM. Nếu không phải bạn, hãy đổi mật khẩu ngay.",
    type: "error",
    status: "active",
    priority: "high",
    startDate: "2025-03-20",
    creator: "security_system",
    isActive: true,
    createdAt: "2025-03-20T03:22:00Z",
    updatedAt: "2025-03-20T03:22:00Z",
    recipients: ["user_1"],
    isRead: false,
  },
  {
    id: "6",
    title: "Tin tức ngành: Xu hướng tuyển dụng Q2/2025",
    content:
      "Báo cáo mới nhất cho thấy nhu cầu tuyển dụng IT tăng 35% trong Q2/2025. Xem chi tiết các vị trí hot.",
    type: "info",
    status: "active",
    priority: "low",
    startDate: "2025-03-18",
    creator: "content_team",
    isActive: true,
    createdAt: "2025-03-18T10:00:00Z",
    updatedAt: "2025-03-18T10:00:00Z",
    recipients: ["all"],
    isRead: true,
  },
];

// ─── Config Maps ──────────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<
  NotificationType,
  {
    icon: React.ReactNode;
    label: string;
    iconBg: string;
    iconColor: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  info: {
    icon: <Info size={16} />,
    label: "Thông tin",
    iconBg: "bg-brand-primary/10",
    iconColor: "text-brand-primary",
    badgeBg: "bg-brand-primary/10",
    badgeText: "text-brand-primary",
  },
  success: {
    icon: <CheckCircle size={16} />,
    label: "Thành công",
    iconBg: "bg-brand-success/10",
    iconColor: "text-brand-success",
    badgeBg: "bg-brand-success/10",
    badgeText: "text-brand-success",
  },
  warning: {
    icon: <AlertTriangle size={16} />,
    label: "Cảnh báo",
    iconBg: "bg-yellow-500/10",
    iconColor: "text-yellow-600",
    badgeBg: "bg-yellow-500/10",
    badgeText: "text-yellow-600",
  },
  error: {
    icon: <XCircle size={16} />,
    label: "Lỗi",
    iconBg: "bg-brand-error/10",
    iconColor: "text-brand-error",
    badgeBg: "bg-brand-error/10",
    badgeText: "text-brand-error",
  },
};

const PRIORITY_CONFIG: Record<
  PriorityLevel,
  { label: string; dot: string; border: string }
> = {
  high: {
    label: "Cao",
    dot: "bg-brand-error",
    border: "border-l-brand-error",
  },
  medium: {
    label: "Trung bình",
    dot: "bg-yellow-500",
    border: "border-l-yellow-500",
  },
  low: {
    label: "Thấp",
    dot: "bg-muted-foreground",
    border: "border-l-muted-foreground/30",
  },
};

const STATUS_CONFIG: Record<
  NotificationStatus,
  { label: string; className: string }
> = {
  active: {
    label: "Đang hoạt động",
    className: "bg-brand-success/10 text-brand-success",
  },
  scheduled: {
    label: "Đã lên lịch",
    className: "bg-brand-primary/10 text-brand-primary",
  },
  expired: {
    label: "Hết hạn",
    className: "bg-muted text-muted-foreground",
  },
};

// ─── Helper ───────────────────────────────────────────────────────────────────
function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 flex flex-col gap-0.5 min-w-[110px]">
      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <span className={cn("text-2xl font-bold", accent ?? "text-foreground")}>
        {value}
      </span>
      {sub && <span className="text-[11px] text-muted-foreground">{sub}</span>}
    </div>
  );
}

// ─── Notification Row ─────────────────────────────────────────────────────────
function NotificationRow({
  n,
  onMarkRead,
  onDelete,
}: {
  n: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const typeConf = TYPE_CONFIG[n.type];
  const prioConf = PRIORITY_CONFIG[n.priority];
  const statusConf = STATUS_CONFIG[n.status];

  return (
    <div
      className={cn(
        "group relative flex items-start gap-3 px-4 py-3.5 border-l-[3px] border-b border-border transition-all duration-150 cursor-pointer",
        "hover:bg-muted/40",
        n.isRead
          ? "border-l-transparent bg-card"
          : cn("bg-card", prioConf.border),
        !n.isRead && "font-medium"
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "mt-0.5 flex-shrink-0 p-2 rounded-lg",
          typeConf.iconBg,
          typeConf.iconColor
        )}
      >
        {typeConf.icon}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0 space-y-0.5">
        {/* Top row: tags + time */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              "inline-flex items-center text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded",
              typeConf.badgeBg,
              typeConf.badgeText
            )}
          >
            {typeConf.label}
          </span>

          <span
            className={cn(
              "inline-flex items-center text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded",
              statusConf.className
            )}
          >
            {statusConf.label}
          </span>

          <span className="flex items-center gap-1 text-[10px] text-muted-foreground ml-auto whitespace-nowrap">
            <Clock size={10} />
            {formatRelativeTime(n.createdAt)}
          </span>
        </div>

        {/* Title */}
        <p
          className={cn(
            "text-sm leading-snug truncate group-hover:text-brand-primary transition-colors",
            n.isRead ? "text-foreground font-normal" : "text-foreground"
          )}
        >
          {n.title}
        </p>

        {/* Content */}
        <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed">
          {n.content}
        </p>

        {/* Bottom row */}
        <div className="flex items-center gap-3 pt-1">
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <span
              className={cn("h-1.5 w-1.5 rounded-full", prioConf.dot)}
            />
            Ưu tiên {prioConf.label}
          </span>

          {n.recipients.includes("all") ? (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Users size={10} /> Tất cả
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Users size={10} /> {n.recipients.length} người nhận
            </span>
          )}

          <button className="ml-auto text-[11px] font-semibold text-brand-primary flex items-center gap-0.5 hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
            Xem <ArrowUpRight size={11} />
          </button>
        </div>
      </div>

      {/* Unread dot */}
      {!n.isRead && (
        <span className="flex-shrink-0 mt-1.5 h-2 w-2 rounded-full bg-brand-secondary animate-pulse" />
      )}

      {/* Actions */}
      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground"
            >
              <MoreHorizontal size={15} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 glass-dark border-border text-sm">
            <DropdownMenuLabel className="text-xs text-muted-foreground">Hành động</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            {!n.isRead && (
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => onMarkRead(n.id)}
              >
                <CheckCheck className="mr-2 h-3.5 w-3.5" /> Đánh dấu đã đọc
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="cursor-pointer">
              <BellOff className="mr-2 h-3.5 w-3.5" /> Tắt loại này
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              className="text-brand-error cursor-pointer"
              onClick={() => onDelete(n.id)}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" /> Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const UserNotifications = () => {
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<NotificationType | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityLevel | "all">(
    "all"
  );
  const [activeTab, setActiveTab] = useState("all");
  const [pagination, setPagination] = useState({
    total: MOCK_NOTIFICATIONS.length,
    per_page: 10,
    current_page: 1,
    last_page: Math.ceil(MOCK_NOTIFICATIONS.length / 10),
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      const matchTab =
        activeTab === "all" ||
        (activeTab === "unread" && !n.isRead) ||
        (activeTab === "high" && n.priority === "high");
      const matchSearch =
        !search ||
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "all" || n.type === typeFilter;
      const matchPriority =
        priorityFilter === "all" || n.priority === priorityFilter;
      return matchTab && matchSearch && matchType && matchPriority;
    });
  }, [notifications, search, typeFilter, priorityFilter, activeTab]);

  const paginated = useMemo(() => {
    const start = (pagination.current_page - 1) * pagination.per_page;
    return filtered.slice(start, start + pagination.per_page);
  }, [filtered, pagination]);

  const handleMarkRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );

  const handleDelete = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const handleMarkAll = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-8 mt-16">
      <div className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="p-1.5 bg-primary rounded-lg">
                <Bell className="text-primary-foreground h-6 w-6" />
              </div>
              <h1 className="text-2xl lg:text-4xl font-bold tracking-tight text-primary">
                Thông báo
              </h1>
              {unreadCount > 0 && (
                <Badge className="bg-brand-secondary text-white hover:bg-brand-secondary/90 border-none h-5 px-2 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Cập nhật tin tức và cơ hội mới nhất dành cho bạn.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 text-xs border-border"
            onClick={handleMarkAll}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="mr-1.5 h-3.5 w-3.5" /> Đọc tất cả
          </Button>
        </div>

        {/* ── Search + Filter Bar ── */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm thông báo..."
              className="pl-9 h-9 text-sm bg-card border-border focus:ring-brand-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Type filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 text-xs border-border"
              >
                <SlidersHorizontal size={13} />
                {typeFilter === "all" ? "Loại" : TYPE_CONFIG[typeFilter].label}
                <ChevronDown size={12} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass-dark border-border text-sm w-36">
              <DropdownMenuLabel className="text-xs text-muted-foreground">Loại thông báo</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border"/>
              {(["all", "info", "success", "warning", "error"] as const).map(
                (t) => (
                  <DropdownMenuItem
                    key={t}
                    className="cursor-pointer"
                    onClick={() => setTypeFilter(t)}
                  >
                    {t === "all" ? "Tất cả" : TYPE_CONFIG[t].label}
                    {typeFilter === t && (
                      <CheckCheck size={12} className="ml-auto" />
                    )}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Priority filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 text-xs border-border"
              >
                <Filter size={13} />
                {priorityFilter === "all"
                  ? "Ưu tiên"
                  : PRIORITY_CONFIG[priorityFilter].label}
                <ChevronDown size={12} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass-dark border-border text-sm w-40">
              <DropdownMenuLabel className="text-xs text-muted-foreground">Mức ưu tiên</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border"/>
              {(["all", "high", "medium", "low"] as const).map((p) => (
                <DropdownMenuItem
                  key={p}
                  className="cursor-pointer"
                  onClick={() => setPriorityFilter(p)}
                >
                  {p !== "all" && (
                    <span
                      className={cn(
                        "mr-2 h-2 w-2 rounded-full",
                        PRIORITY_CONFIG[p].dot
                      )}
                    />
                  )}
                  {p === "all" ? "Tất cả" : PRIORITY_CONFIG[p].label}
                  {priorityFilter === p && (
                    <CheckCheck size={12} className="ml-auto" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="bg-muted/50 p-1 border border-border rounded inline-flex w-full sm:w-auto mb-0 h-8">
            {[
              { value: "all", label: "Tất cả" },
              {
                value: "unread",
                label: `Chưa đọc${unreadCount > 0 ? ` (${unreadCount})` : ""}`,
              },
              { value: "high", label: "Ưu tiên cao" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-xs border rounded px-4 h-6 data-[state=active]:bg-card data-[state=active]:text-brand-primary data-[state=active]:shadow-sm"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="outline-none mt-0 border border-border rounded">
            <div className="border border-border rounded overflow-hidden bg-card">
              {/* Column header */}
              <div className="flex items-center gap-3 px-4 py-2 bg-muted/40 border-b border-border">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground w-7" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex-1">
                  Nội dung thông báo
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hidden sm:block w-20 text-right">
                  Thời gian
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground w-7" />
              </div>

              <ScrollArea>
                {paginated.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                    <BellOff size={32} className="opacity-30" />
                    <p className="text-sm">Không có thông báo nào</p>
                  </div>
                ) : (
                  paginated.map((n) => (
                    <NotificationRow
                      key={n.id}
                      n={n}
                      onMarkRead={handleMarkRead}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </ScrollArea>

              {/* Footer count */}
              <div className="px-4 py-2 bg-muted/20 border-t border-border flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  Hiển thị {paginated.length}/{filtered.length} thông báo
                </span>
                {(typeFilter !== "all" || priorityFilter !== "all" || search) && (
                  <button
                    className="text-[11px] text-brand-primary hover:underline"
                    onClick={() => {
                      setSearch("");
                      setTypeFilter("all");
                      setPriorityFilter("all");
                    }}
                  >
                    Xóa bộ lọc
                  </button>
                )}
              </div>
            </div>
          </TabsContent>

          <TablePagination
            pagination={{
              ...pagination,
              total: filtered.length,
              last_page: Math.ceil(filtered.length / pagination.per_page),
            }}
            onPageChange={(page) => {
              if (!page) return;
              setPagination((prev) => ({ ...prev, current_page: Number(page) }));
            }}
            onPerPageChange={(perPage) => {
              setPagination((prev) => ({
                ...prev,
                per_page: perPage,
                current_page: 1,
                last_page: Math.ceil(filtered.length / perPage),
              }));
            }}
          />
        </Tabs>

        {/* ── Footer Banner ── */}
        <div className="bg-muted/30 px-4 py-3 rounded-xl border border-dashed border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <BellOff size={14} />
            <span>Quản lý tùy chọn nhận thông báo qua Email và đẩy (Push).</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-brand-accent text-brand-primary h-8 text-xs"
          >
            Cài đặt thông báo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserNotifications;