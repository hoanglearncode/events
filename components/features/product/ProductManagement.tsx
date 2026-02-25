"use client";

import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [currentProduct, setCurrentProduct] = useState<any | null>(
    null
  );


  /* ======================
   * ACTION HANDLERS
   ====================== */
  const handleOpenAction = (product: any) => {
    setCurrentProduct(product);
    setDialogOpen(true);
  };

  const handleConfirmAction = async (
    action: "approve" | "reject" | "feature" | "delete",
    reason: ""
  ) => {
    if (!currentProduct) return;

  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleTabChange = (value: typeof activeTab) => {
    setActiveTab(value);
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

      <Tabs value={activeTab}>
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
    </div>
  );
}
