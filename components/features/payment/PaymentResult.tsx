// components/payment/PaymentResult.tsx

"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Loader2,
  QrCode,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PaymentResultProps {
  transaction: any | null;
  isLoading: boolean;
  onClose: () => void;
  onRetry: () => void;
}

export function PaymentResult({
  transaction,
  isLoading,
  onClose,
  onRetry,
}: PaymentResultProps) {
  const [countdown, setCountdown] = useState(5);

  // Auto-close on success
  useEffect(() => {
    if (transaction?.status === "COMPLETED" && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [transaction?.status, countdown]);

  useEffect(() => {
    if (countdown === 0 && transaction?.status === "COMPLETED") {
      onClose();
    }
  }, [countdown, transaction?.status, onClose]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="mb-4 h-12 w-12 animate-spin text-brand-primary" />
        <h3 className="mb-2 text-lg font-semibold">Đang tải kết quả...</h3>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="mb-4 rounded-full bg-destructive/10 p-4">
            <XCircle className="h-12 w-12 text-destructive" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">Có lỗi xảy ra</h3>
          <p className="text-center text-muted-foreground">
            Không thể tạo giao dịch. Vui lòng thử lại.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-border bg-secondary px-4 py-2.5 font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            Đóng
          </button>
          <button
            onClick={onRetry}
            className="flex-1 rounded-lg bg-brand-primary px-4 py-2.5 font-medium text-white transition-colors hover:opacity-90"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(transaction.status);

  return (
    <div className="space-y-6">
      {/* Status Icon */}
      <div className="flex flex-col items-center justify-center py-6">
        <div className={cn("mb-4 rounded-full p-4", statusConfig.bgColor)}>
          <statusConfig.icon
            className={cn("h-12 w-12", statusConfig.iconColor)}
          />
        </div>
        <h3 className="mb-2 text-xl font-semibold">{statusConfig.title}</h3>
        <p className="text-center text-muted-foreground">
          {statusConfig.description}
        </p>
      </div>

      {/* Transaction Details */}
      <div className="space-y-3 rounded-lg border border-border bg-card p-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Mã giao dịch</span>
          <span className="font-mono font-medium">
            {transaction.id.slice(0, 8)}...
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Số tiền</span>
          <span className="font-semibold">
            {new Intl.NumberFormat("vi-VN").format(transaction.amount)}{" "}
            {transaction.currency === "VND" ? "₫" : "$"}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Phương thức</span>
          <Badge variant="outline">{transaction.provider}</Badge>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Trạng thái</span>
          <Badge className={statusConfig.badgeClass}>
            {statusConfig.statusText}
          </Badge>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Thời gian</span>
          <span className="font-medium">
            {new Date(transaction.createdAt).toLocaleString("vi-VN")}
          </span>
        </div>
      </div>

      {/* QR Code for PayOS */}
      {transaction.qrCode && transaction.status === "PENDING" && (
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <QrCode className="h-5 w-5 text-brand-primary" />
            <h4 className="font-semibold">Quét mã QR để thanh toán</h4>
          </div>
          <div className="flex justify-center">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                transaction.qrCode
              )}`}
              alt="QR Code"
              className="rounded-lg border border-border"
            />
          </div>
        </div>
      )}

      {/* Checkout URL */}
      {transaction.checkoutUrl && transaction.status === "PENDING" && (
        <Alert>
          <AlertDescription className="flex items-center justify-between">
            <span className="text-sm">Hoặc thanh toán qua link</span>
            <a
              href={transaction.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-primary hover:underline"
            >
              Mở link thanh toán
              <ExternalLink className="h-4 w-4" />
            </a>
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {transaction.status === "COMPLETED" ? (
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-brand-primary px-4 py-2.5 font-medium text-white transition-colors hover:opacity-90"
          >
            Hoàn tất {countdown > 0 && `(${countdown}s)`}
          </button>
        ) : transaction.status === "FAILED" ? (
          <>
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-border bg-secondary px-4 py-2.5 font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              Đóng
            </button>
            <button
              onClick={onRetry}
              className="flex-1 rounded-lg bg-brand-primary px-4 py-2.5 font-medium text-white transition-colors hover:opacity-90"
            >
              Thử lại
            </button>
          </>
        ) : (
          <button
            onClick={onClose}
            className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            Đóng
          </button>
        )}
      </div>

      {/* Pending Instructions */}
      {transaction.status === "PENDING" && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            Giao dịch đang chờ xác nhận. Vui lòng hoàn tất thanh toán trong vòng
            15 phút.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

function getStatusConfig(status: any) {
  switch (status) {
    case "COMPLETED":
      return {
        icon: CheckCircle2,
        iconColor: "text-brand-success",
        bgColor: "bg-brand-success/10",
        badgeClass:
          "bg-brand-success/10 text-brand-success border-brand-success/20",
        title: "Thanh toán thành công",
        description: "Giao dịch đã được xử lý thành công",
        statusText: "Hoàn tất",
      };
    case "FAILED":
      return {
        icon: XCircle,
        iconColor: "text-brand-error",
        bgColor: "bg-brand-error/10",
        badgeClass: "bg-brand-error/10 text-brand-error border-brand-error/20",
        title: "Thanh toán thất bại",
        description: "Có lỗi xảy ra trong quá trình xử lý",
        statusText: "Thất bại",
      };
    case "CANCELLED":
      return {
        icon: XCircle,
        iconColor: "text-muted-foreground",
        bgColor: "bg-muted",
        badgeClass: "bg-muted text-muted-foreground",
        title: "Thanh toán đã hủy",
        description: "Giao dịch đã được hủy",
        statusText: "Đã hủy",
      };
    case "PENDING":
    default:
      return {
        icon: Clock,
        iconColor: "text-brand-warning",
        bgColor: "bg-brand-warning/10",
        badgeClass:
          "bg-brand-warning/10 text-brand-warning border-brand-warning/20",
        title: "Chờ thanh toán",
        description: "Vui lòng hoàn tất thanh toán",
        statusText: "Đang chờ",
      };
  }
}
