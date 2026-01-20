"use client";

import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type AdminProduct } from "@/hooks/queries/useProductsQuery";
import { useProducts } from "@/hooks/feature/useProducts";
import ProductTable from "./ProductTable";
import ProductActionDialog from "./ProductActionDialog";
import { ProductStats } from "./ProductStats";
import { TablePagination } from "./paga";
import { toast } from "sonner";

export default function ProductManagement() {
  const [activeTab, setActiveTab] = useState<
    "all" | "pending" | "approved" | "rejected" | "banned" | "violations" | "my"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<AdminProduct | null>(
    null
  );

  const {
    products,
    pagination,
    isLoading,
    mode,
    setPage,
    setPerPage,
    setQuery,
    setMode,
    approveMutation,
    rejectMutation,
    deleteMutation,
    updateMutation,
    featureMutation,
  } = useProducts();

  /* ======================
   * ACTION HANDLERS
   ====================== */
  const handleOpenAction = (product: AdminProduct) => {
    setCurrentProduct(product);
    setDialogOpen(true);
  };

  const handleConfirmAction = async (
    action: "approve" | "reject" | "feature" | "delete",
    reason: ""
  ) => {
    if (!currentProduct) return;

    try {
      switch (action) {
        case "approve":
          currentProduct.status === "active"
            ? toast.warning("Sản phẩm này đã được duyệt ")
            : await approveMutation.mutateAsync(currentProduct.id);
          break;

        case "reject":
          currentProduct.status === "active"
            ? toast.warning("Sản phẩm này đã được duyệt ")
            : await rejectMutation.mutateAsync({
                id: currentProduct.id,
                reason,
              });
          break;

        case "delete":
          await deleteMutation.mutateAsync(currentProduct.id);
          break;

        case "feature":
          currentProduct.status !== "active"
            ? toast.warning("Sản phẩm này chưa được duyệt ")
            : await featureMutation.mutateAsync({
                id: currentProduct.id,
                featured: !currentProduct.featured,
              });
          break;
      }
    } finally {
      setDialogOpen(false);
      setCurrentProduct(null);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setQuery(value);
  };

  const handleTabChange = (value: typeof activeTab) => {
    setActiveTab(value);
    setPage(0);
    setMode(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
        <Link href="/admin/products/add" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" />
          Đăng sản phẩm mới
        </Link>
      </div>

      <ProductStats />

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="pending">Chờ duyệt</TabsTrigger>
          <TabsTrigger value="my">Của tôi</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* <Input
        placeholder="Tìm kiếm sản phẩm..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="max-w-md"
      /> */}

      {isLoading ? (
        <div className="py-24 text-center text-muted-foreground">
          Đang tải dữ liệu...
        </div>
      ) : (
        <>
          <ProductTable
            products={products}
            onAction={handleOpenAction}
            mode={mode}
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

      <ProductActionDialog
        open={dialogOpen}
        product={currentProduct}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
