// components/admin/AdminManagement.tsx
"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductManagement from "./_components/Order";
import CategoryManagement from "./_components/Report";
import {
  Package,
  FolderTree,
  ShoppingBag,
  EraserIcon,
  MailWarning,
} from "lucide-react";

export default function AdminManagement() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Main Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            Quản lý Đơn hàng - Khiếu nại
          </h1>
          <p className="text-muted-foreground">
            Danh sách các đơn hàng đã bán - khiếu nại
          </p>
        </div>
        <CategoryManagement />
      </div>
    </div>
  );
}
