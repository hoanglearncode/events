"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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

        
      </DialogContent>
    </Dialog>
  );
};

export default ProductOrdersDialog;
