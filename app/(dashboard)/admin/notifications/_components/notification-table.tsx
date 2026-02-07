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

export function NotificationTable({
  notifications,
  onEdit,
  onDelete,
}: Props) {
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
                  <Badge variant="outline">{typeLabels[n.type]}</Badge>
                </TableCell>

                <TableCell>
                  <Badge variant="outline">
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
