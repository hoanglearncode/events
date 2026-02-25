// components/payment/PaymentModal.tsx

"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Wallet,
  CreditCard,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { WalletBalance } from "./WalletBalance";
import { PaymentInfoForm } from "./PaymentInfoForm";
import { PaymentResult } from "./PaymentResult";
import { cn } from "@/lib/utils";

export function PaymentModal({
  invoice,
  userId,
  isOpen,
  onClose,
  onSuccess,
  onError,
}: any) {
  const [step, setStep] = useState<
    "select" | "confirm" | "processing" | "result"
  >("select");
  const [selectedProvider, setSelectedProvider] =
    useState<any>("PAYOS");
  const [transactionId, setTransactionId] = useState<string | null>(null);

  
  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep("select");
      setSelectedProvider("PAYOS");
      setTransactionId(null);
    }
  }, [isOpen]);

  // Handle payment creation
  const handleCreatePayment = async () => {
    setStep("processing");

    try {
      
    } catch (error) {
      setStep("result");
      onError?.(error as Error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case "select":
        return (
          <div className="space-y-6">
            {/* Invoice Summary */}
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="mb-3 font-semibold">Chi tiết hóa đơn</h3>
              <div className="space-y-2 text-sm">
                {invoice.items.map((item : any) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      {new Intl.NumberFormat("vi-VN").format(
                        item.price * item.quantity
                      )}{" "}
                      {item.currency === "VND" ? "₫" : "$"}
                    </span>
                  </div>
                ))}
                {invoice.discount && invoice.discount > 0 && (
                  <div className="flex justify-between text-brand-success">
                    <span>Giảm giá</span>
                    <span>
                      -{new Intl.NumberFormat("vi-VN").format(invoice.discount)}{" "}
                      {invoice.currency === "VND" ? "₫" : "$"}
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-base font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-brand-primary">
                    {new Intl.NumberFormat("vi-VN").format(invoice.total)}{" "}
                    {invoice.currency === "VND" ? "₫" : "$"}
                  </span>
                </div>
              </div>
            </div>


            {/* Payment Method Selection */}
            <div>
              <h3 className="mb-3 font-semibold">
                Chọn phương thức thanh toán
              </h3>
              <PaymentMethodSelector
                selected={selectedProvider}
                onChange={setSelectedProvider}
                currency={invoice.currency}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-lg border border-border bg-secondary px-4 py-2.5 font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
              >
                Hủy
              </button>
              <button
                onClick={() => setStep("confirm")}
                className="flex-1 rounded-lg bg-brand-primary px-4 py-2.5 font-medium text-white transition-colors hover:opacity-90"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        );

      case "confirm":
        return (
          <div className="space-y-6">
            <Alert>
              <AlertDescription>
                Bạn sắp thanh toán{" "}
                <strong className="text-brand-primary">
                  {new Intl.NumberFormat("vi-VN").format(invoice.total)}{" "}
                  {invoice.currency === "VND" ? "₫" : "$"}
                </strong>{" "}
                qua{" "}
                {selectedProvider === "PAYOS"
                  ? "Chuyển khoản ngân hàng"
                  : "PayPal"}
              </AlertDescription>
            </Alert>

            <PaymentInfoForm provider={selectedProvider} userId={userId} />

            <div className="flex gap-3">
              <button
                onClick={() => setStep("select")}
                className="flex-1 rounded-lg border border-border bg-secondary px-4 py-2.5 font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
              >
                Quay lại
              </button>
              <button
                onClick={handleCreatePayment}
                className="flex-1 rounded-lg bg-brand-primary px-4 py-2.5 font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
              >
              </button>
            </div>
          </div>
        );

      case "processing":
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-brand-primary" />
            <h3 className="mb-2 text-lg font-semibold">
              Đang xử lý thanh toán...
            </h3>
            <p className="text-center text-sm text-muted-foreground">
              Vui lòng đợi trong giây lát
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-brand-primary" />
            Thanh toán
            {step !== "select" && (
              <Badge variant="outline" className="ml-auto">
                {step === "confirm" && "Xác nhận"}
                {step === "processing" && "Đang xử lý"}
                {step === "result" && "Kết quả"}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">{renderStep()}</div>
      </DialogContent>
    </Dialog>
  );
}
