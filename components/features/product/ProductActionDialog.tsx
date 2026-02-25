// components/admin/products/ProductActionDialog.tsx
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

type ActionType = "approve" | "reject" | "feature" | "delete";

type ProductActionDialogProps = {
  open: boolean;
  product: any | null;
  onClose: () => void;
  onConfirm: (action: ActionType) => void;
};

export default function ProductActionDialog({
  open,
  product,
  onClose,
  onConfirm,
}: ProductActionDialogProps) {
  const [action, setAction] = useState<ActionType>("approve");

  useEffect(() => {
    if (!open) {
      setAction("approve");
    }
  }, [open]);

  const actions: {
    value: ActionType;
    label: string;
    baseClass: string;
    activeClass: string;
  }[] = [
    {
      value: "approve",
      label: "✓ Phê duyệt",
      baseClass:
        "bg-brand-success/10 text-brand-success hover:bg-brand-success/20",
      activeClass: "border-brand-success ring-brand-success/30",
    },
    {
      value: "reject",
      label: "✗ Từ chối",
      baseClass: "bg-brand-error/10 text-brand-error hover:bg-brand-error/20",
      activeClass: "border-brand-error ring-brand-error/30",
    },
    {
      value: "feature",
      label: "Nổi bật",
      baseClass:
        "bg-brand-warning/10 text-brand-warning hover:bg-brand-warning/20",
      activeClass: "border-brand-warning ring-brand-warning/30",
    },
    {
      value: "delete",
      label: "🗑️ Xóa",
      baseClass: "bg-muted text-foreground hover:bg-muted/80",
      activeClass: "border-destructive ring-destructive/30 text-destructive",
    },
  ];

  const handleConfirm = () => {
    onConfirm(action);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? null : onClose())}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Hành động với sản phẩm</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Product info */}
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="text-sm font-semibold">{product?.meta.name}</div>
            <div className="text-xs text-muted-foreground mt-1">
              ID: {product?.id} • Seller: {product?.meta.sellerName}
            </div>
          </div>

          {/* Action selector */}
          <div>
            <Label className="text-xs font-semibold mb-3 block">
              Chọn hành động
            </Label>

            <div className="grid grid-cols-2 gap-2">
              {actions.map((act) => {
                const isActive = action === act.value;

                return (
                  <button
                    key={act.value}
                    type="button"
                    onClick={() => setAction(act.value)}
                    className={[
                      "px-3 py-2.5 rounded-md border text-sm font-medium transition-all",
                      "focus:outline-none",
                      act.baseClass,
                      isActive
                        ? `border-2 ring-2 ${act.activeClass}`
                        : "border-border",
                    ].join(" ")}
                  >
                    {act.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button onClick={handleConfirm}>Xác nhận</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
