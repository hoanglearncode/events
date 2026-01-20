"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useBroadcastNotification } from "@/hooks/queries/notiQueries";
import { NotificationFormValues } from "@/hooks/queries/notiQueries";

type NotiDialogProps = {
  open: boolean;
  isEditing?: boolean; // hiện tại chưa support edit
  onOpenChange: (open: boolean) => void;
};

const initialForm: NotificationFormValues = {
  title: "",
  type: "SYSTEM",
  message: "",
};

export default function NotiDialog({
  open,
  isEditing = false,
  onOpenChange,
}: NotiDialogProps) {
  const [form, setForm] = useState<NotificationFormValues>(initialForm);

  const { mutateAsync, isPending } = useBroadcastNotification();

  // Reset form khi đóng dialog
  useEffect(() => {
    if (!open) {
      setForm(initialForm);
    }
  }, [open]);

  const onChange =
    (key: keyof NotificationFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({
        ...prev,
        [key]: e.target.value,
      }));
    };

  const isValid = form.title.trim() && form.type.trim() && form.message.trim();

  const onSave = async () => {
    if (!isValid) return;

    try {
      await mutateAsync(form);
      onOpenChange(false);
    } catch (err) {
      console.error("Create notification failed", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa thông báo" : "Thêm thông báo mới"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Tiêu đề <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={onChange("title")}
              placeholder="Ví dụ: Bảo trì hệ thống"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Mô tả <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={form.message}
              onChange={onChange("message")}
              placeholder="Nội dung thông báo gửi tới toàn bộ người dùng..."
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Hủy
          </Button>
          <Button onClick={onSave} disabled={!isValid || isPending}>
            {isPending
              ? "Đang gửi..."
              : isEditing
                ? "Lưu thay đổi"
                : "Tạo thông báo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
