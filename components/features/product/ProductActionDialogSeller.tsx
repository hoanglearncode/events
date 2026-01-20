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
  onConfirm: () => void;
};

export default function ProductActionDialogSeller({
  open,
  product,
  onClose,
  onConfirm,
}: ProductActionDialogProps) {
  const handleConfirm = () => {
    onConfirm();
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

          {/* Footer */}
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleConfirm}>
              Xóa sản phẩm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
