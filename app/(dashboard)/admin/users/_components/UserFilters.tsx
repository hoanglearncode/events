// pages/admin/users/_components/UserFilters.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface UserFiltersProps {
  search: string;
  status: string;
  role: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onReset: () => void;
}

export function UserFilters({
  search,
  status,
  role,
  onSearchChange,
  onStatusChange,
  onRoleChange,
  onReset,
}: UserFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm theo tên, email, số điện thoại..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Status Filter */}
      {/* <Select value={status || "ALL"} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
          <SelectItem value="ACTIVE">Đã kích hoạt</SelectItem>
          <SelectItem value="DELETE">Đã xóa gần đây</SelectItem>
          <SelectItem value="BANNED">Bị cấm</SelectItem>
        </SelectContent>
      </Select> */}

      {/* Role Filter */}
      {/* <Select value={role} onValueChange={onRoleChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Vai trò" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả vai trò</SelectItem>
          <SelectItem value="admin">Quản trị viên</SelectItem>
          <SelectItem value="user">Người dùng</SelectItem>
          <SelectItem value="seller">Kiểm duyệt viên</SelectItem>
        </SelectContent>
      </Select> */}

      {/* Reset Button */}
      <Button variant="outline" onClick={onReset} className="w-full md:w-auto">
        <X className="h-4 w-4 mr-2" />
        Đặt lại
      </Button>
    </div>
  );
}
