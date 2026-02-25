// components/admin/products/ProductManagementSeller.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductTableSeller from "./ProductTableSeller";
import ProductActionDialogSeller from "./ProductActionDialogSeller";

type FilterTab = "all" | "pending" | "approved" | "rejected";

export default function ProductManagementSeller() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any | null>(
    null
  );


  /* ======================
   * ACTIONS
   ====================== */
  const handleOpenAction = (product: any) => {
    setCurrentProduct(product);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async (reason: string) => {
    if (!currentProduct) return;

    try {
    } finally {
      setDialogOpen(false);
      setCurrentProduct(null);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
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

      <Input
        placeholder="Tìm kiếm sản phẩm..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="max-w-md"
      />


      <ProductActionDialogSeller
        open={dialogOpen}
        product={currentProduct}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
