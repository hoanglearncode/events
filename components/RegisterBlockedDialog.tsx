"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RegisterBlockedDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Đăng ký tạm thời đóng</DialogTitle>
          <DialogDescription>
            Hệ thống hiện đang tạm thời đóng chức năng đăng ký tài khoản mới.
            Vui lòng quay lại sau hoặc liên hệ quản trị viên.
          </DialogDescription>
        </DialogHeader>

        <Button className="w-full mt-4" onClick={() => onOpenChange(false)}>
          Đã hiểu
        </Button>
      </DialogContent>
    </Dialog>
  );
}
