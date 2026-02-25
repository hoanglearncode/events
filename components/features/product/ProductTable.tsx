"use client";

import React from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/shared/helpers/date";

/* =======================
   Helpers
======================= */

// Chuẩn hoá status từ API
const normalizeStatus = (status?: string) => {
  if (!status) return "Unknown";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const statusLabel = (status: string) => {
  const map: Record<string, { label: string; variant: any }> = {
    Submitted: { label: "Chờ duyệt", variant: "outline" },
    Active: { label: "Đang bán", variant: "default" },
    Rejected: { label: "Từ chối", variant: "destructive" },
    Banned: { label: "Cấm bán", variant: "destructive" },
    Removed: { label: "Đã xóa", variant: "secondary" },
    Unknown: { label: "Không rõ", variant: "secondary" },
  };

  return map[status] ?? { label: status, variant: "secondary" };
};

function StatusBadge({ status }: { status?: string }) {
  const s = statusLabel(normalizeStatus(status));
  return (
    <Badge variant={s.variant} className="uppercase text-xs font-bold">
      {s.label}
    </Badge>
  );
}

// Lấy giá an toàn
const getDisplayPrice = (product: any) => {
  const prices = product.meta?.prices;
  if (!Array.isArray(prices) || prices.length === 0) return "—";

  const price = prices[0];
  if (!price?.amount) return "—";

  return `${price.amount.toLocaleString()} ${price.currency || ""}`;
};

// Lấy tên sản phẩm
const getProductName = (product: any) =>
  product.meta?.name?.trim() || product.meta?.slug || `Sản phẩm #${product.id}`;

// Lấy avatar
const getThumbnail = (product: any) =>
  product.meta?.thumbnailUrl || product.meta?.galleryUrls?.[0] || undefined;

/* =======================
   Component
======================= */

type ProductTableProps = {
  products: any[];
  onAction: (product: any) => void;
  onViewDetail?: (product: any) => void;
  mode: string;
};

export default function ProductTable({
  products,
  onAction,
  onViewDetail,
  mode,
}: ProductTableProps) {
  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="w-12" />
            <TableHead>Sản phẩm</TableHead>
            <TableHead>Seller</TableHead>
            <TableHead>Danh mục</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead>Giá</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="py-24 text-center text-muted-foreground"
              >
                Không có dữ liệu
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => {
              const name = getProductName(product);
              const thumbnail = getThumbnail(product);

              return (
                <TableRow key={product.id}>
                  <TableCell />

                  {/* Product */}
                  <TableCell>
                    <div className="flex gap-3 items-center">
                      <Avatar className="h-10 w-10">
                        {thumbnail && (
                          <AvatarImage src={thumbnail} alt={name} />
                        )}
                        <AvatarFallback>
                          {name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col">
                        <span className="font-medium">{name}</span>
                        <span className="text-xs text-muted-foreground">
                          #{product.id}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Seller */}
                  <TableCell>{product.meta?.sellerName || "System"}</TableCell>

                  {/* Category */}
                  <TableCell>{product.meta?.categoryName || "—"}</TableCell>

                  {/* Status */}
                  <TableCell>
                    <StatusBadge status={product.status} />
                  </TableCell>

                  {/* Date */}
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(product.createdAt) || "—"}
                  </TableCell>

                  {/* Price */}
                  <TableCell className="font-semibold">
                    {getDisplayPrice(product)}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onViewDetail?.(product)}
                        >
                          Xem chi tiết
                        </DropdownMenuItem>
                        {mode === "my" && (
                          <DropdownMenuItem
                            onClick={() =>
                              (window.location.href = `/admin/products/edit?id=${product.id}`)
                            }
                          >
                            Cập nhật
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => onAction(product)}
                        >
                          ⚠ Hành động
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
