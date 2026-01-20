// components/features/admin/orders/OrdersFilter.tsx

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";
import { ACCESS_TOKEN } from "@/shared/const/cookie";
import { decodeToken } from "@/middleware";

interface OrdersFilterProps {
  activeFilter: string;
  searchTerm: string;
  onFilterChange: (filter: string) => void;
  onSearchChange: (search: string) => void;
  viewMode?: "all" | "mine";
  onViewModeChange?: (mode: "all" | "mine") => void;
}

const FILTER_TABS = [
  "Tất cả",
  "Chờ thanh toán",
  "Đang xử lý",
  "Hoàn tất",
  "Hoàn tiền",
  "Đã hủy",
];

export function OrdersFilter({
  activeFilter,
  searchTerm,
  onFilterChange,
  onSearchChange,
  viewMode = "all",
  onViewModeChange,
}: OrdersFilterProps) {
  const token = Cookies.get(ACCESS_TOKEN);
  const hasToken = !!token;
  let userRole = "ADMIN";
  if (hasToken && token) {
    const decoded = decodeToken(token);
    if (decoded) {
      userRole = decoded.role;
    }
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-6">
        {FILTER_TABS.map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "default" : "secondary"}
            size="sm"
            onClick={() => onFilterChange(filter)}
            className={cn(
              "px-5 py-2 rounded-md text-xs font-bold transition-all",
              activeFilter === filter
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* Search and View Mode */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-md">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          <Input
            type="text"
            placeholder="Tìm theo Order ID, Email khách..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-muted border-border rounded-xl py-3 pl-12 pr-5 text-sm"
          />
        </div>

        {userRole === "ADMIN" && (
          <div className="flex gap-2 bg-muted rounded-sm p-1">
            <Button
              size="sm"
              variant={viewMode === "all" ? "default" : "ghost"}
              onClick={() => onViewModeChange("all")}
              className={cn(
                "px-4 py-2 rounded-sm text-xs font-medium transition-all",
                viewMode === "all"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Toàn sàn
            </Button>
            <Button
              size="sm"
              variant={viewMode === "mine" ? "default" : "ghost"}
              onClick={() => onViewModeChange("mine")}
              className={cn(
                "px-4 py-2 rounded-sm text-xs font-medium transition-all",
                viewMode === "mine"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Của tôi
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
