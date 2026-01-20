"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Download,
  TrendingUp,
  CheckCircle2,
  Package,
  Users,
  DollarSign,
  Search,
  Eye,
  Truck,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { OrderDetailDialog } from "@/components/features/admin/order/OrderDetailDialog";
import {
  useSalesHistory,
  useConfirmDelivery,
} from "@/hooks/queries/orderQueries";
import { useOrderDetail } from "@/hooks/queries/useOrders";
import Cookie from "js-cookie";
import { ACCESS_TOKEN } from "@/shared/const/cookie";

// Interface matching OrderResponse from backend
interface OrderResponse {
  id: string;
  orderCode: string;
  status: string;
  totalAmount: number;
  netAmount: number;
  platformFee: number;
  currency: string;
  productId: string;
  productName: string;
  productSlug: string;
  thumbnailUrl?: string;
  quantity: number;
  sellerName: string;
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  buyerContent?: string;
  paymentTransactionId?: string;
  createdAt: string;
  updatedAt?: string;
}

interface OrderHistoryResponse {
  vnd: {
    orders: OrderResponse[];
    pagination: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
      from: number;
      to: number;
    };
  };
  usd: {
    orders: OrderResponse[];
    pagination: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
      from: number;
      to: number;
    };
  };
}

export default function SellerOrdersPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [deliveryContents, setDeliveryContents] = useState<
    Record<string, string>
  >({});
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [viewContentDialogOpen, setViewContentDialogOpen] = useState(false);
  const [currentBuyerContent, setCurrentBuyerContent] = useState("");

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(id);
  }, [searchTerm]);

  // Use sales-history API (use debounced search term)
  const {
    data: orderHistory,
    isLoading,
    error,
    refetch,
  } = useSalesHistory(page, size, debouncedSearchTerm, statusFilter);
  const confirmDelivery = useConfirmDelivery();

  // Order detail hook
  const {
    order: selectedOrder,
    loading: orderDetailLoading,
    refresh: refreshOrderDetail,
  } = useOrderDetail(selectedOrderId);

  // Merge orders from both VND and USD groups
  // const allOrders = useMemo(() => {
  //   if (!orderHistory) return [];
  //   const vndOrders = orderHistory.vnd?.orders || [];
  //   const usdOrders = orderHistory.usd?.orders || [];
  //   return [...vndOrders, ...usdOrders];
  // }, [orderHistory]);
  const allOrders = useMemo(() => {
    if (!orderHistory) return [];
    return orderHistory.orders;
  }, [orderHistory]);

  // Server provides filtered results based on `searchTerm` and `statusFilter`.
  // Do not apply additional client-side filtering — use the server response directly.
  const filteredOrders = useMemo(() => allOrders, [allOrders]);

  interface DashboardStats {
    totalOrders: number;
    revenueVnd: number;
    revenueUsd: number;
    completedOrders: number;
  }

  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    revenueVnd: 0,
    revenueUsd: 0,
    completedOrders: 0,
  });

  const fetchStats = async () => {
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/orders/dashboard",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Cookie.get(ACCESS_TOKEN)}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      const data = await res.json();
      setStats({
        totalOrders: Number(data.result.totalOrders || 0),
        revenueVnd: Number(data.result.revenueVnd || 0),
        revenueUsd: Number(data.result.revenueUsd || 0),
        completedOrders: Number(data.result.completedOrders || 0),
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatMoney = (amount: number, currency = "VND") => {
    if (currency === "VND") {
      return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
    }
    return (
      "$" +
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: "bg-brand-warning/20 text-brand-warning border-brand-warning/30",
      PAID: "bg-primary/20 text-primary border-primary/30",
      COMPLETED:
        "bg-brand-success/20 text-brand-success border-brand-success/30",
      CANCELLED: "bg-destructive/20 text-destructive border-destructive/30",
      REFUNDED: "bg-muted text-muted-foreground border-border",
    };
    return statusMap[status] || "bg-muted text-muted-foreground border-border";
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      PAID: "Đã thanh toán",
      COMPLETED: "Hoàn thành",
      PENDING: "Chưa thanh toán",
    };
    return statusMap[status] || status;
  };

  const performConfirmDelivery = async (orderId: string | null) => {
    if (!orderId) return;
    try {
      const deliveryContent = deliveryContents[orderId] || undefined;
      await confirmDelivery.mutateAsync({ orderId, deliveryContent });
      refetch();
      fetchStats();
    } catch (error) {
      console.error("Error confirming delivery:", error);
    } finally {
      setConfirmDialogOpen(false);
      setPendingOrderId(null);
    }
  };

  const handleViewOrder = (order: OrderResponse) => {
    setSelectedOrderId(order.id);
  };

  const handleCloseOrderDetail = () => {
    setSelectedOrderId(null);
  };

  const handleRefreshAfterAction = () => {
    refetch();
    refreshOrderDetail();
    fetchStats();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Có lỗi xảy ra khi tải dữ liệu</p>
          <Button onClick={() => refetch()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.totalOrders}
                  </p>
                </div>
                <Package className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Doanh thu (VND)
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {formatMoney(stats.revenueVnd, "VND")}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Doanh thu (USD)
                  </p>
                  <p className="text-2xl font-bold text-brand-success">
                    {formatMoney(stats.revenueUsd, "USD")}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-brand-success" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Đơn hoàn thành
                  </p>
                  <p className="text-2xl font-bold text-brand-success">
                    {stats.completedOrders}
                  </p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-brand-success" />
              </div>
            </CardContent>
          </Card>
          {/* fourth card retained as completed orders */}
        </div>

        {/* Filters */}
        <Card className="mb-6 bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Tìm kiếm theo tên sản phẩm, mã đơn hoặc người mua..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border text-foreground"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border rounded-lg bg-background border-border text-foreground"
                >
                  <option value="all">Tất cả</option>
                  <option value="PAID">Đã thanh toán</option>
                  <option value="COMPLETED">Hoàn thành</option>
                  <option value="PENDING">Chưa thanh toán</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground text-lg">Chưa có đơn hàng nào</p>
              <p className="text-muted-foreground text-sm mt-2">
                {searchTerm || statusFilter !== "all"
                  ? "Không tìm thấy đơn hàng phù hợp"
                  : "Bạn chưa có đơn hàng nào"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order: OrderResponse) => {
              return (
                <Card
                  key={order.id}
                  className="bg-card border-border hover:border-primary/50 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Product Image */}
                      {order.thumbnailUrl && (
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={order.thumbnailUrl}
                            alt={order.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Order Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg text-foreground">
                                {order.productName}
                              </h3>
                              <Badge
                                className={`${getStatusColor(order.status)} border flex items-center gap-1`}
                              >
                                {getStatusLabel(order.status)}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-muted-foreground mb-3">
                              <div>
                                <span className="font-medium">Mã đơn:</span>{" "}
                                <span className="font-mono text-xs">
                                  {order.orderCode}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium">Người mua:</span>{" "}
                                {order.buyerName || "N/A"}
                              </div>
                              <div>
                                <span className="font-medium">Email:</span>{" "}
                                {order.buyerEmail || "N/A"}
                              </div>

                              <div>
                                <span className="font-medium">Doanh thu:</span>{" "}
                                <span className="font-semibold text-brand-success">
                                  {formatMoney(order.netAmount, order.currency)}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium">Ngày bán:</span>{" "}
                                {formatDate(order.createdAt)}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">
                                  Tổng tiền:
                                </span>{" "}
                                <span className="font-semibold text-primary">
                                  {formatMoney(
                                    order.totalAmount,
                                    order.currency
                                  )}
                                </span>
                              </div>
                              {order.platformFee > 0 && (
                                <div>
                                  <span className="text-muted-foreground">
                                    Phí sàn:
                                  </span>{" "}
                                  <span className="text-muted-foreground">
                                    {formatMoney(
                                      order.platformFee,
                                      order.currency
                                    )}
                                  </span>
                                </div>
                              )}
                              <div>
                                <span className="font-medium">Số lượng:</span>{" "}
                                {order.quantity}
                              </div>
                              {order.paymentTransactionId && (
                                <div>
                                  <span className="text-muted-foreground">
                                    Mã giao dịch:
                                  </span>{" "}
                                  <span className="font-mono text-xs">
                                    {order.paymentTransactionId.substring(0, 8)}
                                    ...
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                          {order.buyerContent && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                setCurrentBuyerContent(
                                  order.buyerContent || ""
                                );
                                setViewContentDialogOpen(true);
                              }}
                              className="bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Xem ghi chú
                            </Button>
                          )}
                          {order.status === "PENDING" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setDeleteTargetId(order.id);
                                setDeleteDialogOpen(true);
                              }}
                              disabled={!!deletingId}
                            >
                              Xóa đơn
                            </Button>
                          )}
                          {order.status === "PAID" && (
                            <div className="flex flex-col gap-2 w-full md:w-auto">
                              <input
                                placeholder="Nội dung giao hàng (tùy chọn)"
                                value={deliveryContents[order.id] || ""}
                                onChange={(e: any) =>
                                  setDeliveryContents((prev) => ({
                                    ...prev,
                                    [order.id]: e.target.value,
                                  }))
                                }
                                className="px-3 py-2 rounded border border-border bg-background text-foreground w-full"
                              />
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => {
                                  setPendingOrderId(order.id);
                                  setConfirmDialogOpen(true);
                                }}
                                disabled={confirmDelivery.isPending}
                                className="bg-brand-success hover:bg-brand-success/90"
                              >
                                <Truck className="w-4 h-4 mr-2" />
                                Xác nhận giao hàng
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="mt-6 flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              Trước
            </Button>
            <span className="px-4 py-2 text-sm text-muted-foreground flex items-center">
              Trang {page + 1}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
              disabled={filteredOrders.length < size}
            >
              Sau
            </Button>
          </div>
        )}
      </div>

      {/* Order Detail Dialog */}
      <OrderDetailDialog
        open={selectedOrderId !== null}
        onOpenChange={(open: any) => {
          if (!open) handleCloseOrderDetail();
        }}
        order={selectedOrder}
        loading={orderDetailLoading}
        onRefresh={handleRefreshAfterAction}
      />
      {/* Confirm Delivery Dialog */}
      <AlertDialog
        open={confirmDialogOpen}
        onOpenChange={(open: boolean) => {
          setConfirmDialogOpen(open);
          if (!open) setPendingOrderId(null);
        }}
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
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => performConfirmDelivery(pendingOrderId)}
            >
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Delete Order Dialog */}
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open: boolean) => {
          setDeleteDialogOpen(open);
          if (!open) setDeleteTargetId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa đơn</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa đơn hàng này? Hành động không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deletingId}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!deleteTargetId) return;
                try {
                  setDeletingId(deleteTargetId);
                  const token = Cookie.get(ACCESS_TOKEN);

                  const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/seller/orders/${deleteTargetId}`,
                    {
                      method: "DELETE",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  if (!res.ok) throw new Error("Delete failed");
                  setDeleteDialogOpen(false);
                  setDeleteTargetId(null);
                  if (typeof refetch === "function") refetch();
                  fetchStats();
                } catch (err) {
                  console.error(err);
                } finally {
                  setDeletingId(null);
                }
              }}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* --- DIALOG MỚI: XEM BUYER CONTENT --- */}
      <AlertDialog
        open={viewContentDialogOpen}
        onOpenChange={setViewContentDialogOpen}
      >
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Ghi chú từ người mua
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="mt-4">
                <div className="bg-muted p-4 rounded-md border border-border text-foreground font-mono text-sm whitespace-pre-wrap break-words max-h-[60vh] overflow-y-auto">
                  {currentBuyerContent}
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Đóng</AlertDialogCancel>
            {/* Nút copy nhanh tiện lợi cho seller */}
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault(); // Ngăn đóng dialog ngay lập tức
                navigator.clipboard.writeText(currentBuyerContent);
                // Có thể thêm toast thông báo đã copy ở đây
              }}
            >
              Copy nội dung
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
