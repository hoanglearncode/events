// components/features/admin/orders/OrderDetailDialog.tsx

"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MessageSquare,
  CheckCircle2,
  RotateCcw,
  ExternalLink,
  Download,
  Loader2,
} from "lucide-react";
import { OrderDetail } from "@/types/order";
import { useOrderActions } from "@/hooks/queries/useOrders";
import { useConfirmDelivery } from "@/hooks/queries/orderQueries";
import { useState } from "react";
import { StatusBadge } from "./StatusBadge";
import { toast } from "sonner";

interface OrderDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderDetail | null;
  loading: boolean;
  onRefresh: () => void;
}

export function OrderDetailDialog({
  open,
  onOpenChange,
  order,
  loading,
  onRefresh,
}: OrderDetailDialogProps) {
  const [actionDialog, setActionDialog] = useState<{
    type: "fulfill" | "refund" | "deliver" | null;
    open: boolean;
  }>({ type: null, open: false });

  const {
    loading: actionLoading,
    fulfillOrder,
    refundOrder,
    downloadInvoice,
  } = useOrderActions();

  const confirmDelivery = useConfirmDelivery();

  const handleFulfill = async () => {
    if (!order) return;
    const success = await fulfillOrder({ orderId: order.id });
    if (success) {
      setActionDialog({ type: null, open: false });
      onRefresh();
    }
  };

  const handleRefund = async () => {
    if (!order) return;
    const success = await refundOrder({
      orderId: order.id,
      reason: "Customer request",
    });
    if (success) {
      setActionDialog({ type: null, open: false });
      onRefresh();
    }
  };

  const handleDownloadInvoice = async () => {
    if (!order) return;
    await downloadInvoice(order.id);
  };

  const handleConfirmDelivery = async () => {
    if (!order) return;
    setActionDialog({ type: "deliver", open: true });
  };

  const performConfirmDelivery = async () => {
    if (!order) return;
    try {
      await confirmDelivery.mutateAsync(order.id);
      onRefresh();
      toast.success("Xác nhận thành công. Tiền đã được cộng vào ví.");
    } catch (error) {
      console.error("Error confirming delivery:", error);
    } finally {
      setActionDialog({ type: null, open: false });
    }
  };

  if (!order) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xl max-h-[90vh] p-0">
          <DialogHeader className="px-10 pt-10">
            <DialogTitle className="text-2xl font-extrabold tracking-tight">
              Chi tiết đơn hàng
            </DialogTitle>
            <p className="text-sm text-muted-foreground uppercase font-bold tracking-widest">
              {order.id}
            </p>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-120px)] px-10 pb-10">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-10">
                {/* Customer Info */}
                <section className="space-y-4">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-2">
                    Thông tin khách hàng
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-muted/50 border border-border">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">
                        Email
                      </p>
                      <p className="text-sm font-semibold">
                        {order.customer.email}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50 border border-border">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">
                        Trạng thái
                      </p>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" size="lg">
                    <MessageSquare size={16} className="mr-2" />
                    Nhắn tin cho khách hàng
                  </Button>
                </section>

                <Separator />

                {/* Product Info */}
                <section className="space-y-4">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-2">
                    Thông tin sản phẩm
                  </h4>
                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-bold mb-1">
                          {order.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Số lượng: {order.qty}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{order.amount}₫</p>
                        <p className="text-xs text-brand-error">
                          Phí: {order.fee}₫
                        </p>
                        <p className="text-xs text-brand-success font-bold">
                          Lợi nhuận: {order.payout}₫
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Management Actions */}
                <section className="space-y-4">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-2">
                    Hành động quản lý
                  </h4>
                  {/* Confirm Delivery Button - Only show for PAID orders */}
                  {(order.status === "PAID" || order.status === "PENDING") && (
                    <Button
                      onClick={handleConfirmDelivery}
                      disabled={confirmDelivery.isPending}
                      className="w-full bg-green-600 hover:bg-green-700 text-white mb-3"
                    >
                      {confirmDelivery.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={20} className="mr-2" />
                          Xác nhận giao hàng
                        </>
                      )}
                    </Button>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="flex flex-col items-center gap-2 h-auto py-4"
                      onClick={() =>
                        setActionDialog({ type: "fulfill", open: true })
                      }
                      disabled={order.status !== "Processing"}
                    >
                      <CheckCircle2 size={20} className="text-brand-success" />
                      <span className="text-[10px] font-bold uppercase">
                        Giao quyền
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex flex-col items-center gap-2 h-auto py-4"
                      onClick={() =>
                        setActionDialog({ type: "refund", open: true })
                      }
                      disabled={order.status === "Refunded"}
                    >
                      <RotateCcw size={20} className="text-purple-500" />
                      <span className="text-[10px] font-bold uppercase">
                        Hoàn tiền
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex flex-col items-center gap-2 h-auto py-4"
                    >
                      <ExternalLink size={20} className="text-blue-500" />
                      <span className="text-[10px] font-bold uppercase">
                        Xem Audit Log
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex flex-col items-center gap-2 h-auto py-4"
                      onClick={handleDownloadInvoice}
                    >
                      <Download size={20} className="text-muted-foreground" />
                      <span className="text-[10px] font-bold uppercase">
                        In hóa đơn
                      </span>
                    </Button>
                  </div>
                </section>

                <Separator />

                {/* Timeline */}
                <section className="space-y-4">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-2">
                    Lịch sử trạng thái
                  </h4>
                  <div className="space-y-4 pl-2">
                    {order.timeline.map((item, idx) => (
                      <div key={item.id} className="flex gap-4 relative">
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 z-10 ${
                            idx === 0
                              ? "bg-brand-success"
                              : idx === 1
                                ? "bg-blue-500"
                                : "bg-brand-warning"
                          }`}
                        />
                        {idx < order.timeline.length - 1 && (
                          <div className="absolute left-1 top-2 w-px h-full bg-border" />
                        )}
                        <div>
                          <p className="text-xs font-bold">{item.label}</p>
                          <p className="text-[10px] text-muted-foreground tracking-wide">
                            {item.timestamp} • {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Fulfill Confirmation Dialog */}
      <AlertDialog
        open={actionDialog.type === "fulfill" && actionDialog.open}
        onOpenChange={(open) => setActionDialog({ type: null, open: false })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận giao quyền</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn giao quyền đơn hàng này cho khách hàng? Hành động
              này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleFulfill} disabled={actionLoading}>
              {actionLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Refund Confirmation Dialog */}
      <AlertDialog
        open={actionDialog.type === "refund" && actionDialog.open}
        onOpenChange={(open) => setActionDialog({ type: null, open: false })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hoàn tiền</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn hoàn tiền đơn hàng này? Số tiền sẽ được hoàn lại
              vào ví của khách hàng.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRefund}
              disabled={actionLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {actionLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Hoàn tiền
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Deliver Confirmation Dialog */}
      <AlertDialog
        open={actionDialog.type === "deliver" && actionDialog.open}
        onOpenChange={(open) => setActionDialog({ type: null, open: false })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận giao hàng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xác nhận đã giao hàng? Tiền sẽ được cộng vào
              ví.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={confirmDelivery.isPending}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={performConfirmDelivery}
              disabled={confirmDelivery.isPending}
            >
              {confirmDelivery.isPending ? "Đang xử lý..." : "Xác nhận"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
