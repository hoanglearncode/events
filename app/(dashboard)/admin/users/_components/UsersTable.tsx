// pages/admin/users/_components/UsersTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MoreHorizontal,
  Eye,
  UserCheck,
  UserX,
  Ban,
  Unlock,
  Key,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin?: string;
}

interface UsersTableProps {
  users: any[];
  isLoading: boolean;
  onViewDetail: (user: User) => void;
  onActivate: (user: User) => void;
  onDeactivate: (user: User) => void;
  onBan: (user: User) => void;
  onUnban: (user: User) => void;
  onResetPassword: (user: User) => void;
  onDelete: (user: User) => void;
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    active: { label: "Đã kích hoạt", variant: "default" as const },
    inactive: { label: "Chưa kích hoạt", variant: "secondary" as const },
    banned: { label: "Bị cấm", variant: "destructive" as const },
  };
  return (
    statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive
  );
};

const getRoleBadge = (role: string) => {
  const roleConfig = {
    admin: { label: "Admin", variant: "default" as const },
    user: { label: "Người dùng", variant: "outline" as const },
    moderator: { label: "Kiểm duyệt", variant: "secondary" as const },
  };
  return roleConfig[role as keyof typeof roleConfig] || roleConfig.user;
};

export function UsersTable({
  users,
  isLoading,
  onViewDetail,
  onActivate,
  onDeactivate,
  onBan,
  onUnban,
  onResetPassword,
  onDelete,
}: UsersTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Không tìm thấy người dùng nào
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Người dùng</TableHead>
            <TableHead>Liên hệ</TableHead>
            <TableHead>Vai trò</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const statusBadge = getStatusBadge(user.status);
            const roleBadge = getRoleBadge(user.role);

            return (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>
                        {user.fullName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.fullName}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.contactEmail}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {user.contactPhone || "Chưa cập nhật"}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={roleBadge.variant}>{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.status}>{user.status}</Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(user.createdAt), "dd/MM/yyyy", {
                    locale: vi,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewDetail(user)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />

                      {user.status === "BANNED" && (
                        <DropdownMenuItem onClick={() => onActivate(user)}>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Bỏ cấm
                        </DropdownMenuItem>
                      )}

                      {user.status !== "BANNED" && (
                        <DropdownMenuItem onClick={() => onBan(user)}>
                          <Ban className="h-4 w-4 mr-2" />
                          Cấm tài khoản
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem onClick={() => onResetPassword(user)}>
                        <Key className="h-4 w-4 mr-2" />
                        Đặt lại mật khẩu
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => onDelete(user)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa tài khoản
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
