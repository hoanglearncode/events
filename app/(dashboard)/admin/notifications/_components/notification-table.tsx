"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { TablePagination } from "@/components/TablePagination";

import { useState, useMemo } from "react";

import {
  Notification,
  NotificationType,
  NotificationStatus,
} from "../_types/notification";
import { NOTIFICATION_TYPES, PRIORITIES, TYPE_ICONS } from "./notification-dialog";

/* =======================
   Props
======================= */

interface Props {
  notifications: Notification[];
  onEdit: (n: Notification) => void;
  onDelete: (id: string) => void;
}

/* =======================
   Labels
======================= */

const statusLabels: Record<NotificationStatus, string> = {
  active: "Đang hoạt động",
  scheduled: "Đã lên lịch",
  expired: "Đã hết hạn",
};

const typeLabels: Record<NotificationType, string> = {
  info: "Thông tin",
  success: "Thành công",
  warning: "Cảnh báo",
  error: "Lỗi",
};

/* =======================
   Component
======================= */

export function NotificationTable({ notifications, onEdit, onDelete }: Props) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const total = notifications.length;

  /* ===== Slice data (mock pagination FE) ===== */
  const data = useMemo(() => {
    const start = (page - 1) * perPage;
    return notifications.slice(start, start + perPage);
  }, [notifications, page, perPage]);

  const formatDate = (d?: string) => {
    if (!d) return "-";
    try {
      return format(new Date(d), "dd/MM/yyyy HH:mm", { locale: vi });
    } catch {
      return "-";
    }
  };

  if (total === 0) {
    return (
      <Card className="p-10 text-center text-muted-foreground">
        Không tìm thấy thông báo nào
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden py-0">
      {/* ===== Table ===== */}
      <div className="px-2 pt-1">
        <Table>
          <TableHeader>
            <TableRow className="px-2">
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Độ ưu tiên</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Bắt đầu</TableHead>
              <TableHead>Kết thúc</TableHead>
              <TableHead>Người tạo</TableHead>
              <TableHead className="text-center">Thao tác</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="px-2">
            {data.map((n) => (
              <TableRow key={n.id}>
                <TableCell>
                  <div className="font-medium">{n.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {n.content}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="inline-flex items-center gap-1">
                    <span
                      className={`inline-flex items-center justify-center h-5 w-5 rounded-full text-xs font-bold ${
                        NOTIFICATION_TYPES.find((t) => t.value === n.type)?.active
                      }`}
                    >
                      {TYPE_ICONS[n.type]}
                    </span>
                    <span className="text-sm font-medium">
                      {typeLabels[n.type]}
                    </span>
                  </div>
                </TableCell>
                
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${
                      PRIORITIES.find((p) => p.value === n.priority)?.activeClass
                    }`}
                  >
                    {n.priority.charAt(0).toUpperCase() + n.priority.slice(1)}
                  </span>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      n.status === "active"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                        : n.status === "scheduled"
                        ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                        : "border-red-500 bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300"
                    }
                  >
                    {statusLabels[n.status]}
                  </Badge>
                </TableCell>

                <TableCell>{formatDate(n.startDate)}</TableCell>
                <TableCell>{formatDate(n.endDate)}</TableCell>
                <TableCell>{n.creator}</TableCell>

                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onEdit(n)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="outline"
                      className="text-destructive hover:bg-destructive"
                      onClick={() => onDelete(n.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ===== Pagination ===== */}
      <TablePagination
        pagination={{
          total,
          per_page: perPage,
          current_page: page,
          last_page: Math.ceil(total / perPage),
        }}
        onPageChange={(p) => setPage(Number(p))}
        onPerPageChange={(pp) => {
          setPerPage(pp);
          setPage(1);
        }}
      />
    </Card>
  );
}
