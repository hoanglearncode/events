// components/admin/products/ProductManagementSeller.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminProduct } from "@/hooks/queries/useProductsQuery";
import { useProducts } from "@/hooks/feature/useProducts";
import ProductTableSeller from "./ProductTableSeller";
import ProductActionDialogSeller from "./ProductActionDialogSeller";
import { TablePagination } from "./paga";

type FilterTab = "all" | "pending" | "approved" | "rejected";

export default function ProductManagementSeller() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<AdminProduct | null>(
    null
  );

  const {
    products,
    pagination,
    isLoading,
    setPage,
    setPerPage,
    setQuery,
    setMode,
    deleteMutation,
  } = useProducts();

  /* ======================
   * INIT: chỉ lấy sản phẩm của tôi
   ====================== */
  useEffect(() => {
    setMode("my");
  }, [setMode]);

  /* ======================
   * FILTER
   ====================== */
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    switch (activeTab) {
      case "pending":
        filtered = filtered.filter((p) => p.status === "Submitted");
        break;
      case "approved":
        filtered = filtered.filter((p) => p.status === "Active");
        break;
      case "rejected":
        filtered = filtered.filter((p) => p.status === "Rejected");
        break;
    }

    return filtered;
  }, [products, activeTab, searchQuery]);

  /* ======================
   * ACTIONS
   ====================== */
  const handleOpenAction = (product: AdminProduct) => {
    setCurrentProduct(product);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!currentProduct) return;

    try {
      await deleteMutation.mutateAsync(currentProduct.id);
    } finally {
      setDialogOpen(false);
      setCurrentProduct(null);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setQuery(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sản phẩm của tôi</h1>
        <Link href="/seller/products/new" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" />
          Đăng sản phẩm mới
        </Link>
      </div>

      {isLoading ? (
        <div className="py-24 text-center text-muted-foreground">
          Đang tải dữ liệu...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-24 text-center text-muted-foreground">
          {searchQuery
            ? "Không tìm thấy sản phẩm nào"
            : "Bạn chưa có sản phẩm nào"}
        </div>
      ) : (
        <>
          <ProductTableSeller
            products={filteredProducts}
            onAction={handleOpenAction}
            onViewDetail={(product) =>
              window.open(
                `/products/${encodeURIComponent(btoa(product.id))}`,
                "_blank"
              )
            }
          />

          {pagination && (
            <TablePagination
              pagination={pagination}
              onPageChange={(p) => setPage(p - 1)}
              onPerPageChange={setPerPage}
            />
          )}
        </>
      )}

      <ProductActionDialogSeller
        open={dialogOpen}
        product={currentProduct}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
