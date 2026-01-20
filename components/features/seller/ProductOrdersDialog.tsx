"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useOrdersByProduct } from "@/hooks/queries/orderQueries";
import { Button } from "@/components/ui/button";
import { Package, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ProductOrdersDialogProps {
  productId: string | number;
  productName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductOrdersDialog: React.FC<ProductOrdersDialogProps> = ({
  productId,
  productName,
  open,
  onOpenChange,
}) => {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: orders = [],
    isLoading,
    refetch,
  } = useOrdersByProduct(
    productId,
    statusFilter || undefined,
    page,
    size,
    open
  );

  const formatMoney = (amount: number, currency = "VND") => {
    if (currency === "VND") {
      return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
    }
    return "$" + new Intl.NumberFormat("en-US").format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      PAID: "bg-blue-100 text-blue-800",
      COMPLETED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return statusMap[status] || "bg-gray-100 text-gray-800";
  };

  const filteredOrders = orders.filter((order: any) => {
    return (
      searchTerm === "" ||
      order.orderCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyer?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Đơn hàng của sản phẩm: {productName || `#${productId}`}
          </DialogTitle>
          <DialogDescription>
            Quản lý tất cả đơn hàng liên quan đến sản phẩm này
          </DialogDescription>
        </DialogHeader>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 py-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm theo mã đơn hoặc người mua..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            className="px-4 py-2 border rounded-lg bg-white"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">Đang chờ</option>
            <option value="PAID">Đã thanh toán</option>
            <option value="COMPLETED">Hoàn thành</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="py-8 text-center">
            <Package className="w-8 h-8 animate-pulse text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Đang tải...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Chưa có đơn hàng nào</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order: any) => (
              <div
                key={order.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm text-gray-600">
                        #{order.orderCode || order.id}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Người mua:</span>{" "}
                        {order.buyer || order.buyerEmail || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Số lượng:</span>{" "}
                        {order.qty || order.quantity || 1}
                      </div>
                      <div>
                        <span className="font-medium">Tổng tiền:</span>{" "}
                        <span className="font-semibold text-blue-600">
                          {formatMoney(
                            order.amount || order.totalAmount,
                            order.currency
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Ngày:</span>{" "}
                        {formatDate(order.createdAt || order.date)}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Chi tiết
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex justify-center gap-2 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              Trước
            </Button>
            <span className="px-4 py-2 text-sm text-gray-600 flex items-center">
              Trang {page + 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={filteredOrders.length < size}
            >
              Sau
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductOrdersDialog;
