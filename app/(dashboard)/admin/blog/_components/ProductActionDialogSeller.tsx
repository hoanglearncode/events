// components/admin/products/ProductActionDialogSeller.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { AdminProduct } from "@/hooks/queries/useProductsQuery";

type ProductActionDialogProps = {
  open: boolean;
  product: AdminProduct | null;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

export default function ProductActionDialogSeller({
  open,
  product,
  onClose,
  onConfirm,
}: ProductActionDialogProps) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open) setReason("");
  }, [open]);

  const handleConfirm = () => {
    if (!reason.trim()) return;
    onConfirm(reason.trim());
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive">Xóa sản phẩm</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Product info */}
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="text-sm font-semibold">{product?.meta?.name}</div>
            <div className="text-xs text-muted-foreground mt-1">
              ID: {product?.id}
            </div>
          </div>

          {/* Warning */}
          <div className="text-sm text-destructive">
            ⚠️ Hành động này không thể hoàn tác.
          </div>

          {/* Reason */}
          <div>
            <Label className="text-xs font-semibold mb-2 block">
              Lý do xóa <span className="text-destructive">*</span>
            </Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do xóa sản phẩm..."
              className="resize-none h-24"
            />
          </div>

          {/* Footer */}
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={!reason.trim()}
            >
              Xóa sản phẩm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
