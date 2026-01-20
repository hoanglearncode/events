"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Package,
  DollarSign,
  CheckCircle2,
  Clock,
  ExternalLink,
  XCircle,
  Loader2,
  Trash2,
  Copy,
  DownloadCloud,
  MessageSquare,
} from "lucide-react";
import { usePurchaseHistory } from "@/hooks/queries/orderQueries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { ACCESS_TOKEN } from "@/shared/const/cookie";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

import { ComplaintDialog } from "./dialog";
import { toast } from "sonner";

// Interface khớp với BuyerDashboardResponse từ Java Backend
interface BuyerDashboardResponse {
  totalOrders: number;
  completedOrders: number;
  totalSpentVnd: number;
  totalSpentUsd: number;
  pendingOrders: number;
}

// Order item: bổ sung listAccount (mảng có thể chứa string hoặc object)
interface OrderResponse {
  id: string;
  orderCode: string;
  status: string;
  totalAmount: number;
  currency: string;
  productId: string | number;
  productName: string;
  productSlug: string;
  thumbnailUrl?: string | null;
  quantity: number;
  sellerName: string;
  platformFee: number;
  paymentTransactionId?: string;
  createdAt: string;
  buyerEmail?: string | null;
  buyerName?: string | null;
  buyerPhone?: string | null;
  deliveryContent?: string | null;
  netAmount?: number;
  updatedAt?: string | null;

  listAccount?: Array<string | Record<string, any>>;
  message?: string | null;
}

const MyDataPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("approved");

  // complaint dialog
  const [openComplaint, setOpenComplaint] = useState(false);
  const [complaintOrderId, setComplaintOrderId] = useState<
    string | number | null
  >(null);

  // stats
  const [stats, setStats] = useState<BuyerDashboardResponse>({
    totalOrders: 0,
    completedOrders: 0,
    totalSpentVnd: 0,
    totalSpentUsd: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = Cookies.get(ACCESS_TOKEN);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders/buyer/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.result) {
          setStats(response.data.result);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    fetchDashboardStats();
  }, []);

  // purchase history hook
  const { data, isLoading, error, refetch } = usePurchaseHistory(page, size);

  const allOrders = useMemo(() => {
    return data?.result?.orders ?? [];
  }, [data]);

  const pagination = data?.pagination;

  const [loadingTx, setLoadingTx] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<OrderResponse | null>(
    null
  );

  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(
    null
  );

  // helpers
  const formatMoney = (amount: number, currency = "VND") => {
    if (currency === "VND") {
      return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
    }
    return "$" + new Intl.NumberFormat("en-US").format(amount);
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

  const getStatusConfig = (status: string) => {
    const statusMap: Record<
      string,
      { label: string; color: string; icon: React.ReactNode }
    > = {
      PENDING: {
        label: "Đang chờ",
        color: "bg-yellow-100 text-yellow-800 border-yellow-300",
        icon: <Clock className="w-3 h-3" />,
      },
      PAID: {
        label: "Đã thanh toán",
        color: "bg-blue-100 text-blue-800 border-blue-300",
        icon: <CheckCircle2 className="w-3 h-3" />,
      },
      COMPLETED: {
        label: "Hoàn thành",
        color: "bg-green-100 text-green-800 border-green-300",
        icon: <CheckCircle2 className="w-3 h-3" />,
      },
      CANCELLED: {
        label: "Đã hủy",
        color: "bg-red-100 text-red-800 border-red-300",
        icon: <XCircle className="w-3 h-3" />,
      },
      REFUNDED: {
        label: "Đã hoàn tiền",
        color: "bg-gray-100 text-gray-800 border-gray-300",
        icon: <XCircle className="w-3 h-3" />,
      },
    };
    return (
      statusMap[status] || {
        label: status,
        color: "bg-gray-100 text-gray-800 border-gray-300",
        icon: <Package className="w-3 h-3" />,
      }
    );
  };

  // filter
  const approvedStatuses = ["PAID", "COMPLETED", "PENDING"];
  const filteredOrders = useMemo(() => {
    return allOrders.filter((order: OrderResponse) => {
      const isApproved = approvedStatuses.includes(order.status);
      if (statusFilter === "approved" && !isApproved) return false;
      if (
        statusFilter !== "approved" &&
        statusFilter !== "all" &&
        order.status !== statusFilter
      )
        return false;

      const matchesSearch =
        searchTerm === "" ||
        order.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.sellerName?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [allOrders, searchTerm, statusFilter]);

  const handleViewProduct = (order: OrderResponse) => {
    setSelectedOrder(order);
  };

  const handleRetryPayment = async (order: OrderResponse) => {
    const txId = order.paymentTransactionId;
    if (!txId) {
      toast.warning("Đơn hàng chưa có lịch sử giao dịch để thử lại.");
      return;
    }
    try {
      setLoadingTx(order.id);
      const token = Cookies.get(ACCESS_TOKEN);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payments/retry/${txId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        try {
          const errJson = JSON.parse(text);
          throw new Error(errJson.message || "Retry failed");
        } catch {
          throw new Error(text || "Retry payment failed");
        }
      }

      const data = await res.json();
      const checkoutUrl = data?.result?.checkoutUrl;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      } else {
        toast.error("Không nhận được link thanh toán từ hệ thống.");
      }
    } catch (error: any) {
      console.error("Retry payment error:", error);
      toast.error(
        error.message || "Không thể tiếp tục thanh toán. Vui lòng thử lại sau."
      );
    } finally {
      setLoadingTx(null);
    }
  };

  const handleCancelOrder = (order: OrderResponse) => {
    setOrderToCancel(order);
  };

  const performCancelOrder = async () => {
    if (!orderToCancel) return;
    try {
      setDeletingId(orderToCancel.id);
      const token = Cookies.get(ACCESS_TOKEN);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderToCancel.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Cancel order failed");
      }

      toast.success("Hủy đơn thành công");
      if (typeof refetch === "function") refetch();
      setOrderToCancel(null);
    } catch (error) {
      console.error("Cancel order error:", error);
      toast.error("Không thể hủy đơn. Vui lòng thử lại sau.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpenComplaint = (order: OrderResponse) => {
    setComplaintOrderId(order.id);
    setOpenComplaint(true);
  };

  // ---------- NEW helpers for listAccount ----------
  const isUrl = (s: string) => {
    return /^https?:\/\//i.test(s);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Đã sao chép vào clipboard");
    } catch (e) {
      toast.error("Không thể sao chép vào clipboard");
    }
  };

  const downloadCsv = (
    arr: Array<string | Record<string, any>>,
    filename = "listAccount.csv"
  ) => {
    // Convert to CSV: if items are objects use JSON-stringify in a column, else raw string
    const rows = arr.map((v) => {
      if (typeof v === "string") return `"${v.replace(/"/g, '""')}"`;
      return `"${JSON.stringify(v).replace(/"/g, '""')}"`;
    });
    const csv = rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Bắt đầu tải CSV");
  };

  // -------------------------------------------------

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
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
    <div className="min-h-screen bg-background text-foreground px-4">
      <div className="max-w-7xl mx-auto">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
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
                  <p className="text-sm text-muted-foreground">Đơn đã duyệt</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.completedOrders}
                  </p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Tổng đã chi (VND)
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatMoney(stats.totalSpentVnd, "VND")}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Tổng đã chi (USD)
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatMoney(stats.totalSpentUsd, "USD")}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Đơn đang chờ</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.pendingOrders}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ORDERS */}
        {filteredOrders.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground text-lg">Không tìm thấy đơn hàng</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order: OrderResponse) => {
              const statusConfig = getStatusConfig(order.status);
              const acctCount = order.listAccount?.length ?? 0;

              return (
                <Card
                  key={order.id}
                  className="bg-card border-border hover:border-primary/50 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      {order.thumbnailUrl && (
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={order.thumbnailUrl}
                            alt={order.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg text-foreground">
                            {order.productName}
                          </h3>

                          <Badge
                            className={`${statusConfig.color} border flex items-center gap-1`}
                          >
                            {statusConfig.icon} {statusConfig.label}
                          </Badge>

                          {/* Nếu có tài nguyên, show badge số lượng */}
                          {acctCount > 0 && (
                            <Badge className="ml-2 bg-indigo-100 text-indigo-800 border-indigo-300">
                              {acctCount} tài nguyên
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
                          <div>
                            <span className="font-medium">Mã đơn:</span>{" "}
                            <span className="font-mono text-xs">
                              {order.orderCode}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Người bán:</span>{" "}
                            {order.sellerName}
                          </div>
                          <div />
                          <div>
                            <span className="font-medium">Ngày:</span>{" "}
                            {formatDate(order.createdAt)}
                          </div>
                        </div>

                        <div className="text-sm">
                          <span className="text-muted-foreground">
                            Tổng tiền:{" "}
                          </span>
                          <span className="font-semibold text-primary">
                            {formatMoney(order.totalAmount, order.currency)}
                          </span>
                        </div>

                        <div className="flex gap-2 mt-4 pt-4 border-t border-border flex-wrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewProduct(order)}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" /> Xem chi
                            tiết đơn hàng
                          </Button>

                          {order.status === "PENDING" && (
                            <>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleRetryPayment(order)}
                                disabled={loadingTx === order.id}
                              >
                                {loadingTx === order.id ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                                    Đang chuyển...
                                  </>
                                ) : (
                                  <>
                                    <ExternalLink className="w-4 h-4 mr-2" />{" "}
                                    Tiếp tục thanh toán
                                  </>
                                )}
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelOrder(order)}
                                disabled={deletingId === order.id}
                              >
                                {deletingId === order.id ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4 mr-2" />
                                )}
                                Hủy đơn
                              </Button>
                            </>
                          )}

                          {["PAID", "COMPLETED"].includes(order.status) && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleOpenComplaint(order)}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Khiếu nại
                            </Button>
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
        {pagination && filteredOrders.length > 0 && (
          <div className="mt-6 flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              Trước
            </Button>
            <span className="px-4 py-2 text-sm text-muted-foreground flex items-center">
              Trang {page + 1} / {pagination.last_page}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
              disabled={page + 1 >= pagination.last_page}
            >
              Sau
            </Button>
          </div>
        )}

        {/* Cancel dialog */}
        <Dialog
          open={!!orderToCancel}
          onOpenChange={(open) => {
            if (!open) setOrderToCancel(null);
          }}
        >
          <DialogContent>
            <DialogTitle>Xác nhận hủy đơn</DialogTitle>
            <DialogDescription>
              {orderToCancel
                ? `Bạn có chắc muốn hủy đơn ${orderToCancel.orderCode} - ${orderToCancel.productName}?`
                : ""}
            </DialogDescription>
            <div className="mt-4 flex gap-2 justify-end">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={() => setOrderToCancel(null)}
                >
                  Huỷ
                </Button>
              </DialogClose>
              <Button
                onClick={() => performCancelOrder()}
                disabled={deletingId === orderToCancel?.id}
              >
                {deletingId === orderToCancel?.id ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                Xác nhận hủy
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Order details dialog (with listAccount table) */}
        {/* Order details dialog (with listAccount table) */}
        <Dialog
          open={!!selectedOrder}
          onOpenChange={(open) => {
            if (!open) setSelectedOrder(null);
          }}
        >
          <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
            <DialogTitle>Chi tiết đơn hàng</DialogTitle>
            <DialogDescription>
              {selectedOrder
                ? `Mã: ${selectedOrder.orderCode} • ${getStatusConfig(selectedOrder.status).label}`
                : ""}
            </DialogDescription>

            {selectedOrder && (
              <div className="mt-4 overflow-y-auto pr-2 -mr-2">
                {/* 1. Thông tin chung (Chia 2 cột) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left column: Sản phẩm & Người bán */}
                  <div>
                    {selectedOrder.thumbnailUrl && (
                      <div className="w-40 h-40 rounded overflow-hidden mb-3 bg-muted border border-border">
                        <img
                          src={selectedOrder.thumbnailUrl}
                          alt={selectedOrder.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <p className="text-sm text-muted-foreground">Sản phẩm</p>
                    <p className="font-semibold mb-3">
                      {selectedOrder.productName}
                    </p>

                    <p className="text-sm text-muted-foreground">Người bán</p>
                    <p className="mb-3">{selectedOrder.sellerName || "—"}</p>

                    <p className="text-sm text-muted-foreground">Số lượng</p>
                    <p className="mb-3">{selectedOrder.quantity}</p>

                    {/* Đã xóa phần Ghi chú giao hàng nhỏ ở đây */}
                  </div>

                  {/* Right column: Người mua & Thanh toán */}
                  <div>
                    <p className="text-sm text-muted-foreground">Người mua</p>
                    <p className="font-medium">
                      {selectedOrder.buyerName || "—"}
                    </p>

                    <p className="text-sm text-muted-foreground mt-2">Email</p>
                    <p className="mb-2">{selectedOrder.buyerEmail || "—"}</p>

                    <p className="text-sm text-muted-foreground">
                      Số điện thoại
                    </p>
                    <p className="mb-3">{selectedOrder.buyerPhone || "—"}</p>

                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        Thanh toán
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-primary text-lg">
                          {formatMoney(
                            selectedOrder.totalAmount,
                            selectedOrder.currency
                          )}
                        </span>
                        {selectedOrder.netAmount !== undefined && (
                          <span className="text-xs text-muted-foreground">
                            (Net:{" "}
                            {formatMoney(
                              selectedOrder.netAmount,
                              selectedOrder.currency
                            )}
                            )
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground">
                        Phí nền tảng
                      </p>
                      <p className="mb-2">
                        {formatMoney(
                          selectedOrder.platformFee,
                          selectedOrder.currency
                        )}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        ID giao dịch
                      </p>
                      <p className="mb-2 font-mono text-xs break-all">
                        {selectedOrder.paymentTransactionId || "—"}
                      </p>

                      <p className="text-sm text-muted-foreground">Tạo lúc</p>
                      <p className="mb-2">
                        {formatDate(selectedOrder.createdAt)}
                      </p>

                      <p className="text-sm text-muted-foreground">Cập nhật</p>
                      <p className="mb-2">
                        {selectedOrder.updatedAt
                          ? formatDate(selectedOrder.updatedAt)
                          : "—"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Ghi chú giao hàng (Hiển thị to, full width) */}
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Package className="w-4 h-4" /> Nội dung giao hàng / Ghi chú
                    từ người bán
                  </h4>
                  <div className="w-full bg-muted/30 border border-border rounded-lg p-4 min-h-[100px]">
                    {selectedOrder.deliveryContent ? (
                      <p className="text-sm font-mono whitespace-pre-wrap break-words leading-relaxed">
                        {selectedOrder.deliveryContent}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        Không có nội dung giao hàng.
                      </p>
                    )}
                  </div>
                </div>

                {/* Chỉ hiển thị khi có message */}
                {selectedOrder.message && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 text-blue-600">
                      <MessageSquare className="w-4 h-4" /> Phản hồi / Tin nhắn từ người bán
                    </h4>
                    <div className="w-full bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-lg p-4">
                      <p className="text-sm whitespace-pre-wrap break-words leading-relaxed text-foreground">
                        {selectedOrder.message}
                      </p>
                    </div>
                  </div>
                )}

                {/* 3. Bảng tài nguyên (List Account) */}
                {selectedOrder.listAccount &&
                  selectedOrder.listAccount.length > 0 && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold">
                          Tài nguyên đính kèm (
                          {selectedOrder.listAccount.length})
                        </h4>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              downloadCsv(
                                selectedOrder.listAccount || [],
                                `listAccount_${selectedOrder.orderCode || selectedOrder.id}.csv`
                              )
                            }
                          >
                            <DownloadCloud className="w-4 h-4 mr-2" /> Tải CSV
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              const text = (selectedOrder.listAccount || [])
                                .map((it) =>
                                  typeof it === "string"
                                    ? it
                                    : JSON.stringify(it)
                                )
                                .join("\n");
                              copyToClipboard(text);
                            }}
                          >
                            <Copy className="w-4 h-4 mr-2" /> Sao chép tất cả
                          </Button>
                        </div>
                      </div>

                      <div className="overflow-x-auto border rounded">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-muted/10 text-left">
                              <th className="p-2">#</th>
                              <th className="p-2">Giá trị</th>
                              <th className="p-2 w-[150px]">Hành động</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedOrder.listAccount.map((item, idx) => {
                              const valueStr =
                                typeof item === "string"
                                  ? item
                                  : JSON.stringify(item);
                              return (
                                <tr
                                  key={idx}
                                  className="odd:bg-background even:bg-muted/5"
                                >
                                  <td className="p-2 align-top">{idx + 1}</td>
                                  <td className="p-2 align-top break-all whitespace-pre-wrap">
                                    {typeof item === "string" ? (
                                      item
                                    ) : (
                                      <pre className="text-xs whitespace-pre-wrap">
                                        {JSON.stringify(item, null, 2)}
                                      </pre>
                                    )}
                                  </td>
                                  <td className="p-2 align-top">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() =>
                                          copyToClipboard(valueStr)
                                        }
                                      >
                                        <Copy className="w-4 h-4" />
                                      </Button>
                                      {typeof item === "string" &&
                                        isUrl(item) && (
                                          <a
                                            href={item}
                                            target="_blank"
                                            rel="noreferrer"
                                          >
                                            <Button size="sm" variant="outline">
                                              <ExternalLink className="w-4 h-4" />
                                            </Button>
                                          </a>
                                        )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
              </div>
            )}

            <div className="mt-4 flex justify-end gap-2 pt-2 border-t border-border">
              <DialogClose asChild>
                <Button variant="outline">Đóng</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>

        {/* Complaint dialog */}
        <ComplaintDialog
          orderId={complaintOrderId}
          open={openComplaint}
          onOpenChange={(open) => {
            setOpenComplaint(open);
            if (!open) {
              setComplaintOrderId(null);
              if (typeof refetch === "function") refetch();
            }
          }}
        />
      </div>
    </div>
  );
};

export default MyDataPage;
