"use client";

import { memo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RotateCcw } from "lucide-react";

import type {
  NotificationType,
  NotificationStatus,
} from "../_types/notification";

interface NotificationFiltersProps {
  searchTerm: string;
  typeFilter: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: NotificationType) => void;
  onStatusChange: (value: NotificationStatus) => void;
  onReset: () => void;
}

const TYPE_OPTIONS: { label: string; value: string }[] = [
  { label: "Tất cả loại", value: "all" },
  { label: "Thông tin", value: "info" },
  { label: "Thành công", value: "success" },
  { label: "Cảnh báo", value: "warning" },
  { label: "Lỗi", value: "error" },
];

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "Đang hoạt động", value: "active" },
  { label: "Đã lên lịch", value: "scheduled" },
  { label: "Đã hết hạn", value: "expired" },
];

export const NotificationFilters = memo(function NotificationFilters({
  searchTerm,
  typeFilter,
  statusFilter,
  onSearchChange,
  onTypeChange,
  onStatusChange,
  onReset,
}: NotificationFiltersProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      {/* SEARCH */}
      <div className="relative w-full md:max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm thông báo..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
          aria-label="Search notifications"
        />
      </div>

      {/* TYPE FILTER */}
      <Select value={typeFilter} onValueChange={onTypeChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Tất cả loại" />
        </SelectTrigger>
        <SelectContent>
          {TYPE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* STATUS FILTER */}
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Tất cả trạng thái" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* RESET */}
      <Button
        variant="outline"
        onClick={onReset}
        className="gap-2 md:ml-auto"
      >
        <RotateCcw className="h-4 w-4" />
        Đặt lại
      </Button>
    </div>
  );
});
