"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Zap, RotateCcw, XCircle } from "lucide-react";

export enum OrderStatus {
  PENDING = "Pending",
  PROCESSING = "Processing",
  FULFILLED = "Fulfilled",
  CANCELLED = "Cancelled",
  REFUNDED = "Refunded",
}

interface StatusBadgeProps {
  status: OrderStatus | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const configs: Record<
    string,
    {
      label: string;
      variant: "default" | "secondary" | "destructive" | "outline";
      className: string;
      icon: React.ReactNode;
    }
  > = {
    [OrderStatus.FULFILLED]: {
      label: "Hoàn tất",
      variant: "outline",
      className:
        "bg-brand-success/10 text-brand-success border-brand-success/20",
      icon: <CheckCircle2 size={12} />,
    },
    [OrderStatus.PROCESSING]: {
      label: "Đang xử lý",
      variant: "outline",
      className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      icon: <Clock size={12} />,
    },
    [OrderStatus.PENDING]: {
      label: "Chờ thanh toán",
      variant: "outline",
      className:
        "bg-brand-warning/10 text-brand-warning border-brand-warning/20",
      icon: <Zap size={12} />,
    },
    [OrderStatus.REFUNDED]: {
      label: "Đã hoàn tiền",
      variant: "outline",
      className: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      icon: <RotateCcw size={12} />,
    },
    [OrderStatus.CANCELLED]: {
      label: "Đã hủy",
      variant: "outline",
      className: "bg-brand-error/10 text-brand-error border-brand-error/20",
      icon: <XCircle size={12} />,
    },
  };

  const config = configs[status] || configs[OrderStatus.PENDING];

  return (
    <Badge
      variant={config.variant}
      className={`flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${config.className}`}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
}
