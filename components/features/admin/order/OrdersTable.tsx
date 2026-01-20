// components/features/admin/orders/OrdersTable.tsx

"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Loader2 } from "lucide-react";
import { Order } from "@/types/order";
import { StatusBadge } from "./StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";

interface OrdersTableProps {
  orders: Order[];
  loading: boolean;
  onViewOrder: (order: Order) => void;
}

export function OrdersTable({
  orders,
  loading,
  onViewOrder,
}: OrdersTableProps) {
  if (loading) {
    return (
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Order ID
                </TableHead>
                <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Khách hàng
                </TableHead>
                <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Sản phẩm
                </TableHead>
                <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Tổng tiền
                </TableHead>
                <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Lợi nhuận
                </TableHead>
                <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Trạng thái
                </TableHead>
                <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Ngày tạo
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-sm text-muted-foreground">Không có đơn hàng nào</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Order ID
              </TableHead>
              <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Khách hàng
              </TableHead>
              <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Sản phẩm
              </TableHead>
              <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Tổng tiền
              </TableHead>
              <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Lợi nhuận
              </TableHead>
              <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Trạng thái
              </TableHead>
              <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Ngày tạo
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.id}
                className="hover:bg-muted/20 transition-colors group"
              >
                <TableCell className="font-bold text-sm">{order.id}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {order.buyer}
                </TableCell>
                <TableCell>
                  <p className="text-xs font-bold">{order.product}</p>
                  <p className="text-[10px] text-muted-foreground">
                    SL: {order.qty}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm font-bold">{order.amount}₫</p>
                  <p className="text-[10px] text-brand-error">
                    Phí: {order.fee}₫
                  </p>
                </TableCell>
                <TableCell className="text-sm font-extrabold text-brand-success">
                  {order.payout}₫
                </TableCell>
                <TableCell>
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-[11px] text-muted-foreground">
                  {order.date}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewOrder(order)}
                    className="hover:bg-primary/10 hover:text-primary"
                  >
                    <Eye size={18} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
