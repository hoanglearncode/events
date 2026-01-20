"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

export default function SellerNotificationsPage() {
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useMyNotifications();
  const readOneMutation = useReadNotification();
  const readAllMutation = useReadAllNotifications();

  const onReadOne = async (id: number) => {
    await readOneMutation.mutateAsync(id);
  };

  const onReadAll = async () => {
    await readAllMutation.mutateAsync();
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      <main className="flex-1 overflow-y-auto p-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Thông báo</h1>
            <p className="text-muted-foreground">
              Quản lý & theo dõi thông báo hệ thống
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={onReadAll}
              disabled={readAllMutation.isPending}
            >
              Đọc tất cả
            </Button>

            <Button
              onClick={() => setOpen(true)}
              variant="outline"
              className="border-border bg-card"
            >
              Thêm thông báo
            </Button>
          </div>
        </div>

        {/* LIST */}
        <Card className="border-border bg-card/50">
          <CardHeader className="border-b pb-4">
            <CardTitle>Danh sách thông báo</CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading && (
              <p className="p-6 text-center text-muted-foreground">
                Đang tải thông báo...
              </p>
            )}

            {!isLoading && data?.length === 0 && (
              <p className="p-6 text-center text-muted-foreground">
                Không có thông báo nào
              </p>
            )}

            <div className="divide-y divide-border">
              {data?.map((notification: NotificationResponse) => {
                const isUnread = !notification.read;

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex items-start gap-4 p-4 transition-colors",
                      isUnread
                        ? "bg-primary/5 hover:bg-primary/10"
                        : "hover:bg-muted/30"
                    )}
                  >
                    {/* TYPE BADGE */}
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xs font-semibold uppercase">
                      {notification.type?.charAt(0).toUpperCase()}
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-sm truncate">
                          {notification.title}
                        </p>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-primary mt-1" />
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>

                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* ACTION */}
                    <div className="flex flex-col gap-2">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onReadOne(notification.id)}
                          disabled={readOneMutation.isPending}
                        >
                          Đánh dấu đã đọc
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* ADMIN DIALOG */}
      <NotiDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
